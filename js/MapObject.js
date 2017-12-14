import { Color } from './Color';
import { EmptyTile } from './Tile';

let COUNTER = 0;

class MapObject {

    constructor(props, tile = null, id = null) {
        this.tile = tile;
        if (tile !== null) {
            tile.setMapObject(this);
        }
        if (id === null) {
            this.id = `mapObject-${COUNTER}`;
            COUNTER += 1;
        } else {
            this.id = id;
        }
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

    serialize() {
        return `${this.constructor.name()}-${this.getX()}-${this.getY()}`;
    }

    static deserialize(props, tiles) {
        const p = props.split('-');
        const cls = NAME_MAP[p[0]];
        const x = parseInt(p[1]);
        const y = parseInt(p[2]);
        return new cls(p.slice(3, p.length), tiles[y][x]);
    }

    setReferences(tiles, mapObjects) {
        this.tile = tiles[this.y][this.x];
        this.tile.setMapObject(this);
    }

    getActions() {
        return [];
    }

    getPlayer() {
        return null;
    }

    getPolygon() {
        return POLYGON_MAP[this.constructor.name()];
    }

    getKey() {
        return this.id;
    }
}

class Shard extends MapObject {

    attackedBy(vessel) {
        this.tile.unsetMapObject();
        return {
            name: 'attack',
            srcKey: vessel.getKey(),
            dstKey: this.getKey(),
            dstColor: null,
        };
    }
}

class BlueShard extends Shard {

    static name() {
        return 'bs';
    }

    getColor() {
        return new Color(0, 0, 255, 1);
    }

    getHoverColor() {
        return new Color(0, 0, 255, 1);
    }
}

class RedShard extends Shard {
    static name() {
        return 'rs';
    }

    getColor() {
        return new Color(255, 0, 0, 1);
    }

    getHoverColor() {
        return new Color(255, 0, 0, 1);
    }
}

class YellowShard extends Shard {
    static name() {
        return 'ys';
    }

    getColor() {
        return new Color(255, 255, 0, 1);
    }

    getHoverColor() {
        return new Color(255, 255, 0, 1);
    }
}


class Vessel extends MapObject {

    constructor(props, tile) {
        super(...arguments);
        this.player = props[0];
        this.movement = 4;
        this.range = 1;
    }


    serialize() {
        return `${super.serialize()}-${this.player}`
    }

    transfer(tile, player) {
        if (player !== this.player) {
            throw Error('Invalid action: wrong player');
        }
        const mO = tile.getMapObject();
        if (mO !== null && mO.getPlayer() === this.player && this.getShard() !== null) {
            const cls = mO.consumeShard(this.getShard());
            var newObj = new cls([mO.getPlayer()], tile, mO.getKey());
            var origObj = new WhiteVessel([this.player], this.tile, this.getKey());
            return {
                name: 'transfer',
                srcKey: this.getKey(), 
                dstKey: mO.getKey(),
                srcColor: origObj.getColor(),
                srcHoverColor: origObj.getHoverColor(),
                dstColor: newObj.getColor(),
                dstHoverColor: newObj.getHoverColor(),
            }
        } else {
            throw Error('Invalid transfer tile');
        }
    }

    attack(tile, player) {
        if (player !== this.player) {
            throw Error('Invalid action: wrong player');
        }

        const targetTiles = this.getAttackableTiles();
        const key = tile.getKey();

        if (targetTiles.indexOf(key) === -1) {
            throw Error('Invalid action: cannot reach tile');
        }

        const targets = this.getAttackedObjects(tile);

        if (targets.length === 0) {
            throw Error('Invalid attack tile');
        } else {
            targets.forEach(target => t)
        }
    }

    move(tile, player) {
        if (player !== this.player) {
            throw Error('Invalid action: wrong player');
        }

        const paths = this.getMoveablePaths();
        const key = tile.getKey();

        if (paths[key] === undefined) {
            throw Error('Invalid action: cannot reach tile');
        }

        const mO = tile.getMapObject();
        if (mO === null) {
            this.tile.unsetMapObject();
            tile.setMapObject(this);
            this.tile = tile;
            return {
                name: 'move',
                path: paths[key],
                objKey: this.getKey(),
            };
        } else if (mO instanceof Shard) {
            const cls = this.consumeShard(mO);
            var newObj = new cls([this.player], tile, this.getKey());
            this.tile.unsetMapObject();
            return {
                name: 'move',
                path: paths[key],
                color: newObj.getColor(),
                hoverColor: newObj.getHoverColor(),
                objKey: this.getKey(),
                shardKey: mO.getKey(),
            };
        }
        throw Error('Invalid move tile');
    }

    getPlayer() {
        return this.player;
    }

    getShard() {
        return null;
    }

    getAttackableTiles() {
        const dirs = ['left', 'right', 'top', 'down'];
        let queue = new Set([this.tile]);
        let nextQueue;
        const keySet = new Set();
        for (let i = 0; i < this.range; i++) {
            nextQueue = new Set();
            queue.forEach(tile => {
                const key = tile.getKey();
                dirs.forEach((dir) => {
                    const t = tile[dir];
                    if (t !== null && t !== this.tile) {
                        const tkey = t.getKey();
                        nextQueue.add(t);
                        keySet.add(tkey);
                    }
                })
            });
            queue = nextQueue;
        }
        return keySet;
    }

    getAttackedObjects(tile) {
        const mO = tile.getMapObject();
        if (mO === null) {
            return [];
        } else {
            return [mO];
        }
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
            queue.forEach(tile => {
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
                })
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
            name: 'attack',
            srcKey: vessel.getKey(),
            dstKey: this.getKey(),
            dstColor: null,
        };
    }
}

class WhiteVessel extends Vessel {

    consumeShard(shard) {
        if (shard instanceof BlueShard) {
            return BlueVessel;
        } else if (shard instanceof RedShard) {
            return RedVessel;
        } else if (shard instanceof YellowShard) {
            return YellowVessel;
        }
    }

    static name() {
        return 'w';
    }

    getColor() {
        return new Color(255, 255, 255, 1);
    }

    getHoverColor() {
        return new Color(230, 230, 230, 1);
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

    getColor() {
        return new Color(0, 0, 255, 1);
    }

    getHoverColor() {
        return new Color(0, 0, 255, 1);
    }

    attackedBy(vessel) {
        if (vessel instanceof WhiteVessel) {
            const obj = new WhiteVessel([this.player], this.tile, this.getKey());
            return {
                name: 'attack',
                srcKey: vessel.getKey(),
                dstKey: this.getKey(),
                dstColor: obj.getColor(),
                dstHoverColor: obj.getHoverColor(),
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

    getColor() {
        return new Color(255, 0, 0, 1);
    }

    getHoverColor() {
        return new Color(255, 0, 0, 1);
    }

    attackedBy(vessel) {
        if (vessel instanceof WhiteVessel) {
            const obj = new WhiteVessel([this.player], this.tile, this.getKey());
            return {
                name: 'attack',
                srcKey: vessel.getKey(),
                dstKey: this.getKey(),
                dstColor: obj.getColor(),
                dstHoverColor: obj.getHoverColor(),
            };
        }
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

    getColor() {
        return new Color(255, 255, 0, 1);
    }

    getHoverColor() {
        return new Color(255, 255, 0, 1);
    }

    attackedBy(vessel) {
        if (vessel instanceof WhiteVessel) {
            const obj = new WhiteVessel([this.player], this.tile, this.getKey());
            return {
                name: 'attack',
                srcKey: vessel.getKey(),
                dstKey: this.getKey(),
                dstColor: obj.getColor(),
                dstHoverColor: obj.getHoverColor(),
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
}

const POLYGON_MAP = {
    bs: 'tetrahedron',
    rs: 'tetrahedron',
    ys: 'tetrahedron',
    w: 'icosahedron',
    b: 'icosahedron',
    r: 'icosahedron',
    y: 'icosahedron',
}

export { MapObject }