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

  getTiles() {
    return this.tiles;
  }

  getMapObjects() {
    return this.mapObjects;
  }

  // TODO: REVISIT
  getActions() {
    if (this.cachedActions !== null) {
      return this.cachedActions;
    }
    let actions = [{ name: 'end' }];
    if (this.actionCounter.move > 0) {
      actions = actions.concat(this.getMoveActions());
    }
    if (this.actionCounter.transfer > 0) {
      actions = actions.concat(this.getTransferActions());
    }
    if (this.actionCounter.attack > 0) {
      actions = actions.concat(this.getAttackActions());
      // actions = actions.concat(...objs.map(obj => obj.getAttackActions()));
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

  // TODO: REVISIT
  doAction(action) {
    const validActions = this.getActions();
    if (validActions.indexOf(action) === -1) {
      throw Error('Invalid Action');
    }

    // if (action.name === 'move') {

    // } else if (action.name === 'transfer') {

    // } else if (action.name === 'attack') {

    // } else if (action.name === 'end') {
    //   this.actionCounter = {
    //     move: 1,
    //     transfer: 1,
    //     attack: 1,
    //   }
    // }

    const { name } = action;
    if (this.actions[name] > 0) {
      const src = this.tileMap[action.src].getMapObject();
      let dst;
      if (name === 'attack') {
        dst = action.dst.map(d => this.tileMap[d]);
      } else {
        dst = this.tileMap[action.dst];
      }
      src[name](dst);
      this.actions[name] -= 1;

      this.listeners.forEach(l => l.trigger(action));
    } else if (name !== 'end') {
      throw Error('Invalid action');
    }
    if (name === 'end' || Object.values(this.actions).reduce((a, b) => a + b, 0) === 0) {
      this.turnPlayers.push(this.turnPlayers.shift());
      this.actions = {
        move: 1,
        transfer: 1,
        attack: 1,
      };
    }
  }

  undoAction(action) {
    this.cachedActions = null;
  }
}

export default GameMap;
