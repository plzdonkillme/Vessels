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

    serialize() {
        return `${this.constructor.name()}-${this.h}`
    }

    static getClass(name) {
        return TILE_MAP[name];
    }

    getKey() {
        return `${this.constructor.name()}-${this.x}-${this.y}`
    }

}

class PlainTile extends Tile {

    static name() {
        return 'p';
    }
}

class EmptyTile extends Tile {

    static name() {
        return 'e';
    }
}

const TILE_MAP = {
    p: PlainTile,
    e: EmptyTile,
};

export { Tile, EmptyTile, PlainTile };