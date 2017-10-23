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

    getPaths(dist) {
        const dirs = ['left', 'right', 'top', 'down'];
        let queue = new Set([this]);
        let nextQueue;
        const paths = {};
        const thisKey = `${this.getX()}-${this.getY()}`;
        paths[thisKey] = [thisKey];
        for (let i = 0; i < dist; i++) {
            nextQueue = new Set();
            queue.forEach(tile => {
                const key = `${tile.getX()}-${tile.getY()}`;
                dirs.forEach((dir) => {
                    const t = tile[dir];
                    if (t !== null && t !== this && t.movable() && Math.abs(t.getH() - tile.getH()) < 2) {
                        const tkey = `${t.getX()}-${t.getY()}`;
                        if (paths[tkey] === undefined) {
                            nextQueue.add(t);
                            paths[tkey] = paths[key].concat(tkey);
                        }
                    }
                })
            });
            queue = nextQueue;
        }
        delete paths[thisKey];
        return paths;
    }

    movable() {
        if (this.mapObject !== null) {
            return this.mapObject.moveable();
        }
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