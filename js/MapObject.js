class MapObject {

    constructor(props, tile = null) {
        this.tile = tile;
        if (tile !== null) {
            tile.setMapObject(this);
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
}

class Shard extends MapObject {

    attackedBy() {
        this.tile.unsetMapObject();
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
            new cls([mO.getPlayer()], tile);
            new WhiteVessel([this.player], this.tile);
        } else {
            throw Error('Invalid transfer tile');
        }
    }

    attack(tile, player) {
        if (player !== this.player) {
            throw Error('Invalid action: wrong player');
        }
        if (!this.tile.getNeighbors(this.range).has(tile)) {
            throw Error('Invalid action: cannot reach tile');
        }

        const mO = tile.getMapObject();
        if (mO !== null) {
            mO.attackedBy(this);
        } else {
            throw Error('Invalid attack tile');
        }
    }

    move(tile, player) {
        if (player !== this.player) {
            throw Error('Invalid action: wrong player');
        }
        if (!this.tile.getNeighbors(this.movement).has(tile)) {
            throw Error('Invalid action: cannot reach tile');
        }

        const mO = tile.getMapObject();
        if (mO === null) {
            this.tile.unsetMapObject();
            tile.setMapObject(this);
            this.tile = tile;
        } else if (mO instanceof Shard) {
            const cls = this.consumeShard(mO);
            new cls([this.player], tile);
            this.tile.unsetMapObject();
        } else {
            throw Error('Invalid move tile');
        }
    }

    getPlayer() {
        return this.player;
    }

    getShard() {
        return null;
    }

    attackedBy() {
        this.tile.unsetMapObject();
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
}

class BlueVessel extends Vessel {

    static name() {
        return 'b';
    }

    getShard() {
        return new BlueShard();
    }
}

class RedVessel extends Vessel {

    static name() {
        return 'r';
    }

    getShard() {
        return new RedShard();
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

export { MapObject }