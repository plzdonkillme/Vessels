import GameMapRenderer from './GameMapRenderer';

const R_RATE = 3;
const T_RATE = 5;

class GameMapScreen {
  constructor(canvas, map) {
    this.gameMapRenderer = new GameMapRenderer(canvas, map);
    this.pressed = {};
  }

  start() {
    this.renderLoop();
  }

  renderLoop() {
    this.gameMapRenderer.viewport.updatePosition();
    this.gameMapRenderer.render();

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
      this.gameMapRenderer.viewport.updateRates(updateRates);
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
      this.gameMapRenderer.viewport.updateRates(updateRates);
    }
  }
}

export default GameMapScreen;
