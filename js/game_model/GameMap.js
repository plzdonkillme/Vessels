import { serialize } from './GameMapSerializer';
import { TileFactory } from './Tile';
import { MapObjectFactory } from './MapObject';

class GameMap {
  constructor(json) {
    const { tiles, state } = json;
    this.tiles = [];
    this.mapObjects = [];

    const tiles2D = [];
    for (let i = 0; i < tiles.length; i += 1) {
      const { x, y } = tiles[i];
      const tile = TileFactory.create(tiles[i]);
      this.tiles.push(tile);

      if (tiles2D[y] === undefined) {
        tiles2D[y] = [];
      }
      if (tiles2D[y - 1] === undefined) {
        tiles2D[y - 1] = [];
      }
      if (tiles2D[y + 1] === undefined) {
        tiles2D[y + 1] = [];
      }
      tiles2D[y][x] = tile;

      if (tiles2D[y - 1][x] !== undefined) {
        tiles2D[y - 1][x].addNeighbor(tile);
        tile.addNeighbor(tiles2D[y - 1][x]);
      }
      if (tiles2D[y + 1][x] !== undefined) {
        tiles2D[y + 1][x].addNeighbor(tile);
        tile.addNeighbor(tiles2D[y + 1][x]);
      }
      if (tiles2D[y][x - 1] !== undefined) {
        tiles2D[y][x - 1].addNeighbor(tile);
        tile.addNeighbor(tiles2D[y][x - 1]);
      }
      if (tiles2D[y][x + 1] !== undefined) {
        tiles2D[y][x + 1].addNeighbor(tile);
        tile.addNeighbor(tiles2D[y][x + 1]);
      }

      if (tiles[i].mapObject !== undefined) {
        const m = MapObjectFactory.create(tiles[i].mapObject);
        m.setTile(tile);
        tile.setMapObject(m);
        this.mapObjects.push(m);
      }
    }


    this.objective = state.objective;
    this.turnOrder = state.turnOrder;
    this.actionCounter = state.actionCounter;

    // TODO: Should this be part of the state json?
    this.actionHistory = [];

    // cache
    this.turnObjs = this.mapObjects.filter(m => m.getPlayer() === this.turnOrder[0]);
    this.cachedActions = null;

    // Listeners
    this.listeners = [];
  }

  toJSON() {
    const json = {};
    json.tiles = this.tiles.map(tile => tile.toJSON());
    json.state = {
      objective: this.objective,
      turnOrder: this.turnOrder,
      actionCounter: this.actionCounter,
    };
    return json;
  }

  serialize() {
    return serialize(this.toJSON());
  }

  getActions() {
    if (this.cachedActions !== null) {
      return this.cachedActions;
    }

    let actions = [{
      name: 'end',
      move: this.actionCounter.move,
      transfer: this.actionCounter.transfer,
      attack: this.actionCounter.attack,
    }];
    if (this.actionCounter.move > 0) {
      actions = actions.concat(this.getMoveActions());
    }
    if (this.actionCounter.transfer > 0) {
      actions = actions.concat(this.getTransferActions());
    }
    if (this.actionCounter.attack > 0) {
      actions = actions.concat(this.getAttackActions());
    }
    this.cachedActions = actions;
    return actions;
  }

  getMoveActions() {
    const actions = [];
    for (let i = 0; i < this.turnObjs.length; i += 1) {
      const paths = this.turnObjs[i].getMoveableTargets();
      paths.forEach((dstPath, dstTile) => {
        actions.push({
          name: 'move',
          src: this.turnObjs[i].getTile().toJSON(),
          dst: dstTile.toJSON(),
          path: dstPath.map(tile => tile.toJSON()),
        });
      });
    }
    return actions;
  }

  getTransferActions() {
    const actions = [];
    for (let i = 0; i < this.turnObjs.length; i += 1) {
      const targets = this.turnObjs[i].getTransferableTargets(this.turnObjs);
      for (let j = 0; j < targets.length; j += 1) {
        actions.push({
          name: 'transfer',
          src: this.turnObjs[i].getTile().toJSON(),
          dst: targets[j].getTile().toJSON(),
        });
      }
    }
    return actions;
  }

  getAttackActions() {
    const actions = [];
    for (let i = 0; i < this.turnObjs.length; i += 1) {
      const targets = this.turnObjs[i].getAttackableTargets();
      for (let j = 0; j < targets.length; j += 1) {
        actions.push({
          name: 'attack',
          src: this.turnObjs[i].getTile().toJSON(),
          dst: targets[j].map(tile => tile.toJSON()),
        });
      }
    }
    return actions;
  }

  doAction(action) {
    const validActions = this.getActions();
    if (validActions.indexOf(action) === -1) {
      throw Error('Invalid Action');
    }

    if (action.name === 'move') {
      this.doMoveAction(action);
    } else if (action.name === 'transfer') {
      this.doTransferAction(action);
    } else if (action.name === 'attack') {
      this.doAttackAction(action);
    } else if (action.name === 'end') {
      this.doEndAction();
    }

    this.cachedActions = null;
    this.turnObjs = this.mapObjects.filter(m => m.getPlayer() === this.turnOrder[0]);
    this.actionHistory.push(action);

    this.listeners.forEach(listener => listener.triggerDoAction(action));
  }

  doMoveAction(action) {
    const sx = action.src.x;
    const sy = action.src.y;
    const dx = action.dst.x;
    const dy = action.dst.y;
    const srcTile = this.tiles.filter(t => t.getX() === sx && t.getY() === sy)[0];
    const dstTile = this.tiles.filter(t => t.getX() === dx && t.getY() === dy)[0];
    const srcObj = srcTile.getMapObject();
    const dstObj = dstTile.getMapObject();
    if (dstObj === null) {
      srcObj.setTile(dstTile);
      dstTile.setMapObject(srcObj);
      srcTile.setMapObject(null);
    } else {
      const newObj = srcObj.mergeWith(dstObj);
      this.mapObjects.splice(this.mapObjects.indexOf(srcObj), 1);
      this.mapObjects.splice(this.mapObjects.indexOf(dstObj), 1);
      this.mapObjects.push(newObj);
      newObj.setTile(dstTile);
      dstTile.setMapObject(newObj);
      srcTile.setMapObject(null);
    }
    this.actionCounter.move -= 1;
  }

  doTransferAction(action) {
    const sx = action.src.x;
    const sy = action.src.y;
    const dx = action.dst.x;
    const dy = action.dst.y;
    const srcTile = this.tiles.filter(t => t.getX() === sx && t.getY() === sy)[0];
    const dstTile = this.tiles.filter(t => t.getX() === dx && t.getY() === dy)[0];
    const srcObj = srcTile.getMapObject();
    const dstObj = dstTile.getMapObject();
    const { newSrcObj, newDstObj } = srcObj.transferTo(dstObj);
    this.mapObjects.splice(this.mapObjects.indexOf(srcObj), 1);
    this.mapObjects.splice(this.mapObjects.indexOf(dstObj), 1);
    this.mapObjects.push(newSrcObj);
    this.mapObjects.push(newDstObj);
    srcTile.setMapObject(newSrcObj);
    newSrcObj.setTile(srcTile);
    dstTile.setMapObject(newDstObj);
    newDstObj.setTile(dstTile);
    this.actionCounter.transfer -= 1;
  }

  doAttackAction(action) {
    const sx = action.src.x;
    const sy = action.src.y;
    const srcTile = this.tiles.filter(t => t.getX() === sx && t.getY() === sy)[0];
    const srcObj = srcTile.getMapObject();
    for (let i = 0; i < action.dst.length; i += 1) {
      const dx = action.dst[i].x;
      const dy = action.dst[i].y;
      const dstTile = this.tiles.filter(t => t.getX() === dx && t.getY() === dy)[0];
      const dstObj = dstTile.getMapObject();
      if (dstObj !== null) {
        this.mapObjects.splice(this.mapObjects.indexOf(dstObj), 1);
      }
      const newDstObj = srcObj.attack(dstObj);
      if (newDstObj !== null) {
        this.mapObjects.push(newDstObj);
        newDstObj.setTile(dstTile);
      }
      dstTile.setMapObject(newDstObj);
    }
    this.actionCounter.attack -= 1;
  }

  doEndAction() {
    this.actionCounter = {
      move: 1,
      transfer: 1,
      attack: 1,
    };
    this.turnOrder.push(this.turnOrder.shift());
  }

  undoAction(action) {
    const prevAction = this.actionHistory[this.actionHistory.length - 1];
    if (action !== prevAction) {
      throw Error('Invalid Action');
    }

    if (action.name === 'move') {
      this.undoMoveAction(action);
    } else if (action.name === 'transfer') {
      this.undoTransferAction(action);
    } else if (action.name === 'attack') {
      this.undoAttackAction(action);
    } else if (action.name === 'end') {
      this.undoEndAction(action);
    }

    this.cachedActions = null;
    this.turnObjs = this.mapObjects.filter(m => m.getPlayer() === this.turnOrder[0]);
    this.actionHistory.pop();

    this.listeners.forEach(listener => listener.triggerUndoAction(action));
  }

  undoMoveAction(action) {
    const sx = action.src.x;
    const sy = action.src.y;
    const dx = action.dst.x;
    const dy = action.dst.y;
    const srcTile = this.tiles.filter(t => t.getX() === sx && t.getY() === sy)[0];
    const dstTile = this.tiles.filter(t => t.getX() === dx && t.getY() === dy)[0];
    const dstObj = dstTile.getMapObject();
    if (action.dst.mapObject === undefined) {
      dstObj.setTile(srcTile);
      srcTile.setMapObject(dstObj);
      dstTile.setMapObject(null);
    } else {
      const oldDstObj = MapObjectFactory.create(action.dst.mapObject);
      const oldSrcObj = MapObjectFactory.create(action.src.mapObject);
      this.mapObjects.splice(this.mapObjects.indexOf(dstObj), 1);
      this.mapObjects.push(oldDstObj);
      this.mapObjects.push(oldSrcObj);
      srcTile.setMapObject(oldSrcObj);
      oldSrcObj.setTile(srcTile);
      dstTile.setMapObject(oldDstObj);
      oldDstObj.setTile(dstTile);
    }
    this.actionCounter.move += 1;
  }

  undoTransferAction(action) {
    const sx = action.src.x;
    const sy = action.src.y;
    const dx = action.dst.x;
    const dy = action.dst.y;
    const srcTile = this.tiles.filter(t => t.getX() === sx && t.getY() === sy)[0];
    const dstTile = this.tiles.filter(t => t.getX() === dx && t.getY() === dy)[0];
    const srcObj = srcTile.getMapObject();
    const dstObj = dstTile.getMapObject();
    const oldDstObj = MapObjectFactory.create(action.dst.mapObject);
    const oldSrcObj = MapObjectFactory.create(action.src.mapObject);
    this.mapObjects.splice(this.mapObjects.indexOf(srcObj), 1);
    this.mapObjects.splice(this.mapObjects.indexOf(dstObj), 1);
    this.mapObjects.push(oldSrcObj);
    this.mapObjects.push(oldDstObj);
    srcTile.setMapObject(oldSrcObj);
    oldSrcObj.setTile(srcTile);
    dstTile.setMapObject(oldDstObj);
    oldDstObj.setTile(dstTile);
    this.actionCounter.transfer += 1;
  }

  undoAttackAction(action) {
    for (let i = 0; i < action.dst.length; i += 1) {
      const dx = action.dst[i].x;
      const dy = action.dst[i].y;
      const dstTile = this.tiles.filter(t => t.getX() === dx && t.getY() === dy)[0];
      const dstObj = dstTile.getMapObject();
      if (dstObj !== null) {
        this.mapObjects.splice(this.mapObjects.indexOf(dstObj), 1);
      }
      if (action.dst[i].mapObject !== undefined) {
        const oldDstObj = MapObjectFactory.create(action.dst[i].mapObject);
        this.mapObjects.push(oldDstObj);
        oldDstObj.setTile(dstTile);
        dstTile.setMapObject(oldDstObj);
      }
    }
    this.actionCounter.attack += 1;
  }

  undoEndAction(action) {
    this.actionCounter = {
      move: action.move,
      transfer: action.transfer,
      attack: action.attack,
    };
    this.turnOrder.unshift(this.turnOrder.pop());
  }

  addListener(listener) {
    this.listeners.push(listener);
  }
}

export default GameMap;
