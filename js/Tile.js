/* eslint-disable class-methods-use-this */

class Tile {
  constructor(props) {
    this.x = props.x;
    this.y = props.y;
    this.h = props.h;
    this.neighbors = [];
    this.mapObject = null;
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

  getMapObject() {
    return this.mapObject;
  }

  addNeighbor(tile) {
    this.neighbors.push(tile);
  }

  removeNeighbor(tile) {
    const idx = this.neighbors.indexOf(tile);
    if (idx === -1) {
      throw Error('Tried to remove nonexistant neighbor tile');
    }
    this.neighbors.splice(idx, 1);
  }

  getNeighbors() {
    return this.neighbors;
  }

  toJSON() {
    const json = {
      x: this.x,
      y: this.y,
      h: this.h,
      type: this.typeString(),
    };
    if (this.mapObject !== null) {
      json.mapObject = this.mapObject.toJSON();
    }
    return json;
  }

  typeString() {
    throw Error('Unimplemented');
  }
}

class PlainTile extends Tile {
  typeString() {
    return 'p';
  }
}

const TileFactory = {
  map: {
    p: PlainTile,
  },
  create(json) {
    const TileClass = this.map[json.type];
    return new TileClass(json);
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
  getPropStringWidth() {
    return 3;
  },
};

export {
  Tile,
  TileFactory,
  PlainTile,
};
