/* eslint-disable class-methods-use-this, no-unused-vars, no-use-before-define */

class MapObject {
  constructor(props) {
    this.player = null;
    this.tile = null;
  }

  setTile(tile) {
    this.tile = tile;
  }

  getTile() {
    return this.tile;
  }

  getX() {
    return this.tile.getX();
  }

  getY() {
    return this.tile.getY();
  }

  getH() {
    return this.tile.getH();
  }

  getPlayer() {
    return this.player;
  }

  toJSON() {
    return {
      type: this.typeString(),
    };
  }

  typeString() {
    throw Error('Unimplemented');
  }
}

class Shard extends MapObject {
}

class BlueShard extends Shard {
  typeString() {
    return 'bs';
  }
}

class RedShard extends Shard {
  typeString() {
    return 'rs';
  }
}

class YellowShard extends Shard {
  typeString() {
    return 'ys';
  }
}


class Vessel extends MapObject {
  constructor(props) {
    super(props);
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
    pathsToDelete.forEach(tile => paths.delete(tile));
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
    if (mO instanceof Shard && this.getShard() === null) {
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
    return mapObjects.filter(m => m !== this && m.getShard() === null);
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

  mergeWith(mapObject) {
    if (mapObject instanceof BlueShard) {
      return new BlueVessel({ player: this.player });
    }
    if (mapObject instanceof RedShard) {
      return new RedVessel({ player: this.player });
    }
    if (mapObject instanceof YellowShard) {
      return new YellowVessel({ player: this.player });
    }
    return this;
  }

  transferTo(mapObject) {
    return {
      newSrcObj: mapObject,
      newDstObj: this,
    };
  }

  attack(mapObject) {
    return null;
  }
}

class WhiteVessel extends Vessel {
  typeString() {
    return 'w';
  }
}

class BlueVessel extends Vessel {
  constructor(props) {
    super(props);
    this.range = 2;
    this.shard = 'bs';
  }

  typeString() {
    return 'b';
  }
}

class RedVessel extends Vessel {
  constructor(props) {
    super(props);
    this.shard = 'rs';
  }

  typeString() {
    return 'r';
  }

  getAttackableTargets() {
    const targetTiles = new Set(this.tile.getNeighbors());
    let hasTarget = false;
    targetTiles.forEach((n1) => {
      hasTarget = hasTarget || n1.getMapObject() !== null;
      n1.getNeighbors().forEach((n2) => {
        if (n2 !== this.tile
          && Math.abs(n2.getX() - this.tile.getX()) === 1
          && Math.abs(n2.getY() - this.tile.getY()) === 1
        ) {
          hasTarget = hasTarget || n1.getMapObject() !== null;
          targetTiles.add(n2);
        }
      });
    });
    if (hasTarget) {
      return [Array.from(targetTiles)];
    }
    return [];
  }
}

class YellowVessel extends Vessel {
  constructor(props) {
    super(props);
    this.shard = 'ys';
    this.movement = 5;
  }

  typeString() {
    return 'y';
  }
}

const MapObjectFactory = {
  map: {
    bs: BlueShard,
    rs: RedShard,
    ys: YellowShard,
    w: WhiteVessel,
    b: BlueVessel,
    r: RedVessel,
    y: YellowVessel,
  },
  create(json) {
    const MapObjectClass = this.map[json.type];
    return new MapObjectClass(json);
  },
  getJSON(propString) {
    const props = propString.trim().split('_');
    const json = {
      type: props[0],
    };
    if (props.length > 1) {
      json.player = props[1]; // eslint-disable-line prefer-destructuring
    }
    return json;
  },
  getPropString(json) {
    let propString = json.type;
    if (json.player !== undefined) {
      propString = `${propString}_${json.player}`;
    }
    const padding = ' '.repeat(3 - propString.length);
    return `${propString}${padding}`;
  },
  getPropStringWidth() {
    return 3;
  },
};

export {
  MapObjectFactory,
  BlueShard,
  RedShard,
  YellowShard,
  WhiteVessel,
  BlueVessel,
  RedVessel,
  YellowVessel,
};
