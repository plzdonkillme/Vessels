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

    getKey() {
        return `${this.constructor.name()}-${this.x}-${this.y}`
    }

    toJSON() {
        const json = {
            x: this.x,
            y: this.y,
            h: this.h,
            type: this.constructor.name(),
            key: this.getKey(),
        }
        if (this.mapObject !== null) {
            json.mapObject = this.mapObject.toJSON();
        }
        return json;
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

class TileGroup {
    constructor(tiles) {
        this.tiles = tiles;
    }

    getMapObjects() {
        return this.tiles.map(t => t.getMapObject()).filter(m => m !== null);
    }

    getTiles() {
        return this.tiles;
    }
}

const TileFactory = {
    map: {
        p: PlainTile,
        e: EmptyTile,
    },
    create: function(json) {
        const cls = this.map[json.type];
        return new cls(json.x, json.y, json.h);
    },
    getJSON: function(propString) {
        const props = propString.split('-');
        return {
            type: props[0],
            h: parseInt(props[1]),
        };
    },
    getPropString: function(json) {
        return `${json.type}-${json.h}`;
    }
};

export { Tile, EmptyTile, PlainTile, TileGroup, TileFactory };