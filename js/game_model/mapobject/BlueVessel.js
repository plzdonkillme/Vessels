/* eslint-disable class-methods-use-this */

import Vessel from './Vessel';

class BlueVessel extends Vessel {
  constructor(props) {
    super(props);
    this.range = 2;
    this.shard = 'bs';
  }

  typeString() {
    return 'b';
  }
}

export default BlueVessel;
