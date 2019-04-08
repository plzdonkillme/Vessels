import { Point } from './render/Vector';
import { getCube, getIcosahedron, getTetrahedron } from './render/FaceGroup';
import { PlainTile } from './Tile';
import { Shard, Vessel } from './MapObject';

const TLEN = 100;
const MLEN = 20;
const MENU_WIDTH = 200;
const MENU_HEIGHT = 50;
const MENU_TOP_MARGIN = 50;
const MENU_LEFT_MARGIN = 50;
const MENU_ITEM_MARGIN = 10;

class Entity3D {
  constructor(faces) {
    this.faces = faces;
    this.hovered = false;
  }

  getFaces() {
    return this.faces;
  }

  getFillStyle(face) {
    return this.hovered ? '#FFFFFF' : '#CCCCCC';
  }

  getStrokeStyle(face) {
    return '#000000';
  }

  isHoverable() {
    return true;
  }
}

class Entity2D {
  constructor(points, textInfos) {
    this.points = points;
    this.textInfos = textInfos;
  }

  getPoints() {
    return this.points;
  }

  getTextInfos() {
    return this.textInfos;
  }

  isHoverable() {
    return true;
  }
}

class GameMapEntityFactory {
  static createStaticEntities3D(map) {
    const entities3D = [];
    const tiles = map.getTiles();
    for (let i = 0; i < tiles.length; i += 1) {
      const tile = tiles[i];
      if (tile instanceof PlainTile) {
        const faces = getCube(
          tile.getX() * TLEN,
          tile.getY() * TLEN,
          0,
          TLEN,
          TLEN,
          tile.getH() * TLEN,
        );
        entities3D.push(new Entity3D(faces));
      }
    }
    return entities3D;
  }

  static createDynamicEntities3D(map) {
    const entities3D = [];
    const mapObjects = map.getMapObjects();
    for (let i = 0; i < mapObjects.length; i += 1) {
      const mapObject = mapObjects[i];
      if (mapObject instanceof Shard) {
        const faces = getTetrahedron(
          (mapObject.getX() + 0.5) * TLEN,
          (mapObject.getY() + 0.5) * TLEN,
          (mapObject.getH() + 0.5) * TLEN,
          MLEN,
        );
        entities3D.push(new Entity3D(faces));
      } else if (mapObject instanceof Vessel) {
        const faces = getIcosahedron(
          (mapObject.getX() + 0.5) * TLEN,
          (mapObject.getY() + 0.5) * TLEN,
          (mapObject.getH() + 0.5) * TLEN,
          MLEN,
        );
        entities3D.push(new Entity3D(faces));
      }
    }

    return entities3D;
  }

  static createEntities2D() {
    const entities2D = [];
    const actions = ['move', 'transfer', 'attack', 'end'];
    for (let i = 0; i < 4; i += 1) {
      const x = MENU_LEFT_MARGIN;
      const w = MENU_WIDTH;
      const y = MENU_TOP_MARGIN + (i * (MENU_HEIGHT + MENU_ITEM_MARGIN));
      const h = MENU_HEIGHT;
      const points = Point.createFromBuffer([
        x, y, 0,
        x + w, y, 0,
        x + w, y + h, 0,
        x, y + h, 0,
      ]);
      const textInfos = [{
        text: actions[i],
        x: x + 5,
        y: y + 5,
        font: '36px serif',
        fillStyle: '#000000',
        textBaseline: 'top',
      }];
      entities2D.push(new Entity2D(points, textInfos));
    }

    return entities2D;
  }
}

export default GameMapEntityFactory;
