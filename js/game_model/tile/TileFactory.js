import PlainTile from './PlainTile';

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

export default TileFactory;
