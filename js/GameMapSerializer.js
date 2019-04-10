import { TileFactory } from './Tile';
import { MapObjectFactory } from './MapObject';

export function serialize(json) {
  const { tiles, state } = json;
  let maxLen = 0;
  for (let i = 0; i < tiles.length; i += 1) {
    for (let j = 0; j < tiles[i].length; j += 1) {
      if (tiles[i][j].mapObject !== undefined) {
        maxLen = Math.max(maxLen, MapObjectFactory.getPropString(tiles[i][j].mapObject).length);
      }
    }
  }
  let tileString = '';
  for (let i = 0; i < tiles.length; i += 1) {
    for (let j = 0; j < tiles[i].length; j += 1) {
      const tstring = TileFactory.getPropString(tiles[i][j]);
      let mstring = ' '.repeat(maxLen);
      if (tiles[i][j].mapObject !== undefined) {
        mstring = MapObjectFactory.getPropString(tiles[i][j].mapObject);
        mstring = `${mstring}${' '.repeat(maxLen - mstring.length)}`;
      }
      tileString = `${tileString}${tstring}{${mstring}}`;
      if (j !== tiles[i].length - 1) {
        tileString = `${tileString} `;
      }
    }
    tileString = `${tileString}\n`;
  }
  const stateString = JSON.stringify(state, null, 2);
  return `\n${tileString}===\n${stateString}\n`;
}

export function deserialize(mapString) {
  const splitString = mapString.trim().split('===');

  const tileReg = /(\w+?){\s*(\w*?)\s*}/g;
  const tileStrings = splitString[0].trim().split('\n');
  const tiles = [];
  for (let y = 0; y < tileStrings.length; y += 1) {
    const tileRow = [];
    let match = tileReg.exec(tileStrings[y]);
    while (match !== null) {
      const json = TileFactory.getJSON(match[1]);
      json.x = tileRow.length;
      json.y = y;
      if (match[2] !== '') {
        const mapJson = MapObjectFactory.getJSON(match[2]);
        mapJson.x = tileRow.length;
        mapJson.y = y;
        json.mapObject = mapJson;
      }
      tileRow.push(json);
      match = tileReg.exec(tileStrings[y]);
    }
    tiles.push(tileRow);
  }

  const state = JSON.parse(splitString[1]);
  return {
    tiles,
    state,
  };
}
