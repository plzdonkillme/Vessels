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
    this.fillStyle = '#CCCCCC';
  }

  getFaces() {
    return this.faces;
  }

  getFillStyle(face) {
    return this.fillStyle;
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
  static createEntity3D(json) {
    if (json.type === 'p') {
      const faces = getCube(
        json.x * TLEN,
        json.y * TLEN,
        0,
        TLEN,
        TLEN,
        json.h * TLEN,
      );
      return new Entity3D(faces);
    }
    if (json.type === 'w') {
      const faces = getIcosahedron(
        (json.x + 0.5) * TLEN,
        (json.y + 0.5) * TLEN,
        (json.h + 0.5) * TLEN,
        MLEN,
      );
      const center = new Point(
        (json.x + 0.5) * TLEN,
        (json.y + 0.5) * TLEN,
        (json.h + 0.5) * TLEN,
      );
      return new WhiteVesselEntity3D(faces, center);
    }
    if (json.type === 'b') {
      const faces = getIcosahedron(
        (json.x + 0.5) * TLEN,
        (json.y + 0.5) * TLEN,
        (json.h + 0.5) * TLEN,
        MLEN,
      );
      const center = new Point(
        (json.x + 0.5) * TLEN,
        (json.y + 0.5) * TLEN,
        (json.h + 0.5) * TLEN,
      );
      return new BlueVesselEntity3D(faces, center);
    }
    if (json.type === 'r') {
      const faces = getIcosahedron(
        (json.x + 0.5) * TLEN,
        (json.y + 0.5) * TLEN,
        (json.h + 0.5) * TLEN,
        MLEN,
      );
      const center = new Point(
        (json.x + 0.5) * TLEN,
        (json.y + 0.5) * TLEN,
        (json.h + 0.5) * TLEN,
      );
      return new RedVesselEntity3D(faces, center);
    }
    if (json.type === 'y') {
      const faces = getIcosahedron(
        (json.x + 0.5) * TLEN,
        (json.y + 0.5) * TLEN,
        (json.h + 0.5) * TLEN,
        MLEN,
      );
      const center = new Point(
        (json.x + 0.5) * TLEN,
        (json.y + 0.5) * TLEN,
        (json.h + 0.5) * TLEN,
      );
      return new YellowVesselEntity3D(faces, center);
    }
    if (json.type === 'bs') {
      const faces = getTetrahedron(
        (json.x + 0.5) * TLEN,
        (json.y + 0.5) * TLEN,
        (json.h + 0.5) * TLEN,
        MLEN,
      );
      const center = new Point(
        (json.x + 0.5) * TLEN,
        (json.y + 0.5) * TLEN,
        (json.h + 0.5) * TLEN,
      );
      return new BlueShardEntity3D(faces, center);
    }
    if (json.type === 'rs') {
      const faces = getTetrahedron(
        (json.x + 0.5) * TLEN,
        (json.y + 0.5) * TLEN,
        (json.h + 0.5) * TLEN,
        MLEN,
      );
      const center = new Point(
        (json.x + 0.5) * TLEN,
        (json.y + 0.5) * TLEN,
        (json.h + 0.5) * TLEN,
      );
      return new RedShardEntity3D(faces, center);
    }
    if (json.type === 'ys') {
      const faces = getTetrahedron(
        (json.x + 0.5) * TLEN,
        (json.y + 0.5) * TLEN,
        (json.h + 0.5) * TLEN,
        MLEN,
      );
      const center = new Point(
        (json.x + 0.5) * TLEN,
        (json.y + 0.5) * TLEN,
        (json.h + 0.5) * TLEN,
      );
      return new YellowShardEntity3D(faces, center);
    }
    throw Error('Unrecognized type');
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

    const bx = MENU_LEFT_MARGIN;
    const bw = MENU_WIDTH;
    const by = MENU_TOP_MARGIN;
    const bh = MENU_HEIGHT;
    entities2D.back = new Entity2D(Point.createFromBuffer([
      bx, by, 0,
      bx + bw, by, 0,
      bx + bw, by + bh, 0,
      bx, by + bh, 0,
    ]), [{
      text: 'back',
      x: bx + 5,
      y: by + 5,
      font: '36px serif',
      fillStyle: '#000000',
      textBaseline: 'top',
    }]);

    return entities2D;
  }
}

export default GameMapEntityFactory;
