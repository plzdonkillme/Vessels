import { TileFactory } from "./Tile";
import { MapObjectFactory } from "./MapObject";
import { ObjectiveFactory } from './Objective';
import { Map } from "./Map";

function serialize(map) {
    const state = map.toJSON();
    let mapString = '';
    const tiles = state.tiles;
    const mapObjects = [];
    for (let i = 0; i < tiles.length; i++) {
        const tileRow = tiles[i];
        for (let j = 0; j < tileRow.length; j++) {
            const tile = tileRow[j];
            if (tile.mapObject !== undefined) {
                mapObjects.push(tile.mapObject);
            }
            const tileString = TileFactory.getPropString(tile);
            mapString += tileString;
            if (j !== tileRow.length - 1) {
                mapString += ' ';
            }
        }
        mapString += '\n';
    }
    mapString += '===\n';
    for (let i = 0; i < mapObjects.length; i++) {
        const mapObject = mapObjects[i];
        const mapObjectString = MapObjectFactory.getPropString(mapObject);
        mapString += mapObjectString;
        mapString += '\n';
    }
    mapString += '===\n';
    mapString += ObjectiveFactory.getPropString(state.objective);
    mapString += '\n';
    mapString += state.turnPlayers.join('-');
    mapString += '\n';
    mapString += `${state.actions.move}-${state.actions.transfer}-${state.actions.attack}`;
    return mapString;
}

function deserialize(mapString) {
    const state = {};
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
            const json = TileFactory.getJSON(tileStrings[x]);
            json.x = x;
            json.y = y;
            tileRow.push(json);
        }
        tiles.push(tileRow);
    }

    const mapObjectStrings = mapObjectArrayString.split('\n');
    for (let i = 0; i < mapObjectStrings.length; i++) {
        const props = mapObjectStrings[i].split('-');
        const x = parseInt(props[0]);
        const y = parseInt(props[1]);
        const json = MapObjectFactory.getJSON(props.slice(2, props.length).join('-'));
        json.x = x;
        json.y = y;
        tiles[y][x].mapObject = json;
    }

    state.objective = ObjectiveFactory.getJSON(settings[0]);
    state.turnPlayers = settings[1].split('-');
    const s = settings[2].split('-');
    state.actions = {
        move: parseInt(s[0]),
        transfer: parseInt(s[1]),
        attack: parseInt(s[2]),
    };
    state.tiles = tiles;
    return new Map(state);
}

export { serialize, deserialize }
