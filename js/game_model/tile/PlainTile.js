/* eslint-disable class-methods-use-this */

import Tile from './Tile';

class PlainTile extends Tile {
  typeString() {
    return 'p';
  }
}

export default PlainTile;
