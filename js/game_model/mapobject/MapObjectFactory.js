/* eslint-disable no-unused-vars */

import Shard from './Shard';
import Vessel from './Vessel';
import BlueShard from './BlueShard';
import YellowShard from './YellowShard';
import RedShard from './RedShard';
import WhiteVessel from './WhiteVessel';
import BlueVessel from './BlueVessel';
import RedVessel from './RedVessel';
import YellowVessel from './YellowVessel';

const MapObjectFactory = {
  map: {
    bs: BlueShard,
    rs: RedShard,
    ys: YellowShard,
    w: WhiteVessel,
    b: BlueVessel,
    r: RedVessel,
    y: YellowVessel,
  },
  create(json) {
    const MapObjectClass = this.map[json.type];
    return new MapObjectClass(json);
  },
  getJSON(propString) {
    const props = propString.trim().split('_');
    const json = {
      type: props[0],
    };
    if (props.length > 1) {
      json.player = props[1]; // eslint-disable-line prefer-destructuring
    }
    return json;
  },
  getPropString(json) {
    let propString = json.type;
    if (json.player !== undefined) {
      propString = `${propString}_${json.player}`;
    }
    const padding = ' '.repeat(3 - propString.length);
    return `${propString}${padding}`;
  },
  getPropStringWidth() {
    return 3;
  },
  merge(obj1, obj2) {
    if (obj1 instanceof Vessel && obj2 instanceof Shard) {
      if (obj2 instanceof BlueShard) {
        return new BlueVessel({ player: obj1.getPlayer() });
      }
      if (obj2 instanceof RedShard) {
        return new RedVessel({ player: obj1.getPlayer() });
      }
      if (obj2 instanceof YellowShard) {
        return new YellowVessel({ player: obj1.getPlayer() });
      }
    }
    throw Error('Objects do not support merge');
  },
  transfer(obj1, obj2) {
    return {
      newSrcObj: obj2,
      newDstObj: obj1,
    };
  },
  attack(obj1, obj2) {
    return null;
  },
};

export default MapObjectFactory;
