import { Tile } from "./Tile";
import { MapObject } from "./MapObject";
import { Map } from './Map';
import { Objective } from './Objective';

function serialize(map) {
    let mapString = '';
    const tiles = map.getTiles();
    for (let i = 0; i < tiles.length; i++) {
        const tileRow = tiles[i];
        for (let j = 0; j < tileRow.length; j++) {
            const tile = tileRow[j];
            const tileString = tile.serialize();
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
        const mapObjectString = mapObject.serialize();
        mapString += mapObjectString;
        mapString += '\n';
    }
    mapString += '===\n';
    mapString += map.getObjective().serialize();
    mapString += '\n';
    mapString += map.serializeTurnPlayers();
    mapString += '\n';
    mapString += map.serializeActions();
    return mapString;
}

function deserialize(mapString) {
    const splitString = mapString.split('\n===\n');
    const tileArrayString = splitString[0];
    const mapObjectArrayString = splitString[1];
    const settings = splitString[2].split('\n');

    const tiles = [];
    const tileRowStrings = tileArrayString.split('\n');
    for (let y = 0; y < tileRowStrings.length; y++) {
        const tileRow = [];
        const tileStrings = tileRowStrings[y].split(' ');
        for (let x = 0; x < tileStrings.length; x++) {
            const props = tileStrings[x].split('-');
            const tileClass = Tile.getClass(props[0]);
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

    const mapObjectStrings = mapObjectArrayString.split('\n');
    for (let i = 0; i < mapObjectStrings.length; i++) {
        const mapObject = MapObject.deserialize(mapObjectStrings[i], tiles);
    }

    const objective = Objective.deserialize(settings[0]);
    const turnPlayers = Map.deserializeTurnPlayers(settings[1]);
    const actions = Map.deserializeActions(settings[2]);
    return new Map(tiles, objective, turnPlayers, actions);
}

export { serialize, deserialize }
