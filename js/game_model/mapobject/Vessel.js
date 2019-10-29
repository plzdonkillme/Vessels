/* eslint-disable class-methods-use-this */

import MapObject from './MapObject';
import Shard from './Shard';

class Vessel extends MapObject {
  constructor(props) {
    super();
    this.player = props.player;
    this.movement = 4;
    this.jump = 1;
    this.range = 1;
    this.shard = null;
  }

  toJSON() {
    const json = super.toJSON();
    json.player = this.player;
    return json;
  }

  getShard() {
    return this.shard;
  }

  getMoveableTargets() {
    let queue = new Set([this.tile]);
    let nextQueue;
    const paths = new Map();
    paths.set(this.tile, [this.tile]);
    const pathsToDelete = new Set([this.tile]);
    for (let i = 0; i < this.movement; i += 1) {
      nextQueue = new Set();
      queue.forEach((tile) => { /* eslint-disable-line no-loop-func */
        tile.getNeighbors().forEach((nextTile) => {
          if (paths.get(nextTile) === undefined
            && this.canMoveThrough(tile, nextTile)
          ) {
            nextQueue.add(nextTile);
            paths.set(nextTile, paths.get(tile).concat(nextTile));
            if (!this.canMoveTo(nextTile)) {
              pathsToDelete.add(nextTile);
            }
          }
        });
      });
      queue = nextQueue;
    }
    pathsToDelete.forEach((tile) => paths.delete(tile));
    return paths;
  }

  canMoveThrough(tile, nextTile) {
    if (Math.abs(nextTile.getH() - tile.getH()) > this.jump) {
      return false;
    }
    const mO = nextTile.getMapObject();
    if (mO === null || mO.getPlayer() === this.player) {
      return true;
    }
    if (mO instanceof Shard && (this.getShard() === null || this.getShard() === mO.typeString())) {
      return true;
    }
    return false;
  }

  canMoveTo(tile) {
    const mO = tile.getMapObject();
    if (mO === null || mO instanceof Shard) {
      return true;
    }
    return false;
  }

  getTransferableTargets(mapObjects) {
    if (this.getShard() === null) {
      return [];
    }
    return mapObjects.filter((m) => m !== this && m.getShard() === null);
  }

  getAttackableTargets() {
    let queue = new Set([this.tile]);
    let nextQueue;
    const visited = new Set([this.tile]);
    for (let i = 0; i < this.range; i += 1) {
      nextQueue = new Set();
      queue.forEach((tile) => { /* eslint-disable-line no-loop-func */
        tile.getNeighbors().forEach((nextTile) => {
          if (!visited.has(nextTile)) {
            nextQueue.add(nextTile);
            visited.add(nextTile);
          }
        });
      });
      queue = nextQueue;
    }
    const attackableTargets = [];
    visited.forEach((tile) => {
      const mO = tile.getMapObject();
      if (mO !== null && mO !== this) {
        attackableTargets.push([tile]);
      }
    });
    return attackableTargets;
  }
}

export default Vessel;
