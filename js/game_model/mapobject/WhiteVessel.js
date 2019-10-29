/* eslint-disable class-methods-use-this */

import Vessel from './Vessel';

class WhiteVessel extends Vessel {
  typeString() {
    return 'w';
  }
}

export default WhiteVessel;
