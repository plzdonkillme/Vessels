import { PlainTile, EmptyTile } from "./Tile";
import { Map, Knight } from './Map';

class MapSerializer {
    constructor() {
        this.classNameToString = {
            'Plain' : 'p',
            'Empty' : 'e',
            'Knight' : 'k',
        }
        this.stringToClass = {
            'p': PlainTile,
            'e': EmptyTile,
            'k': Knight,
        }
    }

    serialize(map) {
        let mapString = '';
        const tiles = map.getTiles();
        for (let i = 0; i < tiles.length; i++) {
            const tileRow = tiles[i];
            for (let j = 0; j < tileRow.length; j++) {
                const tile = tileRow[j];
                const tileString = `${this.classNameToString[tile.getClassName()]}-${tile.getH()}`;
                mapString += tileString;
                if (j !== tileRow.length - 1) {
                    mapString += ' ';
                }
            }
            mapString += '\n';
        }
        mapString += '===\n';
        const mapObjects = map.getMapObjects();
        for (let i = 0; i < mapObjects.length; i++) {
            const mapObject = mapObjects[i];
            const mapObjectString = `${this.classNameToString[mapObject.getClassName()]}-${mapObject.serialize()}`;
            mapString += mapObjectString;
            if (i !== mapObjects.length - 1) {
                mapString += '\n';
            }
        }
        return mapString;
    }

    deserialize(mapString) {
        const splitString = mapString.split('\n===\n');
        const tileArrayString = splitString[0];
        const mapObjectArrayString = splitString[1];
        const tiles = [];
        const tileRowStrings = tileArrayString.split('\n');
        for (let y = 0; y < tileRowStrings.length; y++) {
            const tileRow = [];
            const tileStrings = tileRowStrings[y].split(' ');
            for (let x = 0; x < tileStrings.length; x++) {
                const props = tileStrings[x].split('-');
                const tileClass = this.stringToClass[props[0]];
                const tile = new tileClass(x, y, props[1]);

                if (x > 0) {
                    tile.link('left', tileRow[x - 1]);
                    tileRow[x - 1].link('right', tile);
                }
                if (y > 0) {
                    tile.link('top', tiles[y - 1][x]);
                    tiles[y - 1][x].link('down', tile);
                }
                tileRow.push(tile);
            }
            tiles.push(tileRow);
        }
        const mapObjects = [];
        const mapObjectStrings = mapObjectArrayString.split('\n');
        for (let i = 0; i < mapObjectStrings.length; i++) {
            const props = mapObjectStrings[i].split('-');
            const classString = props[0];
            const attrString = props.slice(1, props.length).join('-');
            const mapObjectClass = this.stringToClass[props[0]];
            const mapObject = mapObjectClass.deserialize(attrString);
            mapObjects.push(mapObject);
        }
        for (let i = 0; i < mapObjects.length; i++) {
            mapObjects[i].setReferences(tiles, mapObjects);
        }
        return new Map(tiles, mapObjects);
    }
}

export { MapSerializer }
