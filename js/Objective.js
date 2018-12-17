const EliminationObjective = {
  check(map) {
    const players = map.getMapObjects().map(m => m.getPlayer()).filter(p => p !== null);
    const player = players.filter(p => p === '0');
    const enemies = players.filter(p => p !== '0');
    return player.length === 0 || enemies.length === 0;
  },

  success(map) {
    const players = map.getMapObjects().map(m => m.getPlayer());
    const enemies = players.filter(p => p !== '0' && p !== null);
    return enemies.length === 0;
  },

  toJSON() {
    return 'elimination';
  },
};


const ObjectiveFactory = {
  map: {
    elimination: EliminationObjective,
  },
  create(json) {
    return this.map[json];
  },
};

export default ObjectiveFactory;
