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
    this.strokeStyle = '#000000';
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
    return this.strokeStyle;
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

  getStrokeStyle(face) {
    return `rgba(0, 0, 0, ${this.a})`;
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

  getStrokeStyle(face) {
    return `rgba(0, 0, 0, ${this.a})`;
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
    let staticEntity = null;
    let dynamicEntity = null;
    if (json.type === 'p') {
      const faces = getCube(
        json.x * TLEN,
        json.y * TLEN,
        0,
        TLEN,
        TLEN,
        json.h * TLEN,
      );
      staticEntity = new PlainTileEntity3D(faces);
    } else {
      throw Error('Unknown tile type');
    }
    if (json.mapObject !== undefined) {
      let faces = [];
      const center = new Point(
        (json.x + 0.5) * TLEN,
        (json.y + 0.5) * TLEN,
        (json.h + 0.5) * TLEN,
      );
      if (['w', 'b', 'r', 'y'].includes(json.mapObject.type)) {
        faces = getIcosahedron(
          (json.x + 0.5) * TLEN,
          (json.y + 0.5) * TLEN,
          (json.h + 0.5) * TLEN,
          MLEN,
        );
        const r = ['w', 'r', 'y'].includes(json.mapObject.type) ? 255 : 0;
        const g = ['w', 'y'].includes(json.mapObject.type) ? 255 : 0;
        const b = ['w', 'b'].includes(json.mapObject.type) ? 255 : 0;
        dynamicEntity = new VesselEntity3D(faces, center, r, g, b, 1);
      } else if (['bs', 'ys', 'rs', 'ys'].includes(json.mapObject.type)) {
        faces = getTetrahedron(
          (json.x + 0.5) * TLEN,
          (json.y + 0.5) * TLEN,
          (json.h + 0.5) * TLEN,
          MLEN,
        );
        const r = ['rs', 'ys'].includes(json.mapObject.type) ? 255 : 0;
        const g = ['ys'].includes(json.mapObject.type) ? 255 : 0;
        const b = ['bs'].includes(json.mapObject.type) ? 255 : 0;
        dynamicEntity = new ShardEntity3D(faces, center, r, g, b, 1);
      } else {
        throw Error('Unkown mapObject type');
      }
    }
    return { staticEntity, dynamicEntity };
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

  static createAnimations(srcObj, dstObj, action) {
    const animations = [];
    if (action.name === 'move') {
      for (let i = 0; i < action.path.length - 1; i += 1) {
        const currState = { ...action.path[i], mapObject: action.src.mapObject };
        const nextState = { ...action.path[i + 1], mapObject: action.src.mapObject };
        const stepAnimation = [];
        const srcAnimation = GameMapEntityFactory.createAnimation(
          srcObj,
          currState,
          nextState,
        );
        stepAnimation.push(srcAnimation);
        if (action.dst.mapObject !== undefined) {
          const dstAnimation = GameMapEntityFactory.createNoopAnimation(dstObj);
          stepAnimation.push(dstAnimation);
        }
        animations.push(stepAnimation);
      }
      if (action.dst.mapObject !== undefined) {
        const srcAnimation = GameMapEntityFactory.createAnimation(
          srcObj,
          action.src,
          action.dst,
        );
        const dstAnimation = GameMapEntityFactory.createAnimation(
          dstObj,
          action.dst,
          action.src,
        );
        animations.push([srcAnimation, dstAnimation]);
      }
    } else if (action.name === 'transfer') {
      const srcAnimation = GameMapEntityFactory.createAnimation(
        srcObj,
        action.src,
        action.dst,
      );
      const dstAnimation = GameMapEntityFactory.createAnimation(
        dstObj,
        action.dst,
        action.src,
      );
      animations.push([srcAnimation, dstAnimation]);
    } else if (action.name === 'attack') {
      const animation = [];
      action.dst.forEach((dst) => {
        const dstKey = `${dst.x}_${dst.y}`;
        const obj = dstObj[dstKey];
        if (obj !== undefined) {
          animation.push(GameMapEntityFactory.createAnimation(
            obj,
            dst,
            { mapObject: { type: null } },
          ));
        }
      });
      animations.push(animation);
    }
    return animations;
  }

  static createAnimation(entity, startJSON, endJSON) {
    const transitions = {};
    const stype = startJSON.mapObject.type;
    const etype = endJSON.mapObject.type;
    if (stype === etype) {
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
    } else if (['bs', 'rs', 'ys'].includes(stype) && etype === 'w') {
      const az = (startJSON.h + 0.5) * TLEN;
      const bz = (startJSON.h + 1.5) * TLEN;
      transitions.z = new TransitionLinear(az, bz);
      transitions.a = new TransitionLinear(1, 0);
    } else if (['w', 'b', 'r', 'y'].includes(stype) && etype !== null) {
      const ar = ['w', 'r', 'y'].includes(stype) ? 255 : 0;
      const ag = ['w', 'y'].includes(stype) ? 255 : 0;
      const ab = ['w', 'b'].includes(stype) ? 255 : 0;
      const br = ['w', 'r', 'y', 'rs', 'ys'].includes(etype) ? 255 : 0;
      const bg = ['w', 'y', 'ys'].includes(etype) ? 255 : 0;
      const bb = ['w', 'b', 'bs'].includes(etype) ? 255 : 0;
      transitions.r = new TransitionLinear(ar, br);
      transitions.g = new TransitionLinear(ag, bg);
      transitions.b = new TransitionLinear(ab, bb);
    } else if (etype === null) {
      transitions.a = new TransitionLinear(1, 0);
    }
    return new Animation(entity, transitions, ANIMATION_LEN);
  }

  static createNoopAnimation(entity) {
    return new Animation(entity, {}, ANIMATION_LEN);
  }
}

export default GameMapEntityFactory;
