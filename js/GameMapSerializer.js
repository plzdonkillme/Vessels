import { TileFactory } from './Tile';
import { MapObjectFactory } from './MapObject';

export function serialize(json) {
  const tilePropWidth = TileFactory.getPropStringWidth();
  const objPropWidth = MapObjectFactory.getPropStringWidth();
  // The +3 is for the '{', '}', and trailing space
  const width = tilePropWidth + objPropWidth + 3;
  const emptyObj = ' '.repeat(objPropWidth);
  const emptyTile = ' '.repeat(width);

  const { tiles, state } = json;
  const tiles2D = [];
  let maxX = 0;
  let maxY = 0;
  for (let i = 0; i < tiles.length; i += 1) {
    const { x, y } = tiles[i];
    if (tiles2D[y] === undefined) {
      tiles2D[y] = [];
    }
    const tstring = TileFactory.getPropString(tiles[i]);
    const mstring = tiles[i].mapObject !== undefined
      ? MapObjectFactory.getPropString(tiles[i].mapObject)
      : emptyObj;
    tiles2D[y][x] = `${tstring}{${mstring}} `;
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  for (let x = 0; x <= maxX; x += 1) {
    for (let y = 0; y <= maxY; y += 1) {
      tiles2D[y][x] = tiles2D[y][x] !== undefined ? tiles2D[y][x] : emptyTile;
    }
  }

  const tileString = tiles2D.map(row => row.join('')).join('\n');
  const stateString = JSON.stringify(state, null, 2);
  return `\n${tileString}\n===\n${stateString}\n`;
}

export function deserialize(mapString) {
  const tilePropWidth = TileFactory.getPropStringWidth();
  const objPropWidth = MapObjectFactory.getPropStringWidth();
  // The +3 is for the '{', '}', and trailing space
  const width = tilePropWidth + objPropWidth + 3;
  const regex = new RegExp(`.{${width}}`, 'g');

  const splitString = mapString.trim().split('\n===\n');

  // Deserialize tiles
  const tileStrings = splitString[0]
    .split('\n')
    .map(rowString => rowString.match(regex));
  const tiles = [];
  for (let y = 0; y < tileStrings.length; y += 1) {
    for (let x = 0; x < tileStrings[y].length; x += 1) {
      const tileString = tileStrings[y][x];
      const tileProp = tileString.slice(0, tilePropWidth);
      if (tileProp.trim().length !== 0) {
        const json = TileFactory.getJSON(tileProp);
        json.x = x;
        json.y = y;
        const objProp = tileString.slice(tilePropWidth + 1, tilePropWidth + 1 + objPropWidth);
        if (objProp.trim().length !== 0) {
          const mapJson = MapObjectFactory.getJSON(objProp);
          json.mapObject = mapJson;
        }
        tiles.push(json);
      }
    }
  }

  // Deserialize state
  const state = JSON.parse(splitString[1]);
  return {
    tiles,
    state,
  };
}
