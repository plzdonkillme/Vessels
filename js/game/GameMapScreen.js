/* eslint-disable class-methods-use-this, no-unused-vars */

import { Point, Vector } from '../render/Vector';
import Viewport from '../render/Viewport';
import GameMapEntityFactory from './GameMapEntityFactory';
import GameMapRenderer from './GameMapRenderer';
import GameModeTransitioner from './GameModeTransitioner';

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

    // Input state
    this.inputState = {
      click: false,
      pressed: {},
      mx: null,
      my: null,
    };

    // Render state
    this.viewState = {
      mode: 'chooseAction',
      actions: this.map.getActions(),
      prevActions: [],
      showDebug: true,
      hoveredEntity: null,
      animationQueue: [],
    };

    GameModeTransitioner.enter(
      this.viewState,
      this.entities2D,
      this.staticEntities3D,
      this.dynamicEntities3D,
    );
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
    if (this.viewState.mode === 'animating') {
      const currentAnimations = this.viewState.animationQueue[0];
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
        this.viewState.animationQueue[0] = updatedAnimations;
      } else {
        this.viewState.animationQueue.shift();
      }
      if (this.viewState.animationQueue.length === 0) {
        this.viewState.mode = 'chooseAction';
        this.viewState.actions = this.map.getActions();
        this.viewState.prevActions = [];
        GameModeTransitioner.enter(
          this.viewState,
          this.entities2D,
          this.staticEntities3D,
          this.dynamicEntities3D,
        );
      }
    }

    // Perform static animations
    entities3D.forEach((entity) => {
      entity.rotate(new Vector(0, 0, 1), 0.05);
    });

    // Debug purposes
    const dHover = this.viewState.hoveredEntity !== null ? this.viewState.hoveredEntity.constructor.name : 'null';
    const dMode = this.viewState.mode;
    this.entities2D.debug.textInfos[0].text = `hover: ${dHover} | mode: ${dMode}`;

    const entities2D = this.entities2DToRender();

    // render entities
    this.gameMapRenderer.render(this.viewport, Array.from(entities3D), entities2D);

    window.requestAnimationFrame(() => {
      this.renderLoop();
    });
  }

  entities2DToRender() {
    const entities2D = [];
    if (this.viewState.mode === 'chooseAction') {
      entities2D.push(this.entities2D.move);
      entities2D.push(this.entities2D.transfer);
      entities2D.push(this.entities2D.attack);
      entities2D.push(this.entities2D.end);
    } else if (this.viewState.mode === 'chooseSrc') {
      entities2D.push(this.entities2D.back);
    } else if (this.viewState.mode === 'chooseDst') {
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
    GameModeTransitioner.unhover(
      this.viewState,
      this.entities2D,
      this.staticEntities3D,
      this.dynamicEntities3D,
    );
    this.viewState.hoveredEntity = null;
  }

  setHoveredEntity(entity) {
    const hovered = entity;
    this.viewState.hoveredEntity = hovered;
    if (hovered === null) {
      return;
    }
    GameModeTransitioner.hover(
      this.viewState,
      this.entities2D,
      this.staticEntities3D,
      this.dynamicEntities3D,
    );
  }

  clickHoveredEntity() {
    // Don't do anything if not hovering over anything
    const {
      mode,
      actions,
      prevActions,
      hoveredEntity,
    } = this.viewState;
    if (hoveredEntity === null) {
      return;
    }
    this.unsetHoveredEntity();
    let newMode = null;
    let newActions = null;
    if (mode === 'chooseAction') {
      if (hoveredEntity === this.entities2D.move) {
        newActions = actions.filter(action => action.name === 'move');
        if (newActions.length > 0) {
          newMode = 'chooseSrc';
          prevActions.push(actions);
        }
      } else if (hoveredEntity === this.entities2D.transfer) {
        newActions = actions.filter(action => action.name === 'transfer');
        if (newActions.length > 0) {
          newMode = 'chooseSrc';
          prevActions.push(actions);
        }
      } else if (hoveredEntity === this.entities2D.attack) {
        newActions = actions.filter(action => action.name === 'attack');
        if (newActions.length > 0) {
          newMode = 'chooseSrc';
          prevActions.push(actions);
        }
      } else if (hoveredEntity === this.entities2D.end) {
        newMode = 'executingAction';
        newActions = actions.filter(action => action.name === 'end');
      }
    } else if (mode === 'chooseSrc') {
      if (hoveredEntity === this.entities2D.back) {
        newMode = 'chooseAction';
        newActions = prevActions.pop();
      } else {
        newActions = actions.filter((action) => {
          const srcKey = `${action.src.x}_${action.src.y}`;
          return this.staticEntities3D[srcKey] === hoveredEntity
            || this.dynamicEntities3D[srcKey] === hoveredEntity;
        });
        if (newActions.length > 0) {
          newMode = 'chooseDst';
          prevActions.push(actions);
        }
      }
    } else if (mode === 'chooseDst') {
      if (hoveredEntity === this.entities2D.back) {
        newMode = 'chooseSrc';
        newActions = prevActions.pop();
      } else {
        newActions = actions.filter((action) => {
          const dsts = Array.isArray(action.dst) ? action.dst : [action.dst];
          for (let i = 0; i < dsts.length; i += 1) {
            const dstKey = `${dsts[i].x}_${dsts[i].y}`;
            if (this.staticEntities3D[dstKey] === hoveredEntity
              || this.dynamicEntities3D[dstKey] === hoveredEntity) {
              return true;
            }
          }
          return false;
        });
        if (newActions.length > 0) {
          newMode = 'executingAction';
        }
      }
    }

    if (newMode !== null) {
      GameModeTransitioner.exit(
        this.viewState,
        this.entities2D,
        this.staticEntities3D,
        this.dynamicEntities3D,
      );
      this.viewState.mode = newMode;
      this.viewState.actions = newActions;
      GameModeTransitioner.enter(
        this.viewState,
        this.entities2D,
        this.staticEntities3D,
        this.dynamicEntities3D,
      );
    }
    if (newMode === 'executingAction') {
      this.map.doAction(newActions[0]);
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
    if (this.viewState.mode !== 'animating') {
      GameModeTransitioner.exit(
        this.viewState,
        this.entities2D,
        this.staticEntities3D,
        this.dynamicEntities3D,
      );
      this.viewState.mode = 'animating';
    }
    if (action.name === 'move') {
      const srcKey = `${action.src.x}_${action.src.y}`;
      const dstKey = `${action.dst.x}_${action.dst.y}`;
      const srcObj = this.dynamicEntities3D[srcKey];
      const dstObj = this.dynamicEntities3D[dstKey];
      delete this.dynamicEntities3D[srcKey];
      this.dynamicEntities3D[dstKey] = srcObj;

      const animations = GameMapEntityFactory.createAnimations(srcObj, dstObj, action);
      this.viewState.animationQueue.push(...animations);
    } else if (action.name === 'transfer') {
      const srcKey = `${action.src.x}_${action.src.y}`;
      const dstKey = `${action.dst.x}_${action.dst.y}`;
      const srcObj = this.dynamicEntities3D[srcKey];
      const dstObj = this.dynamicEntities3D[dstKey];

      const animations = GameMapEntityFactory.createAnimations(srcObj, dstObj, action);
      this.viewState.animationQueue.push(...animations);
    } else if (action.name === 'attack') {
      const srcKey = `${action.src.x}_${action.src.y}`;
      const srcObj = this.dynamicEntities3D[srcKey];
      const dstObjs = {};
      action.dst.forEach((dst) => {
        const dstKey = `${dst.x}_${dst.y}`;
        const dstObj = this.dynamicEntities3D[dstKey];
        if (dstObj !== undefined) {
          dstObjs[dstKey] = dstObj;
        }
        delete this.dynamicEntities3D[dstKey];
      });

      const animations = GameMapEntityFactory.createAnimations(srcObj, dstObjs, action);
      this.viewState.animationQueue.push(...animations);
    } else if (action.name === 'end') {
      this.viewState.animationQueue.push([]);
    }
  }

  triggerUndoAction(action) {
    if (this.viewState.mode !== 'animating') {
      GameModeTransitioner.exit(
        this.viewState,
        this.entities2D,
        this.staticEntities3D,
        this.dynamicEntities3D,
      );
      this.viewState.mode = 'animating';
    }
    const { tiles } = this.map.toJSON();
    this.dynamicEntities3D = {};
    for (let i = 0; i < tiles.length; i += 1) {
      const key = `${tiles[i].x}_${tiles[i].y}`;
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
    this.viewState.animationQueue.push([]);
  }
}

export default GameMapScreen;
