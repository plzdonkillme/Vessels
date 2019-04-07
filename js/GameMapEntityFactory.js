import { getCube, getIcosahedron } from './render/FaceGroup';
import { EmptyTile } from './Tile';

const TLEN = 100;
const MLEN = 20;

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

class GameMapEntityFactory {
  static createStaticEntities3D(map) {
    return map.getTiles()
      .filter(tile => tile.constructor.name() !== EmptyTile.name())
      .map((tile) => {
        const faces = getCube(
          tile.getX() * TLEN,
          tile.getY() * TLEN,
          0,
          TLEN,
          TLEN,
          tile.getH() * TLEN,
        );
        return new Entity3D(faces);
      });
  }

  static createDynamicEntities3D(map) {
    return map.getMapObjects()
      .map((mapObject) => {
        const faces = getIcosahedron(
          (mapObject.getX() + 0.5) * TLEN,
          (mapObject.getY() + 0.5) * TLEN,
          (mapObject.getH() + 0.5) * TLEN,
          MLEN,
        );
        return new Entity3D(faces);
      });
  }
}

export default GameMapEntityFactory;
