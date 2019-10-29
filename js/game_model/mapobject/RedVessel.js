/* eslint-disable class-methods-use-this */

import Vessel from './Vessel';

class RedVessel extends Vessel {
  constructor(props) {
    super(props);
    this.shard = 'rs';
  }

  typeString() {
    return 'r';
  }

  getAttackableTargets() {
    const targetTiles = new Set(this.tile.getNeighbors());
    let hasTarget = false;
    targetTiles.forEach((n1) => {
      hasTarget = hasTarget || n1.getMapObject() !== null;
      n1.getNeighbors().forEach((n2) => {
        if (n2 !== this.tile
          && Math.abs(n2.getX() - this.tile.getX()) === 1
          && Math.abs(n2.getY() - this.tile.getY()) === 1
        ) {
          hasTarget = hasTarget || n1.getMapObject() !== null;
          targetTiles.add(n2);
        }
      });
    });
    if (hasTarget) {
      return [Array.from(targetTiles)];
    }
    return [];
  }
}

export default RedVessel;
