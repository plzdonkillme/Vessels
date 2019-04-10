/* eslint-disable class-methods-use-this, no-unused-vars */

import { Point } from './render/Vector';
import { getCube, getIcosahedron, getTetrahedron } from './render/FaceGroup';
import { PlainTile } from './Tile';
import {
  BlueShard,
  RedShard,
  YellowShard,
  WhiteVessel,
  BlueVessel,
  RedVessel,
  YellowVessel,
} from './MapObject';

const TLEN = 100;
const MLEN = 20;
const MENU_WIDTH = 200;
const MENU_HEIGHT = 50;
const MENU_TOP_MARGIN = 50;
const MENU_LEFT_MARGIN = 50;
const MENU_ITEM_MARGIN = 10;

class Entity3D {
  constructor(faces, center = null) {
    this.faces = faces;
    this.center = center;
  }

  getFaces() {
    return this.faces;
  }

  getFillStyle(face) {
    return '#CCCCCC';
  }

  getStrokeStyle(face) {
    return '#000000';
  }

  isHoverable() {
    return true;
  }

  translate(x, y, z) {
    this.faces.forEach(face => face.translate(x, y, z));
    this.center.translate(x, y, z);
  }

  rotate(v, rad) {
    if (this.center === null) {
      throw Error('Cannot rotate Entity3D without center defined');
    }
    const cx = this.center.getX();
    const cy = this.center.getY();
    const cz = this.center.getZ();
    this.faces.forEach(face => face.translate(-cx, -cy, -cz));
    this.faces.forEach(face => face.rotate(v, rad));
    this.faces.forEach(face => face.translate(cx, cy, cz));
  }
}

class BlueShardEntity3D extends Entity3D {
  getFillStyle(face) {
    return '#0000FF';
  }
}

class RedShardEntity3D extends Entity3D {
  getFillStyle(face) {
    return '#FF0000';
  }
}

class YellowShardEntity3D extends Entity3D {
  getFillStyle(face) {
    return '#FFFF00';
  }
}

class WhiteVesselEntity3D extends Entity3D {
  getFillStyle(face) {
    return '#FFFFFF';
  }
}

class BlueVesselEntity3D extends Entity3D {
  getFillStyle(face) {
    return '#0000FF';
  }
}

class RedVesselEntity3D extends Entity3D {
  getFillStyle(face) {
    return '#FF0000';
  }
}

class YellowVesselEntity3D extends Entity3D {
  getFillStyle(face) {
    return '#FFFF00';
  }
}

class Entity2D {
  constructor(points, textInfos) {
    this.points = points;
    this.textInfos = textInfos;
    this.fillStyle = '#FFFFFF';
  }

  getFillStyle() {
    return this.fillStyle;
  }

  getStrokeStyle() {
    return '#000000';
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
      if (mapObject instanceof BlueShard) {
        const faces = getTetrahedron(
          (mapObject.getX() + 0.5) * TLEN,
          (mapObject.getY() + 0.5) * TLEN,
          (mapObject.getH() + 0.5) * TLEN,
          MLEN,
        );
        const center = new Point(
          (mapObject.getX() + 0.5) * TLEN,
          (mapObject.getY() + 0.5) * TLEN,
          (mapObject.getH() + 0.5) * TLEN,
        );
        entities3D.push(new BlueShardEntity3D(faces, center));
      } else if (mapObject instanceof RedShard) {
        const faces = getTetrahedron(
          (mapObject.getX() + 0.5) * TLEN,
          (mapObject.getY() + 0.5) * TLEN,
          (mapObject.getH() + 0.5) * TLEN,
          MLEN,
        );
        const center = new Point(
          (mapObject.getX() + 0.5) * TLEN,
          (mapObject.getY() + 0.5) * TLEN,
          (mapObject.getH() + 0.5) * TLEN,
        );
        entities3D.push(new RedShardEntity3D(faces, center));
      } else if (mapObject instanceof YellowShard) {
        const faces = getTetrahedron(
          (mapObject.getX() + 0.5) * TLEN,
          (mapObject.getY() + 0.5) * TLEN,
          (mapObject.getH() + 0.5) * TLEN,
          MLEN,
        );
        const center = new Point(
          (mapObject.getX() + 0.5) * TLEN,
          (mapObject.getY() + 0.5) * TLEN,
          (mapObject.getH() + 0.5) * TLEN,
        );
        entities3D.push(new YellowShardEntity3D(faces, center));
      } else if (mapObject instanceof WhiteVessel) {
        const faces = getIcosahedron(
          (mapObject.getX() + 0.5) * TLEN,
          (mapObject.getY() + 0.5) * TLEN,
          (mapObject.getH() + 0.5) * TLEN,
          MLEN,
        );
        const center = new Point(
          (mapObject.getX() + 0.5) * TLEN,
          (mapObject.getY() + 0.5) * TLEN,
          (mapObject.getH() + 0.5) * TLEN,
        );
        entities3D.push(new WhiteVesselEntity3D(faces, center));
      } else if (mapObject instanceof BlueVessel) {
        const faces = getIcosahedron(
          (mapObject.getX() + 0.5) * TLEN,
          (mapObject.getY() + 0.5) * TLEN,
          (mapObject.getH() + 0.5) * TLEN,
          MLEN,
        );
        const center = new Point(
          (mapObject.getX() + 0.5) * TLEN,
          (mapObject.getY() + 0.5) * TLEN,
          (mapObject.getH() + 0.5) * TLEN,
        );
        entities3D.push(new BlueVesselEntity3D(faces, center));
      } else if (mapObject instanceof RedVessel) {
        const faces = getIcosahedron(
          (mapObject.getX() + 0.5) * TLEN,
          (mapObject.getY() + 0.5) * TLEN,
          (mapObject.getH() + 0.5) * TLEN,
          MLEN,
        );
        const center = new Point(
          (mapObject.getX() + 0.5) * TLEN,
          (mapObject.getY() + 0.5) * TLEN,
          (mapObject.getH() + 0.5) * TLEN,
        );
        entities3D.push(new RedVesselEntity3D(faces, center));
      } else if (mapObject instanceof YellowVessel) {
        const faces = getIcosahedron(
          (mapObject.getX() + 0.5) * TLEN,
          (mapObject.getY() + 0.5) * TLEN,
          (mapObject.getH() + 0.5) * TLEN,
          MLEN,
        );
        const center = new Point(
          (mapObject.getX() + 0.5) * TLEN,
          (mapObject.getY() + 0.5) * TLEN,
          (mapObject.getH() + 0.5) * TLEN,
        );
        entities3D.push(new YellowVesselEntity3D(faces, center));
      }
    }

    return entities3D;
  }

  static createEntities2D() {
    const entities2D = {};
    const actions = ['move', 'transfer', 'attack', 'end'];
    for (let i = 0; i < actions.length; i += 1) {
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
      entities2D[actions[i]] = new Entity2D(points, textInfos);
    }

    entities2D.debug = new Entity2D([], [{
      text: 'debug',
      x: 5,
      y: 5,
      font: '12px serif',
      fillStyle: '#000000',
      textBaseline: 'top',
    }]);

    return entities2D;
  }
}

export default GameMapEntityFactory;
