import { Color } from './Color';
import { Tile, EmptyTile, TileGroup } from './Tile';

class MapObject {
  constructor(props, tile = null) {
    this.player = null;
    this.tile = tile;
    if (tile !== null) {
      tile.setMapObject(this);
    }
  }

  setTile(tile) {
    this.tile = tile;
    tile.setMapObject(this);
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
      type: this.constructor.name(),
      x: this.tile.getX(),
      y: this.tile.getY(),
    };
  }

  static name() {
    throw Error('Unimplemented');
  }
}

class Shard extends MapObject {
  attackedBy(vessel) {
    this.tile.unsetMapObject();
    return {
      key: this.getKey(),
      color: null,
    };
  }
}

class BlueShard extends Shard {
  static name() {
    return 'bs';
  }
}

class RedShard extends Shard {
  static name() {
    return 'rs';
  }
}

class YellowShard extends Shard {
  static name() {
    return 'ys';
  }
}


class Vessel extends MapObject {
  constructor(props, tile = null) {
    super(...arguments);
    this.player = props.player;
    this.movement = 4;
    this.range = 1;
  }

  toJSON() {
    const json = super.toJSON();
    json.player = this.player;
    return json;
  }

  getMoveActions() {
    const paths = this.getMoveablePaths();
    const srcKey = this.tile.getKey();
    const actions = [];
    for (const key in paths) {
      actions.push({
        name: 'move',
        src: srcKey,
        dst: key,
        path: paths[key],
      });
    }
    return actions;
  }

  getTransferActions(objs) {
    if (this.getShard() === null) {
      return [];
    }
    return objs.filter(o => o !== this && o.getShard() === null).map(o => ({
      name: 'transfer',
      src: this.tile.getKey(),
      dst: o.tile.getKey(),
    }));
  }

  getAttackActions() {
    let tileGroups = this.getAttackableTileGroups();
    tileGroups = tileGroups.filter(t => t.getMapObjects().length > 0);
    return tileGroups.map(t => ({
      name: 'attack',
      src: this.tile.getKey(),
      dst: t.getTiles().map(tile => tile.getKey()),
    }));
  }

  transfer(tile) {
    const target = tile.getMapObject();
    const cls = target.consumeShard(this.getShard());
    const newObj = new cls(target.toJSON(), tile);
    const origObj = new WhiteVessel(this.toJSON(), this.tile);
  }

  attack(tiles) {
    tiles.map(t => t.getMapObject()).filter(m => m !== null).forEach(m => m.attackedBy(this));
  }

  move(tile) {
    const mO = tile.getMapObject();
    if (mO === null) {
      this.tile.unsetMapObject();
      tile.setMapObject(this);
      this.tile = tile;
    } else if (mO instanceof Shard) {
      const cls = this.consumeShard(mO);
      const newObj = new cls(this.toJSON(), tile);
      this.tile.unsetMapObject();
    }
  }

  getShard() {
    return null;
  }

  getAttackableTileGroups() {
    const dirs = ['left', 'right', 'top', 'down'];
    let queue = new Set([this.tile]);
    let nextQueue;
    const tileSet = new Set();
    for (let i = 0; i < this.range; i++) {
      nextQueue = new Set();
      queue.forEach((tile) => {
        dirs.forEach((dir) => {
          const t = tile[dir];
          if (t !== null && t !== this.tile) {
            nextQueue.add(t);
            tileSet.add(t);
          }
        });
      });
      queue = nextQueue;
    }
    return Array.from(tileSet).map(t => new TileGroup([t]));
  }

  getMoveablePaths() {
    const dirs = ['left', 'right', 'top', 'down'];
    let queue = new Set([this.tile]);
    let nextQueue;
    const paths = {};
    const startKey = this.tile.getKey();
    paths[startKey] = [startKey];
    const keysToDelete = [startKey];
    for (let i = 0; i < this.movement; i++) {
      nextQueue = new Set();
      queue.forEach((tile) => {
        const key = tile.getKey();
        dirs.forEach((dir) => {
          const t = tile[dir];
          if (t !== null && t !== this.tile) {
            if (this.canMoveThrough(t) && Math.abs(t.getH() - tile.getH()) < 2) {
              const tkey = t.getKey();
              if (paths[tkey] === undefined) {
                nextQueue.add(t);
                paths[tkey] = paths[key].concat(tkey);
                if (!this.canMoveTo(t)) {
                  keysToDelete.push(tkey);
                }
              }
            }
          }
        });
      });
      queue = nextQueue;
    }
    keysToDelete.forEach(key => delete paths[key]);
    return paths;
  }

  canMoveThrough(tile) {
    if (tile instanceof EmptyTile) {
      return false;
    }
    const mO = tile.getMapObject();
    if (mO === null || mO instanceof Shard || mO.getPlayer() === this.player) {
      return true;
    }
    return false;
  }

  canMoveTo(tile) {
    if (tile instanceof EmptyTile) {
      return false;
    }
    const mO = tile.getMapObject();
    if (mO === null || mO instanceof Shard) {
      return true;
    }
    return false;
  }

  attackedBy(vessel) {
    this.tile.unsetMapObject();
    return {
      key: this.getKey(),
      color: null,
    };
  }
}

class WhiteVessel extends Vessel {
  consumeShard(shard) {
    if (shard instanceof BlueShard) {
      return BlueVessel;
    } if (shard instanceof RedShard) {
      return RedVessel;
    } if (shard instanceof YellowShard) {
      return YellowVessel;
    }
  }

  static name() {
    return 'w';
  }
}

class BlueVessel extends Vessel {
  constructor() {
    super(...arguments);
    this.range = 2;
  }

  static name() {
    return 'b';
  }

  getShard() {
    return new BlueShard();
  }

  attackedBy(vessel) {
    if (vessel instanceof WhiteVessel) {
      const obj = new WhiteVessel(this.toJSON(), tile);
      return {
        key: this.getKey(),
        color: obj.getColor(),
      };
    }
  }
}

class RedVessel extends Vessel {
  static name() {
    return 'r';
  }

  getShard() {
    return new RedShard();
  }

  attackedBy(vessel) {
    if (vessel instanceof WhiteVessel) {
      const obj = new WhiteVessel([this.player], this.tile, this.getKey());
      return {
        key: this.getKey(),
        color: obj.getColor(),
      };
    }
  }

  getAttackableTargets() {
    const dirs1 = ['left', 'right'];
    const dirs2 = ['top', 'down'];
    const tileSet = new Set();
    dirs1.forEach((dir) => {
      const t = this.tile[dir];
      if (t !== null) {
        if (t.getMapObject() !== null) {
          tileSet.add(t);
        }
        dirs2.forEach((dir2) => {
          const t2 = t[dir2];
          if (t2 !== null && t2.getMapObject() !== null) {
            tileSet.add(t2);
          }
        });
      }
    });
    dirs2.forEach((dir) => {
      const t = this.tile[dir];
      if (t !== null) {
        if (t.getMapObject() !== null) {
          tileSet.add(t);
        }
        dirs1.forEach((dir2) => {
          const t2 = t[dir2];
          if (t2 !== null && t2.getMapObject() !== null) {
            tileSet.add(t2);
          }
        });
      }
    });

    const tileArray = Array.from(tileSet);
    const tileKeys = tileArray.map(t => t.getKey());
    const objKeys = tileArray.map(t => t.getMapObject().getKey());
    const ret = [];
    ret.push(tileKeys.concat(objKeys));
    return ret;
  }
}

class YellowVessel extends Vessel {
  constructor() {
    super(...arguments);
    this.movement = 5;
  }

  static name() {
    return 'y';
  }

  getShard() {
    return new YellowShard();
  }

  attackedBy(vessel) {
    if (vessel instanceof WhiteVessel) {
      const obj = new WhiteVessel([this.player], this.tile, this.getKey());
      return {
        key: this.getKey(),
        color: obj.getColor(),
      };
    }
  }
}

const NAME_MAP = {
  bs: BlueShard,
  rs: RedShard,
  ys: YellowShard,
  w: WhiteVessel,
  b: BlueVessel,
  r: RedVessel,
  y: YellowVessel,
};

const POLYGON_MAP = {
  bs: 'tetrahedron',
  rs: 'tetrahedron',
  ys: 'tetrahedron',
  w: 'icosahedron',
  b: 'icosahedron',
  r: 'icosahedron',
  y: 'icosahedron',
};

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
    const props = propString.split('_');
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
    return propString;
  },
};

export { MapObject, MapObjectFactory };
