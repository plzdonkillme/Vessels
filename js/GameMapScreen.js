import { Point } from './render/Vector';
import Viewport from './render/Viewport';
import GameMapEntityFactory from './GameMapEntityFactory';
import GameMapRenderer from './GameMapRenderer';

const R_RATE = 3;
const T_RATE = 5;

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

    this.staticEntities3D = GameMapEntityFactory.createStaticEntities3D(map);
    this.dynamicEntities3D = GameMapEntityFactory.createDynamicEntities3D(map);

    this.gameMapRenderer = new GameMapRenderer(canvas, this.staticEntities3D);

    // Render state
    this.hoveredEntity = null;
  }

  start() {
    this.renderLoop();
  }

  renderLoop() {
    // Read inputs

    // Update dynamic stuff accordingly
    this.viewport.updatePosition();

    // Handle hovered entity
    const hoveredEntity = this.gameMapRenderer.getHoveredEntity();
    this.handleHoveredEntity(hoveredEntity);

    // render entities
    this.gameMapRenderer.render(this.viewport, this.dynamicEntities3D);

    window.requestAnimationFrame(() => {
      this.renderLoop();
    });
  }

  handleClick(x, y) {
  }

  handleMouseDown(x, y) {
  }

  handleMouseMove(x, y) {
    this.gameMapRenderer.setMouse(x, y);
  }

  handleMouseUp(x, y) {
  }

  handleMouseLeave() {
    this.gameMapRenderer.setMouse(null, null);
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

  handleHoveredEntity(entity) {
    if (this.hoveredEntity !== null) {
      this.hoveredEntity.hovered = false;
    }
    this.hoveredEntity = entity;
    if (this.hoveredEntity !== null) {
      this.hoveredEntity.hovered = true;
    }
  }
}

export default GameMapScreen;
