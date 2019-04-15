import { Point, Vector } from './render/Vector';
import Viewport from './render/Viewport';
import GameMapEntityFactory from './GameMapEntityFactory';
import GameMapRenderer from './GameMapRenderer';

const R_RATE = 3;
const T_RATE = 10;

class GameMapScreen {
  constructor(canvas, map) {
    this.map = map;
    this.map.addListener(this);

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
    this.setupChooseActionState();
  }

  setupChooseActionState() {
    this.entities2D.move.fillStyle = '#CCCCCC';
    this.entities2D.transfer.fillStyle = '#CCCCCC';
    this.entities2D.attack.fillStyle = '#CCCCCC';

    const actionMap = new Map();
    const validActions = this.map.getActions();
    validActions.forEach((action) => {
      if (action.name === 'move') {
        this.entities2D.move.fillStyle = '#FFFFFF';
        if (!actionMap.has(this.entities2D.move)) {
          actionMap.set(this.entities2D.move, [action]);
        } else {
          actionMap.get(this.entities2D.move).push(action);
        }
      } else if (action.name === 'transfer') {
        this.entities2D.transfer.fillStyle = '#FFFFFF';
        if (!actionMap.has(this.entities2D.transfer)) {
          actionMap.set(this.entities2D.transfer, [action]);
        } else {
          actionMap.get(this.entities2D.transfer).push(action);
        }
      } else if (action.name === 'attack') {
        this.entities2D.attack.fillStyle = '#FFFFFF';
        if (!actionMap.has(this.entities2D.attack)) {
          actionMap.set(this.entities2D.attack, [action]);
        } else {
          actionMap.get(this.entities2D.attack).push(action);
        }
      }
    });
    this.viewState.phase = 'chooseAction';
    this.viewState.phaseState = {
      actionMap,
      actions: validActions,
      prevActionMap: [],
      prevActions: [],
    };
  }

  start() {
    this.renderLoop();
  }

  renderLoop() {
    // Handle hovered entity
    this.unsetHoveredEntity();
    const hoveredEntity = this.gameMapRenderer.getHoveredEntity();
    this.setHoveredEntity(hoveredEntity);

    // Consume inputs
    this.consumeInputs();

    const entities3D = new Set(Object.values(this.dynamicEntities3D));

    // Perform animations
    if (this.viewState.phase === 'animating') {
      const currentAnimations = this.viewState.phaseState.animationQueue[0];
      const updatedAnimations = [];
      for (let i = 0; i < currentAnimations.length; i += 1) {
        const animation = currentAnimations[i];
        entities3D.add(animation.getEntity());
        animation.step();
        if (!animation.isFinished()) {
          updatedAnimations.push(animation);
        }
      }
      if (updatedAnimations.length > 0) {
        this.viewState.phaseState.animationQueue[0] = updatedAnimations;
      } else {
        this.viewState.phaseState.animationQueue.shift();
      }
      if (this.viewState.phaseState.animationQueue.length === 0) {
        this.setupChooseActionState();
      }
    }

    // Perform static animations
    entities3D.forEach((entity) => {
      entity.rotate(new Vector(0, 0, 1), 0.05);
    });

    // Debug purposes
    const dHover = this.viewState.hoveredEntity !== null ? this.viewState.hoveredEntity.constructor.name : 'null';
    const dPhase = this.viewState.phase;
    this.entities2D.debug.textInfos[0].text = `hover: ${dHover} | phase: ${dPhase}`;

    const entities2D = this.entities2DToRender();

    // render entities
    this.gameMapRenderer.render(this.viewport, Array.from(entities3D), entities2D);

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

  unsetHoveredEntity() {
    const hovered = this.viewState.hoveredEntity;
    if (hovered === null) {
      return;
    }
    if (this.viewState.phase === 'chooseAction') {
      if (hovered === this.entities2D.end) {
        hovered.fillStyle = '#FFFFFF';
      } else {
        const actions = this.viewState.phaseState.actionMap.get(hovered);
        if (actions !== undefined) {
          hovered.fillStyle = '#FFFFFF';
          actions.forEach((action) => {
            const key = `${action.src.x}_${action.src.y}`;
            this.staticEntities3D[key].fillStyle = '#CCCCCC';
          });
        }
      }
    } else if (this.viewState.phase === 'chooseSrc') {
      if (hovered === this.entities2D.back) {
        hovered.fillStyle = '#FFFFFF';
      } else {
        const actions = this.viewState.phaseState.actionMap.get(hovered);
        if (actions !== undefined) {
          actions.forEach((action) => {
            const srcKey = `${action.src.x}_${action.src.y}`;
            this.staticEntities3D[srcKey].fillStyle = '#FFFFFF';
            const dsts = Array.isArray(action.dst) ? action.dst : [action.dst];
            dsts.forEach((dst) => {
              const dstKey = `${dst.x}_${dst.y}`;
              this.staticEntities3D[dstKey].fillStyle = '#CCCCCC';
            });
          });
        }
      }
    } else if (this.viewState.phase === 'chooseDst') {
      if (hovered === this.entities2D.back) {
        hovered.fillStyle = '#FFFFFF';
      } else {
        const action = this.viewState.phaseState.actionMap.get(hovered);
        if (action !== undefined) {
          const dsts = Array.isArray(action.dst) ? action.dst : [action.dst];
          dsts.forEach((dst) => {
            const dstKey = `${dst.x}_${dst.y}`;
            this.staticEntities3D[dstKey].fillStyle = '#FFFFFF';
          });
        }
      }
    }
    this.viewState.hoveredEntity = null;
  }

  setHoveredEntity(entity) {
    const hovered = entity;
    this.viewState.hoveredEntity = hovered;
    if (hovered === null) {
      return;
    }
    if (this.viewState.phase === 'chooseAction') {
      if (hovered === this.entities2D.end) {
        hovered.fillStyle = '#E6E6E6';
      } else {
        const actions = this.viewState.phaseState.actionMap.get(hovered);
        if (actions !== undefined) {
          hovered.fillStyle = '#E6E6E6';
          actions.forEach((action) => {
            const key = `${action.src.x}_${action.src.y}`;
            this.staticEntities3D[key].fillStyle = '#FFFFFF';
          });
        }
      }
    } else if (this.viewState.phase === 'chooseSrc') {
      if (hovered === this.entities2D.back) {
        hovered.fillStyle = '#E6E6E6';
      } else {
        const actions = this.viewState.phaseState.actionMap.get(hovered);
        if (actions !== undefined) {
          actions.forEach((action) => {
            const srcKey = `${action.src.x}_${action.src.y}`;
            this.staticEntities3D[srcKey].fillStyle = '#E6E6E6';
            const dsts = Array.isArray(action.dst) ? action.dst : [action.dst];
            dsts.forEach((dst) => {
              const dstKey = `${dst.x}_${dst.y}`;
              this.staticEntities3D[dstKey].fillStyle = '#FFFFFF';
            });
          });
        }
      }
    } else if (this.viewState.phase === 'chooseDst') {
      if (hovered === this.entities2D.back) {
        hovered.fillStyle = '#E6E6E6';
      } else {
        const action = this.viewState.phaseState.actionMap.get(hovered);
        if (action !== undefined) {
          const dsts = Array.isArray(action.dst) ? action.dst : [action.dst];
          dsts.forEach((dst) => {
            const dstKey = `${dst.x}_${dst.y}`;
            this.staticEntities3D[dstKey].fillStyle = '#E6E6E6';
          });
        }
      }
    }
  }

  clickHoveredEntity() {
    // Don't do anything if not hovering over anything
    const hovered = this.viewState.hoveredEntity;
    if (hovered === null) {
      return;
    }
    this.unsetHoveredEntity();
    if (this.viewState.phase === 'chooseAction') {
      if (hovered === this.entities2D.end) {
        const endAction = this.viewState.phaseState.actions.filter(action => action.name === 'end')[0];
        this.map.doAction(endAction);
      } else {
        const actions = this.viewState.phaseState.actionMap.get(hovered);
        if (actions !== undefined) {
          this.viewState.phase = 'chooseSrc';
          this.viewState.phaseState.prevActionMap.push(this.viewState.phaseState.actionMap);
          this.viewState.phaseState.prevActions.push(this.viewState.phaseState.actions);
          this.viewState.phaseState.actionMap = new Map();
          this.viewState.phaseState.actions = actions;
          actions.forEach((action) => {
            const key = `${action.src.x}_${action.src.y}`;
            const staticEntity = this.staticEntities3D[key];
            staticEntity.fillStyle = '#FFFFFF';
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
      if (hovered === this.entities2D.back) {
        this.viewState.phase = 'chooseAction';
        this.viewState.phaseState.actions.forEach((action) => {
          const key = `${action.src.x}_${action.src.y}`;
          this.staticEntities3D[key].fillStyle = '#CCCCCC';
        });
        this.viewState.phaseState.actionMap = this.viewState.phaseState.prevActionMap.pop();
        this.viewState.phaseState.actions = this.viewState.phaseState.prevActions.pop();
      } else {
        const actions = this.viewState.phaseState.actionMap.get(hovered);
        if (actions !== undefined) {
          this.viewState.phase = 'chooseDst';
          this.viewState.phaseState.actions.forEach((action) => {
            const key = `${action.src.x}_${action.src.y}`;
            this.staticEntities3D[key].fillStyle = '#CCCCCC';
          });
          this.viewState.phaseState.prevActionMap.push(this.viewState.phaseState.actionMap);
          this.viewState.phaseState.prevActions.push(this.viewState.phaseState.actions);
          this.viewState.phaseState.actionMap = new Map();
          this.viewState.phaseState.actions = actions;
          actions.forEach((action) => {
            const srcKey = `${action.src.x}_${action.src.y}`;
            this.staticEntities3D[srcKey].fillStyle = '#E6E6E6';
            const dsts = Array.isArray(action.dst) ? action.dst : [action.dst];
            dsts.forEach((dst) => {
              const key = `${dst.x}_${dst.y}`;
              const staticEntity = this.staticEntities3D[key];
              staticEntity.fillStyle = '#FFFFFF';
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
      if (hovered === this.entities2D.back) {
        this.viewState.phase = 'chooseSrc';
        this.viewState.phaseState.actions.forEach((action) => {
          const dsts = Array.isArray(action.dst) ? action.dst : [action.dst];
          dsts.forEach((dst) => {
            const key = `${dst.x}_${dst.y}`;
            this.staticEntities3D[key].fillStyle = '#CCCCCC';
          });
        });
        this.viewState.phaseState.actionMap = this.viewState.phaseState.prevActionMap.pop();
        this.viewState.phaseState.actions = this.viewState.phaseState.prevActions.pop();
        this.viewState.phaseState.actions.forEach((action) => {
          const key = `${action.src.x}_${action.src.y}`;
          this.staticEntities3D[key].fillStyle = '#FFFFFF';
        });
      } else {
        const action = this.viewState.phaseState.actionMap.get(hovered);
        if (action !== undefined) {
          this.viewState.phaseState.actions.forEach((a) => {
            const srcKey = `${a.src.x}_${a.dst.x}`;
            this.staticEntities3D[srcKey].fillStyle = '#CCCCCC';
            const dsts = Array.isArray(a.dst) ? a.dst : [a.dst];
            dsts.forEach((dst) => {
              const key = `${dst.x}_${dst.y}`;
              this.staticEntities3D[key].fillStyle = '#CCCCCC';
            });
          });
          this.map.doAction(action);
        }
      }
    }
  }

  consumeInputs() {
    if (this.inputState.click) {
      this.clickHoveredEntity();
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
      tz += T_RATE;
    }
    if (this.inputState.pressed.KeyS) {
      tz -= T_RATE;
    }
    if (this.inputState.pressed.ShiftLeft) {
      ty += T_RATE;
    }
    if (this.inputState.pressed.Space) {
      ty -= T_RATE;
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

  triggerDoAction(action) {
    if (action.name === 'move') {
      if (this.viewState.phase !== 'animating') {
        this.viewState.phase = 'animating';
        this.viewState.phaseState.animationQueue = [];
      }
      const srcKey = `${action.src.x}_${action.src.y}`;
      const dstKey = `${action.dst.x}_${action.dst.y}`;
      const srcObj = this.dynamicEntities3D[srcKey];
      const dstObj = this.dynamicEntities3D[dstKey];
      delete this.dynamicEntities3D[srcKey];
      this.dynamicEntities3D[dstKey] = srcObj;

      for (let i = 0; i < action.path.length - 1; i += 1) {
        const animations = [];
        const srcStartJSON = {
          x: action.path[i].x,
          y: action.path[i].y,
          h: action.path[i].h,
          type: action.path[0].type,
        };
        const srcEndJSON = {
          x: action.path[i + 1].x,
          y: action.path[i + 1].y,
          h: action.path[i + 1].h,
          type: action.path[0].type,
        };
        const srcAnimation = GameMapEntityFactory.createAnimation(srcObj, srcStartJSON, srcEndJSON);
        animations.push(srcAnimation);
        if (dstObj !== undefined) {
          const dstAnimation = GameMapEntityFactory.createNoopAnimation(dstObj);
          animations.push(dstAnimation);
        }
        this.viewState.phaseState.animationQueue.push(animations);
      }
    } else if (action.name === 'end') {
      if (this.viewState.phase !== 'animating') {
        this.viewState.phase = 'animating';
        this.viewState.phaseState.animationQueue = [];
      }
      this.viewState.phaseState.animationQueue.push([]);
    }
  }
}

export default GameMapScreen;
