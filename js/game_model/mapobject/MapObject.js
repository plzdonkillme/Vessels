class MapObject {
  constructor() {
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

  static typeString() {
    throw Error('Unimplemented');
  }
}

export default MapObject;
