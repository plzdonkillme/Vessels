/* eslint-disable class-methods-use-this, no-unused-vars */

import { Point } from '../render/Vector';
import { getCube, getIcosahedron, getTetrahedron } from '../render/FaceGroup';
import { Animation, TransitionLinear, TransitionQuadraticBezier } from './Animation';

const TLEN = 100;
const MLEN = 20;
const MENU_WIDTH = 200;
const MENU_HEIGHT = 50;
const MENU_TOP_MARGIN = 50;
const MENU_LEFT_MARGIN = 50;
const MENU_ITEM_MARGIN = 10;
const ANIMATION_LEN = 30;

class Entity3D {
  constructor(faces, center = null) {
    this.faces = faces;
    this.center = center;
    this.fillStyle = '#CCCCCC';
  }

  getFaces() {
    return this.faces;
  }

  getCenter() {
    return this.center;
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

class PlainTileEntity3D extends Entity3D {
}

class ShardEntity3D extends Entity3D {
  constructor(face, center, r, g, b, a) {
    super(face, center);
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  getFillStyle(face) {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  getR() {
    return this.r;
  }

  getG() {
    return this.g;
  }

  getB() {
    return this.b;
  }

  getA() {
    return this.a;
  }

  translateColor(r, g, b, a) {
    this.r += r;
    this.g += g;
    this.b += b;
    this.a += a;
  }
}

class VesselEntity3D extends Entity3D {
  constructor(face, center, r, g, b, a) {
    super(face, center);
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  getFillStyle(face) {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  getR() {
    return this.r;
  }

  getG() {
    return this.g;
  }

  getB() {
    return this.b;
  }

  getA() {
    return this.a;
  }

  translateColor(r, g, b, a) {
    this.r += r;
    this.g += g;
    this.b += b;
    this.a += a;
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
      return new PlainTileEntity3D(faces);
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
      return new VesselEntity3D(faces, center, 255, 255, 255, 1);
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
      return new VesselEntity3D(faces, center, 0, 0, 255, 1);
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
      return new VesselEntity3D(faces, center, 255, 0, 0, 1);
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
      return new VesselEntity3D(faces, center, 255, 255, 0, 1);
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
      return new ShardEntity3D(faces, center, 0, 0, 255, 1);
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
      return new ShardEntity3D(faces, center, 255, 0, 0, 1);
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
      return new ShardEntity3D(faces, center, 255, 255, 0, 1);
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

  static createAnimation(entity, startJSON, endJSON) {
    const transitions = {};
    if (startJSON.type === endJSON.type) {
      const ax = (startJSON.x + 0.5) * TLEN;
      const ay = (startJSON.y + 0.5) * TLEN;
      const az = (startJSON.h + 0.5) * TLEN;
      const bx = (endJSON.x + 0.5) * TLEN;
      const by = (endJSON.y + 0.5) * TLEN;
      const bz = (endJSON.h + 0.5) * TLEN;
      if (az === bz) {
        transitions.x = new TransitionLinear(ax, bx);
        transitions.y = new TransitionLinear(ay, by);
        transitions.z = new TransitionLinear(az, bz);
      } else {
        transitions.x = new TransitionQuadraticBezier(ax, az > bz ? bx : ax, bx);
        transitions.y = new TransitionQuadraticBezier(ay, az > bz ? by : ay, by);
        transitions.z = new TransitionQuadraticBezier(az, Math.max(az, bz), bz);
      }
    } else if (['bs', 'rs', 'ys'].includes(startJSON.type) && endJSON.type === 'w') {
      const az = (startJSON.h + 0.5) * TLEN;
      const bz = (startJSON.h + 1.5) * TLEN;
      transitions.z = new TransitionLinear(az, bz);
      transitions.a = new TransitionLinear(1, 0);
    } else if (['w', 'b', 'r', 'y'].includes(startJSON.type)) {
      const ar = ['w', 'r', 'y'].includes(startJSON.type) ? 255 : 0;
      const ag = ['w', 'y'].includes(startJSON.type) ? 255 : 0;
      const ab = ['w', 'b'].includes(startJSON.type) ? 255 : 0;
      const br = ['w', 'r', 'y', 'rs', 'ys'].includes(endJSON.type) ? 255 : 0;
      const bg = ['w', 'y', 'ys'].includes(endJSON.type) ? 255 : 0;
      const bb = ['w', 'b', 'bs'].includes(endJSON.type) ? 255 : 0;
      transitions.r = new TransitionLinear(ar, br);
      transitions.g = new TransitionLinear(ag, bg);
      transitions.b = new TransitionLinear(ab, bb);
    }
    return new Animation(entity, transitions, ANIMATION_LEN);
  }

  static createNoopAnimation(entity) {
    return new Animation(entity, {}, ANIMATION_LEN);
  }
}

export default GameMapEntityFactory;
