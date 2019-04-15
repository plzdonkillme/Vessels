import { Point, Vector } from './render/Vector';
import Viewport from './render/Viewport';
import GameMapEntityFactory from './GameMapEntityFactory';
import GameMapRenderer from './GameMapRenderer';

const R_RATE = 3;
const T_RATE = 10;

class GameMapScreen {
  constructor(canvas, map) {
    this.map = map;
    this.viewport = new Viewport(
      new Point(0, 0, 0),
      new Point(canvas.width, 0, 0),
      new Point(0, canvas.height, 0),
      new Point(canvas.width, canvas.height, 0),
      Math.max(canvas.width, canvas.height) / 2,
    );
    this.viewport.translateAlongBasis(0, 0, -1000);

    const { tiles } = map.toJSON();
    this.staticEntities3D = {};
    this.dynamicEntities3D = {};
    for (let i = 0; i < tiles.length; i += 1) {
      const key = `${tiles[i].x}_${tiles[i].y}`;
      this.staticEntities3D[key] = GameMapEntityFactory.createEntity3D(tiles[i]);
      if (tiles[i].mapObject !== undefined) {
        const json = {
          ...tiles[i].mapObject,
          x: tiles[i].x,
          y: tiles[i].y,
          h: tiles[i].h,
        };
        this.dynamicEntities3D[key] = GameMapEntityFactory.createEntity3D(json);
      }
    }
    this.entities2D = GameMapEntityFactory.createEntities2D();

    this.gameMapRenderer = new GameMapRenderer(canvas, Object.values(this.staticEntities3D));

    // Render state
    this.viewState = {
      showDebug: true,
      hoveredEntity: null,
    };

    // Input state
    this.inputState = {
      click: false,
      pressed: {},
      mx: null,
      my: null,
    };

    // Initial phase state
    this.setupPhaseState();
  }

  setupPhaseState() {
    this.viewState.phase = 'chooseAction';
    this.viewState.phaseState = {
      actionMap: new Map(),
      prevActionMap: [],
    };
    this.viewState.phaseState.actionMap.set(this.entities2D.move, []);
    this.viewState.phaseState.actionMap.set(this.entities2D.transfer, []);
    this.viewState.phaseState.actionMap.set(this.entities2D.attack, []);
    const validActions = this.map.getActions();
    validActions.forEach((action) => {
      if (action.name === 'move') {
        this.viewState.phaseState.actionMap.get(this.entities2D.move).push(action);
      } else if (action.name === 'transfer') {
        this.viewState.phaseState.actionMap.get(this.entities2D.transfer).push(action);
      } else if (action.name === 'attack') {
        this.viewState.phaseState.actionMap.get(this.entities2D.attack).push(action);
      }
    });
  }

  start() {
    this.renderLoop();
  }

  renderLoop() {
    // Handle hovered entity
    const hoveredEntity = this.gameMapRenderer.getHoveredEntity();
    this.handleHoveredEntity(hoveredEntity);

    // Consume inputs
    this.consumeInputs();

    // Update dynamic stuff accordingly
    Object.values(this.dynamicEntities3D).forEach((entity) => {
      entity.rotate(new Vector(0, 0, 1), 0.05);
    });

    const dHover = this.viewState.hoveredEntity !== null ? this.viewState.hoveredEntity.constructor.name : 'null';
    const dPhase = this.viewState.phase;
    this.entities2D.debug.textInfos[0].text = `hover: ${dHover} | phase: ${dPhase}`;

    const entities2D = this.entities2DToRender();

    // render entities
    this.gameMapRenderer.render(this.viewport, Object.values(this.dynamicEntities3D), entities2D);

    window.requestAnimationFrame(() => {
      this.renderLoop();
    });
  }

  entities2DToRender() {
    const entities2D = [];
    if (this.viewState.phase === 'chooseAction') {
      entities2D.push(this.entities2D.move);
      entities2D.push(this.entities2D.transfer);
      entities2D.push(this.entities2D.attack);
      entities2D.push(this.entities2D.end);
    } else if (this.viewState.phase === 'chooseSrc') {
      entities2D.push(this.entities2D.back);
    } else if (this.viewState.phase === 'chooseDst') {
      entities2D.push(this.entities2D.back);
    }

    if (this.viewState.showDebug) {
      entities2D.push(this.entities2D.debug);
    }
    return entities2D;
  }

  handleClick(x, y) {
    this.inputState.click = true;
  }

  handleMouseDown(x, y) {
  }

  handleMouseMove(x, y) {
    this.inputState.mx = x;
    this.inputState.my = y;
  }

  handleMouseUp(x, y) {
  }

  handleMouseLeave() {
    this.inputState.mx = null;
    this.inputState.my = null;
  }

  handleKeyDown(code) {
    this.inputState.pressed[code] = true;
  }

  handleKeyUp(code) {
    this.inputState.pressed[code] = false;
  }

  handleHoveredEntity(entity) {
    // Don't update if new hovered entity same as old
    if (entity === this.viewState.hoveredEntity) {
      return;
    }
    // Unset Hover Logic
    if (this.viewState.hoveredEntity !== null) {
      if (this.viewState.phase === 'chooseAction') {
        if (this.viewState.hoveredEntity === this.entities2D.end) {
          this.viewState.hoveredEntity.fillStyle = '#FFFFFF';
        } else {
          const actions = this.viewState.phaseState.actionMap.get(this.viewState.hoveredEntity);
          if (actions !== undefined) {
            this.viewState.hoveredEntity.fillStyle = '#FFFFFF';
            actions.forEach((action) => {
              const key = `${action.src.x}_${action.src.y}`;
              this.staticEntities3D[key].fillStyle = '#CCCCCC';
            });
          }
        }
      } else if (this.viewState.phase === 'chooseSrc') {
        if (this.viewState.hoveredEntity === this.entities2D.back) {
          this.viewState.hoveredEntity.fillStyle = '#FFFFFF';
        } else {
          const actions = this.viewState.phaseState.actionMap.get(this.viewState.hoveredEntity);
          if (actions !== undefined) {
            actions.forEach((action) => {
              const dsts = Array.isArray(action.dst) ? action.dst : [action.dst];
              dsts.forEach((dst) => {
                const key = `${dst.x}_${dst.y}`;
                this.staticEntities3D[key].fillStyle = '#CCCCCC';
              });
            });
          }
        }
      } else if (this.viewState.phase === 'chooseDst') {
        if (this.viewState.hoveredEntity === this.entities2D.back) {
          this.viewState.hoveredEntity.fillStyle = '#FFFFFF';
        } else {
          const action = this.viewState.phaseState.actionMap.get(this.viewState.hoveredEntity);
          if (action !== undefined) {
            const dsts = Array.isArray(action.dst) ? action.dst : [action.dst];
            dsts.forEach((dst) => {
              const key = `${dst.x}_${dst.y}`;
              this.staticEntities3D[key].fillStyle = '#CCCCCC';
            });
          }
        }
      }
    }
    this.viewState.hoveredEntity = entity;
    // Set Hover Logic
    if (this.viewState.hoveredEntity !== null) {
      if (this.viewState.phase === 'chooseAction') {
        if (this.viewState.hoveredEntity === this.entities2D.end) {
          this.viewState.hoveredEntity.fillStyle = '#CCCCCC';
        } else {
          const actions = this.viewState.phaseState.actionMap.get(this.viewState.hoveredEntity);
          if (actions !== undefined) {
            this.viewState.hoveredEntity.fillStyle = '#CCCCCC';
            actions.forEach((action) => {
              const key = `${action.src.x}_${action.src.y}`;
              this.staticEntities3D[key].fillStyle = '#FFFFFF';
            });
          }
        }
      } else if (this.viewState.phase === 'chooseSrc') {
        if (this.viewState.hoveredEntity === this.entities2D.back) {
          this.viewState.hoveredEntity.fillStyle = '#CCCCCC';
        } else {
          const actions = this.viewState.phaseState.actionMap.get(this.viewState.hoveredEntity);
          if (actions !== undefined) {
            actions.forEach((action) => {
              const dsts = Array.isArray(action.dst) ? action.dst : [action.dst];
              dsts.forEach((dst) => {
                const key = `${dst.x}_${dst.y}`;
                this.staticEntities3D[key].fillStyle = '#FFFFFF';
              });
            });
          }
        }
      } else if (this.viewState.phase === 'chooseDst') {
        if (this.viewState.hoveredEntity === this.entities2D.back) {
          this.viewState.hoveredEntity.fillStyle = '#CCCCCC';
        } else {
          const action = this.viewState.phaseState.actionMap.get(this.viewState.hoveredEntity);
          if (action !== undefined) {
            const dsts = Array.isArray(action.dst) ? action.dst : [action.dst];
            dsts.forEach((dst) => {
              const key = `${dst.x}_${dst.y}`;
              this.staticEntities3D[key].fillStyle = '#FFFFFF';
            });
          }
        }
      }
    }
  }

  handleClickEntity() {
    // Don't do anything if not hovering over anything
    if (this.viewState.hoveredEntity === null) {
      return;
    }
    if (this.viewState.phase === 'chooseAction') {
      if (this.viewState.hoveredEntity === this.entities2D.end) {
        this.viewState.hoveredEntity.fillStyle = '#FFFFFF';
        const endAction = this.map.getActions().filter(action => action.name === 'end')[0];
        this.map.doAction(endAction);
        this.setupPhaseState();
      } else {
        const actions = this.viewState.phaseState.actionMap.get(this.viewState.hoveredEntity);
        if (actions !== undefined) {
          this.viewState.hoveredEntity.fillStyle = '#FFFFFF';
          this.viewState.phase = 'chooseSrc';
          this.viewState.phaseState.prevActionMap.push(this.viewState.phaseState.actionMap);
          this.viewState.phaseState.actionMap = new Map();
          actions.forEach((action) => {
            const key = `${action.src.x}_${action.src.y}`;
            const staticEntity = this.staticEntities3D[key];
            staticEntity.fillStyle = '#CCCCCC';
            const dynamicEntity = this.dynamicEntities3D[key];
            if (!this.viewState.phaseState.actionMap.has(staticEntity)) {
              this.viewState.phaseState.actionMap.set(staticEntity, []);
            }
            if (!this.viewState.phaseState.actionMap.has(dynamicEntity)) {
              this.viewState.phaseState.actionMap.set(dynamicEntity, []);
            }
            this.viewState.phaseState.actionMap.get(staticEntity).push(action);
            this.viewState.phaseState.actionMap.get(dynamicEntity).push(action);
          });
        }
      }
    } else if (this.viewState.phase === 'chooseSrc') {
      if (this.viewState.hoveredEntity === this.entities2D.back) {
        this.viewState.hoveredEntity.fillStyle = '#FFFFFF';
        this.viewState.phase = 'chooseAction';
        this.viewState.phaseState.actionMap = this.viewState.phaseState.prevActionMap.pop();
      } else {
        const actions = this.viewState.phaseState.actionMap.get(this.viewState.hoveredEntity);
        if (actions !== undefined) {
          this.viewState.phase = 'chooseDst';
          this.viewState.phaseState.prevActionMap.push(this.viewState.phaseState.actionMap);
          this.viewState.phaseState.actionMap = new Map();
          actions.forEach((action) => {
            const dsts = Array.isArray(action.dst) ? action.dst : [action.dst];
            dsts.forEach((dst) => {
              const key = `${dst.x}_${dst.y}`;
              const staticEntity = this.staticEntities3D[key];
              staticEntity.fillStyle = '#CCCCCC';
              const dynamicEntity = this.dynamicEntities3D[key];
              this.viewState.phaseState.actionMap.set(staticEntity, action);
              if (dynamicEntity !== undefined) {
                this.viewState.phaseState.actionMap.set(dynamicEntity, action);
              }
            });
          });
        }
      }
    } else if (this.viewState.phase === 'chooseDst') {
      if (this.viewState.hoveredEntity === this.entities2D.back) {
        this.viewState.hoveredEntity.fillStyle = '#FFFFFF';
        this.viewState.phase = 'chooseSrc';
        this.viewState.phaseState.actionMap = this.viewState.phaseState.prevActionMap.pop();
      } else {
        const action = this.viewState.phaseState.actionMap.get(this.viewState.hoveredEntity);
        if (action !== undefined) {
          const dsts = Array.isArray(action.dst) ? action.dst : [action.dst];
          dsts.forEach((dst) => {
            const key = `${dst.x}_${dst.y}`;
            const staticEntity = this.staticEntities3D[key];
            staticEntity.fillStyle = '#CCCCCC';
          });
          this.map.doAction(action);
          this.setupPhaseState();
        }
      }
    }
  }

  consumeInputs() {
    if (this.inputState.click) {
      this.handleClickEntity();
      this.inputState.click = false;
    }
    this.gameMapRenderer.setMouse(this.inputState.mx, this.inputState.my);

    let tx = 0;
    let ty = 0;
    let tz = 0;
    let rx = 0;
    let ry = 0;
    if (this.inputState.pressed.KeyA) {
      tx -= T_RATE;
    }
    if (this.inputState.pressed.KeyD) {
      tx += T_RATE;
    }
    if (this.inputState.pressed.KeyW) {
      ty -= T_RATE;
    }
    if (this.inputState.pressed.KeyS) {
      ty += T_RATE;
    }
    if (this.inputState.pressed.ShiftLeft) {
      tz -= T_RATE;
    }
    if (this.inputState.pressed.Space) {
      tz += T_RATE;
    }
    if (this.inputState.pressed.ArrowLeft) {
      ry += R_RATE;
    }
    if (this.inputState.pressed.ArrowRight) {
      ry -= R_RATE;
    }
    if (this.inputState.pressed.ArrowUp) {
      rx -= R_RATE;
    }
    if (this.inputState.pressed.ArrowDown) {
      rx += R_RATE;
    }
    this.viewport.translateAlongBasis(tx, ty, tz);
    this.viewport.rotateByBasis(rx, ry, 0);
  }
}

export default GameMapScreen;
