/* eslint-disable class-methods-use-this */

import Shard from './Shard';

class RedShard extends Shard {
  typeString() {
    return 'rs';
  }
}

export default RedShard;
