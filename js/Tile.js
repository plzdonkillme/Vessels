class Tile {

    constructor(x, y, h) {
        this.x = x;
        this.y = y;
        this.h = h;
        this.left = null;
        this.right = null;
        this.top = null;
        this.down = null;
        this.mapObject = null;
    }

    link(dir, tile) {
        this[dir] = tile;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getH() {
        return this.h;
    }

    setMapObject(mapObject) {
        this.mapObject = mapObject;
    }

    unsetMapObject() {
        this.mapObject = null;
    }

    getMapObject() {
        return this.mapObject;
    }

    getNeighbors(dist) {
        const dirs = ['left', 'right', 'top', 'down'];
        let queue = new Set([this]);
        let nextQueue;
        const results = new Set();
        for (let i = 0; i < dist; i++) {
            nextQueue = new Set();
            queue.forEach(tile => {
                dirs.forEach((dir) => {
                    if (tile[dir] !== null && tile[dir] !== this && tile[dir].movable()) {
                        if (!results.has(tile[dir])) {
                            results.add(tile[dir]);
                            nextQueue.add(tile[dir]);
                        }
                    }
                })
            });
            queue = nextQueue;
        }
        return results;
    }

    movable() {
        return true;
    }

    serialize() {
        return `${this.constructor.name()}-${this.h}`
    }

    static getClass(name) {
        return TILE_MAP[name];
    }

}

class PlainTile extends Tile {

    static name() {
        return 'p';
    }
}

class EmptyTile extends Tile {

    movable() {
        return false;
    }

    getNeighbors() {
        return new Set();
    }

    static name() {
        return 'e';
    }
}

const TILE_MAP = {
    p: PlainTile,
    e: EmptyTile,
};

export { Tile, EmptyTile, PlainTile };