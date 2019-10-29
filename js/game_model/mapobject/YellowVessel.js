/* eslint-disable class-methods-use-this */

import Vessel from './Vessel';

class YellowVessel extends Vessel {
  constructor(props) {
    super(props);
    this.shard = 'ys';
    this.movement = 5;
  }

  typeString() {
    return 'y';
  }
}

export default YellowVessel;
