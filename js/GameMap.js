import { serialize } from './GameMapSerializer';
import { TileFactory } from './Tile';
import ObjectiveFactory from './Objective';
import { MapObjectFactory } from './MapObject';

class GameMap {
  constructor(json) {
    const { tiles, state } = json;
    this.tiles = [];
    for (let y = 0; y < tiles.length; y += 1) {
      const tileRow = [];
      for (let x = 0; x < tiles[y].length; x += 1) {
        const tile = TileFactory.create(tiles[y][x]);
        if (tiles[y][x].mapObject !== undefined) {
          const m = MapObjectFactory.create(tiles[y][x].mapObject);
          m.setTile(tile);
        }
        if (y > 0) {
          this.tiles[y - 1][x].link('down', tile);
          tile.link('top', this.tiles[y - 1][x]);
        }
        if (x > 0) {
          tileRow[x - 1].link('right', tile);
          tile.link('left', tileRow[x - 1]);
        }
        tileRow.push(tile);
      }
      this.tiles.push(tileRow);
    }
    this.objective = ObjectiveFactory.create(state.objective);
    this.turnOrder = state.turnOrder;
    this.actionCounter = state.actionCounter;

    // TODO: Should this be part of the state json?
    this.actionHistory = [];

    // cache
    this.cachedActions = null;
  }

  toJSON() {
    const json = {};
    json.tiles = this.tiles.map(tileRow => tileRow.map(tile => tile.toJSON()));
    json.state = {
      objective: this.objective.toJSON(),
      turnOrder: this.turnOrder,
      actionCounter: this.actionCounter,
    };
    return json;
  }

  // TODO: REVISIT
  doAction(action) {
    const validActions = this.getActions();
    if (validActions.indexOf(action) === -1) {
      throw Error('Invalid Action');
    }

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

  // TODO: REVISIT
  getActions() {
    if (this.cachedActions !== null) {
      return this.cachedActions;
    }
    let actions = [{ name: 'end' }];
    const objs = this.getMapObjects().filter(m => m.getPlayer() === this.turnOrder[0]);
    if (this.actionCounter.move > 0) {
      actions = actions.concat(...objs.map(obj => obj.getMoveActions()));
    }
    if (this.actionCounter.transfer > 0) {
      actions = actions.concat(...objs.map(obj => obj.getTransferActions(objs)));
    }
    if (this.actionCounter.attack > 0) {
      actions = actions.concat(...objs.map(obj => obj.getAttackActions()));
    }
    this.cachedActions = actions;
    return actions;
  }

  getMapObjects() {
    const mapObjects = [];
    this.tiles.forEach((tileRow) => {
      tileRow.forEach((tile) => {
        const mapObject = tile.getMapObject();
        if (mapObject !== null) {
          mapObjects.push(mapObject);
        }
      });
    });
    return mapObjects;
  }

  getTiles() {
    return [].concat(...this.tiles);
  }

  isResolved() {
    return this.objective.check(this);
  }

  serialize() {
    return serialize(this.toJSON());
  }
}

export default GameMap;
