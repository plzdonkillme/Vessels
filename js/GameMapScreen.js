import { Point } from './render/Vector';
import getCube from './render/FaceGroup';
import Viewport from './render/Viewport';
import GameMapRenderer from './GameMapRenderer';

const R_RATE = 3;
const T_RATE = 5;
const TLEN = 100;

class TileEntity3D {
  constructor(faces) {
    this.faces = faces;
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
}

class GameMapScreen {
  constructor(canvas, map) {
    this.pressed = {};

    this.viewport = new Viewport(
      new Point(0, 0, 0),
      new Point(canvas.width, 0, 0),
      new Point(0, canvas.height, 0),
      new Point(canvas.width, canvas.height, 0),
      Math.max(canvas.width, canvas.height) / 2,
    );

    const staticEntities3D = this.createStaticEntities3D(map);
    this.gameMapRenderer = new GameMapRenderer(canvas, staticEntities3D);
  }

  createStaticEntities3D(map) {
    const staticEntities3D = [];
    const { tiles } = map.toJSON();
    for (let i = 0; i < tiles.length; i += 1) {
      for (let j = 0; j < tiles[i].length; j += 1) {
        if (tiles[i][j].type === 'p') {
          const faces = getCube(
            tiles[i][j].x * TLEN,
            tiles[i][j].y * TLEN,
            0,
            TLEN,
            TLEN,
            tiles[i][j].h * TLEN,
          );
          staticEntities3D.push(new TileEntity3D(faces));
        }
      }
    }
    return staticEntities3D;
  }

  start() {
    this.renderLoop();
  }

  renderLoop() {
    // Read inputs

    // Update dynamic stuff accordingly

    // Draw stuff
    this.viewport.updatePosition();

    // render entities
    this.gameMapRenderer.render(this.viewport);

    window.requestAnimationFrame(() => {
      this.renderLoop();
    });
  }

  handleClick(x, y) {
  }

  handleMouseDown(x, y) {
  }

  handleMouseMove(x, y) {
  }

  handleMouseUp(x, y) {
  }

  handleMouseLeave() {
  }

  handleKeyDown(code) {
    if (!this.pressed[code]) {
      this.pressed[code] = true;
      const updateRates = {};
      switch (code) { // eslint-disable-line default-case
        case 'KeyA':
          updateRates.t1 = -T_RATE;
          break;
        case 'KeyW':
          updateRates.t3 = T_RATE;
          break;
        case 'KeyD':
          updateRates.t1 = T_RATE;
          break;
        case 'KeyS':
          updateRates.t3 = -T_RATE;
          break;
        case 'Space':
          updateRates.t2 = -T_RATE;
          break;
        case 'ShiftLeft':
          updateRates.t2 = T_RATE;
          break;
        case 'ArrowUp':
          updateRates.r1 = -R_RATE;
          break;
        case 'ArrowDown':
          updateRates.r1 = R_RATE;
          break;
        case 'ArrowLeft':
          updateRates.r2 = R_RATE;
          break;
        case 'ArrowRight':
          updateRates.r2 = -R_RATE;
          break;
      }
      this.viewport.updateRates(updateRates);
    }
  }

  handleKeyUp(code) {
    if (this.pressed[code]) {
      this.pressed[code] = false;
      const updateRates = {};
      switch (code) { // eslint-disable-line default-case
        case 'KeyA':
          updateRates.t1 = T_RATE;
          break;
        case 'KeyW':
          updateRates.t3 = -T_RATE;
          break;
        case 'KeyD':
          updateRates.t1 = -T_RATE;
          break;
        case 'KeyS':
          updateRates.t3 = T_RATE;
          break;
        case 'Space':
          updateRates.t2 = T_RATE;
          break;
        case 'ShiftLeft':
          updateRates.t2 = -T_RATE;
          break;
        case 'ArrowUp':
          updateRates.r1 = R_RATE;
          break;
        case 'ArrowDown':
          updateRates.r1 = -R_RATE;
          break;
        case 'ArrowLeft':
          updateRates.r2 = -R_RATE;
          break;
        case 'ArrowRight':
          updateRates.r2 = R_RATE;
          break;
      }
      this.viewport.updateRates(updateRates);
    }
  }
}

export default GameMapScreen;
