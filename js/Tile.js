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

  toJSON() {
    const json = {
      x: this.x,
      y: this.y,
      h: this.h,
      type: this.constructor.name(),
    };
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

const TileFactory = {
  map: {
    p: PlainTile,
    e: EmptyTile,
  },
  create(json) {
    const TileClass = this.map[json.type];
    return new TileClass(json.x, json.y, json.h);
  },
  getJSON(propString) {
    const props = propString.split('_');
    return {
      type: props[0],
      h: parseInt(props[1], 10),
    };
  },
  getPropString(json) {
    return `${json.type}_${json.h}`;
  },
};

export {
  Tile,
  TileFactory,
  EmptyTile,
  PlainTile,
};
