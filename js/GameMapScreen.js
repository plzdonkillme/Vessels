import { Point, Vector } from './render/Vector';
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
    this.viewport.translateAlongBasis(0, 0, -1000);

    this.staticEntities3D = GameMapEntityFactory.createStaticEntities3D(map);
    this.dynamicEntities3D = GameMapEntityFactory.createDynamicEntities3D(map);
    this.entities2D = GameMapEntityFactory.createEntities2D();

    this.gameMapRenderer = new GameMapRenderer(canvas, this.staticEntities3D);

    // Render state
    this.viewState = {
      showMove: false,
      showTransfer: false,
      showAttack: false,
      showEnd: false,
      showDebug: true,
      hoveredEntity: null,
    };

    this.validActions = map.getActions();
    this.validActions.forEach((action) => {
      if (action.name === 'move') {
        this.viewState.showMove = true;
      } else if (action.name === 'transfer') {
        this.viewState.showTransfer = true;
      } else if (action.name === 'attack') {
        this.viewState.showAttack = true;
      } else if (action.name === 'end') {
        this.viewState.showEnd = true;
      }
    });
  }

  start() {
    this.renderLoop();
  }

  renderLoop() {
    // Read inputs

    // Update dynamic stuff accordingly
    this.viewport.updatePosition();
    this.dynamicEntities3D.forEach((entity) => {
      entity.rotate(new Vector(0, 0, 1), 0.05);
    });


    // Handle hovered entity
    const hoveredEntity = this.gameMapRenderer.getHoveredEntity();
    this.handleHoveredEntity(hoveredEntity);

    const entities2D = [];
    if (this.viewState.showMove) {
      entities2D.push(this.entities2D.move);
    }
    if (this.viewState.showTransfer) {
      entities2D.push(this.entities2D.transfer);
    }
    if (this.viewState.showAttack) {
      entities2D.push(this.entities2D.attack);
    }
    if (this.viewState.showEnd) {
      entities2D.push(this.entities2D.end);
    }
    if (this.viewState.showDebug) {
      entities2D.push(this.entities2D.debug);
    }

    // render entities
    this.gameMapRenderer.render(this.viewport, this.dynamicEntities3D, entities2D);

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
    // Don't update if new hovered entity same as old
    if (entity === this.viewState.hoveredEntity) {
      return;
    }
    // Unset Hover Logic
    if (this.viewState.hoveredEntity !== null) {
      if (this.viewState.hoveredEntity === this.entities2D.move) {
        this.entities2D.move.fillStyle = '#FFFFFF';
      }
      this.entities2D.debug.textInfos[0].text = 'null';
    }
    this.viewState.hoveredEntity = entity;
    // Set Hover Logic
    if (this.viewState.hoveredEntity !== null) {
      if (this.viewState.hoveredEntity === this.entities2D.move) {
        this.entities2D.move.fillStyle = '#CCCCCC';
      }
      this.entities2D.debug.textInfos[0].text = this.viewState.hoveredEntity.constructor.name;
    }
  }
}

export default GameMapScreen;
