import { deserialize } from '../../js/game_model/GameMapSerializer';
import GameMap from '../../js/game_model/GameMap';

const state1String = `
p_1{w_0} p_2{w_0} p_3{w_1} 
p_2{bs } p_3{   } p_2{w_1} 
p_3{rs } p_1{   } p_1{   } 
p_1{ys }          p_1{   } 
p_1{   } p_1{   } p_1{   } 
===
{
  "objective": "elimination",
  "turnOrder": [
    "0",
    "1"
  ],
  "actionCounter": {
    "move": 1,
    "attack": 1,
    "transfer": 1
  }
}
`;
const moveActions = [{
  name: 'move',
  src: {
    x: 0, y: 0, h: 1, type: 'p', mapObject: { type: 'w', player: '0' },
  },
  dst: {
    x: 0, y: 1, h: 2, type: 'p', mapObject: { type: 'bs' },
  },
  path: [{
    x: 0, y: 0, h: 1, type: 'p', mapObject: { type: 'w', player: '0' },
  }, {
    x: 0, y: 1, h: 2, type: 'p', mapObject: { type: 'bs' },
  }],
}, {
  name: 'move',
  src: {
    x: 0, y: 0, h: 1, type: 'p', mapObject: { type: 'w', player: '0' },
  },
  dst: {
    x: 1, y: 1, h: 3, type: 'p',
  },
  path: [{
    x: 0, y: 0, h: 1, type: 'p', mapObject: { type: 'w', player: '0' },
  }, {
    x: 1, y: 0, h: 2, type: 'p', mapObject: { type: 'w', player: '0' },
  }, {
    x: 1, y: 1, h: 3, type: 'p',
  }],
}, {
  name: 'move',
  src: {
    x: 0, y: 0, h: 1, type: 'p', mapObject: { type: 'w', player: '0' },
  },
  dst: {
    x: 0, y: 2, h: 3, type: 'p', mapObject: { type: 'rs' },
  },
  path: [{
    x: 0, y: 0, h: 1, type: 'p', mapObject: { type: 'w', player: '0' },
  }, {
    x: 0, y: 1, h: 2, type: 'p', mapObject: { type: 'bs' },
  }, {
    x: 0, y: 2, h: 3, type: 'p', mapObject: { type: 'rs' },
  }],
}, {
  name: 'move',
  src: {
    x: 1, y: 0, h: 2, type: 'p', mapObject: { type: 'w', player: '0' },
  },
  dst: {
    x: 1, y: 1, h: 3, type: 'p',
  },
  path: [{
    x: 1, y: 0, h: 2, type: 'p', mapObject: { type: 'w', player: '0' },
  }, {
    x: 1, y: 1, h: 3, type: 'p',
  }],
}, {
  name: 'move',
  src: {
    x: 1, y: 0, h: 2, type: 'p', mapObject: { type: 'w', player: '0' },
  },
  dst: {
    x: 0, y: 1, h: 2, type: 'p', mapObject: { type: 'bs' },
  },
  path: [{
    x: 1, y: 0, h: 2, type: 'p', mapObject: { type: 'w', player: '0' },
  }, {
    x: 0, y: 0, h: 1, type: 'p', mapObject: { type: 'w', player: '0' },
  }, {
    x: 0, y: 1, h: 2, type: 'p', mapObject: { type: 'bs' },
  }],
}, {
  name: 'move',
  src: {
    x: 1, y: 0, h: 2, type: 'p', mapObject: { type: 'w', player: '0' },
  },
  dst: {
    x: 0, y: 2, h: 3, type: 'p', mapObject: { type: 'rs' },
  },
  path: [{
    x: 1, y: 0, h: 2, type: 'p', mapObject: { type: 'w', player: '0' },
  }, {
    x: 0, y: 0, h: 1, type: 'p', mapObject: { type: 'w', player: '0' },
  }, {
    x: 0, y: 1, h: 2, type: 'p', mapObject: { type: 'bs' },
  }, {
    x: 0, y: 2, h: 3, type: 'p', mapObject: { type: 'rs' },
  }],
}];
const transferActions = [];
const attackActions = [{
  name: 'attack',
  src: {
    x: 0, y: 0, h: 1, type: 'p', mapObject: { type: 'w', player: '0' },
  },
  dst: [{
    x: 1, y: 0, h: 2, type: 'p', mapObject: { type: 'w', player: '0' },
  }],
}, {
  name: 'attack',
  src: {
    x: 0, y: 0, h: 1, type: 'p', mapObject: { type: 'w', player: '0' },
  },
  dst: [{
    x: 0, y: 1, h: 2, type: 'p', mapObject: { type: 'bs' },
  }],
}, {
  name: 'attack',
  src: {
    x: 1, y: 0, h: 2, type: 'p', mapObject: { type: 'w', player: '0' },
  },
  dst: [{
    x: 0, y: 0, h: 1, type: 'p', mapObject: { type: 'w', player: '0' },
  }],
}, {
  name: 'attack',
  src: {
    x: 1, y: 0, h: 2, type: 'p', mapObject: { type: 'w', player: '0' },
  },
  dst: [{
    x: 2, y: 0, h: 3, type: 'p', mapObject: { type: 'w', player: '1' },
  }],
}];

describe('GameMap', () => {
  describe('constructor', () => {
    it('should properly construct', () => {
      const m = new GameMap(deserialize(state1String));
      expect(m).to.not.be.undefined;
    });
  });

  describe('serialize', () => {
    it('should properly serialize', () => {
      const m = new GameMap(deserialize(state1String));
      expect(m.serialize()).to.equal(state1String);
    });
  });

  describe('getMoveActions', () => {
    it('should return list of valid move actions', () => {
      const m = new GameMap(deserialize(state1String));
      expect(m.getMoveActions()).to.deep.equal(moveActions);
    });
  });

  describe('getTransferActions', () => {
    it('should return list of valid transfer actions', () => {
      const m = new GameMap(deserialize(state1String));
      expect(m.getTransferActions()).to.deep.equal(transferActions);
    });
  });

  describe('getAttackActions', () => {
    it('should return list of valid attack actions', () => {
      const m = new GameMap(deserialize(state1String));
      expect(m.getAttackActions()).to.deep.equal(attackActions);
    });
  });

  describe('getActions', () => {
    it('should return list of actions', () => {
      const m = new GameMap(deserialize(state1String));
      expect(m.getActions()).to.have.length(10);
    });

    it('should cache results', () => {
      const m = new GameMap(deserialize(state1String));
      const actions1 = m.getActions();
      const actions2 = m.getActions();
      expect(actions1).to.equal(actions2);
    });
  });

  describe('doAction and undoAction', () => {
    it('should properly do and undo end action', () => {
      const m = new GameMap(deserialize(state1String));
      m.doAction({
        name: 'move',
        src: {
          x: 0, y: 0, h: 1, type: 'p', mapObject: { type: 'w', player: '0' },
        },
        dst: {
          x: 0, y: 1, h: 2, type: 'p', mapObject: { type: 'bs' },
        },
        path: [{
          x: 0, y: 0, h: 1, type: 'p', mapObject: { type: 'w', player: '0' },
        }, {
          x: 0, y: 1, h: 2, type: 'p', mapObject: { type: 'bs' },
        }],
      });
      const endAction = {
        name: 'end',
        move: 0,
        transfer: 1,
        attack: 1,
      };
      m.doAction(endAction);
      expect(m.toJSON().state).to.deep.equal({
        objective: 'elimination',
        turnOrder: ['1', '0'],
        actionCounter: { move: 1, attack: 1, transfer: 1 },
      });
      m.undoAction(endAction);
      expect(m.toJSON().state).to.deep.equal({
        objective: 'elimination',
        turnOrder: ['0', '1'],
        actionCounter: { move: 0, attack: 1, transfer: 1 },
      });
    });

    it('should properly do and undo move action', () => {
      const m = new GameMap(deserialize(state1String));
      const moveAction = {
        name: 'move',
        src: {
          x: 0, y: 0, h: 1, type: 'p', mapObject: { type: 'w', player: '0' },
        },
        dst: {
          x: 1, y: 1, h: 3, type: 'p',
        },
        path: [{
          x: 0, y: 0, h: 1, type: 'p', mapObject: { type: 'w', player: '0' },
        }, {
          x: 1, y: 0, h: 2, type: 'p', mapObject: { type: 'w', player: '0' },
        }, {
          x: 1, y: 1, h: 3, type: 'p',
        }],
      };
      m.doAction(moveAction);
      expect(m.serialize()).to.equal(`
p_1{   } p_2{w_0} p_3{w_1} 
p_2{bs } p_3{w_0} p_2{w_1} 
p_3{rs } p_1{   } p_1{   } 
p_1{ys }          p_1{   } 
p_1{   } p_1{   } p_1{   } 
===
{
  "objective": "elimination",
  "turnOrder": [
    "0",
    "1"
  ],
  "actionCounter": {
    "move": 0,
    "attack": 1,
    "transfer": 1
  }
}
`);
      m.undoAction(moveAction);
      expect(m.serialize()).to.equal(`
p_1{w_0} p_2{w_0} p_3{w_1} 
p_2{bs } p_3{   } p_2{w_1} 
p_3{rs } p_1{   } p_1{   } 
p_1{ys }          p_1{   } 
p_1{   } p_1{   } p_1{   } 
===
{
  "objective": "elimination",
  "turnOrder": [
    "0",
    "1"
  ],
  "actionCounter": {
    "move": 1,
    "attack": 1,
    "transfer": 1
  }
}
`);
    });

    it('should properly do and undo move action 2', () => {
      const m = new GameMap(deserialize(state1String));
      const moveAction = {
        name: 'move',
        src: {
          x: 0, y: 0, h: 1, type: 'p', mapObject: { type: 'w', player: '0' },
        },
        dst: {
          x: 0, y: 1, h: 2, type: 'p', mapObject: { type: 'bs' },
        },
        path: [{
          x: 0, y: 0, h: 1, type: 'p', mapObject: { type: 'w', player: '0' },
        }, {
          x: 0, y: 1, h: 2, type: 'p', mapObject: { type: 'bs' },
        }],
      };
      m.doAction(moveAction);
      expect(m.serialize()).to.equal(`
p_1{   } p_2{w_0} p_3{w_1} 
p_2{b_0} p_3{   } p_2{w_1} 
p_3{rs } p_1{   } p_1{   } 
p_1{ys }          p_1{   } 
p_1{   } p_1{   } p_1{   } 
===
{
  "objective": "elimination",
  "turnOrder": [
    "0",
    "1"
  ],
  "actionCounter": {
    "move": 0,
    "attack": 1,
    "transfer": 1
  }
}
`);
      m.undoAction(moveAction);
      expect(m.serialize()).to.equal(`
p_1{w_0} p_2{w_0} p_3{w_1} 
p_2{bs } p_3{   } p_2{w_1} 
p_3{rs } p_1{   } p_1{   } 
p_1{ys }          p_1{   } 
p_1{   } p_1{   } p_1{   } 
===
{
  "objective": "elimination",
  "turnOrder": [
    "0",
    "1"
  ],
  "actionCounter": {
    "move": 1,
    "attack": 1,
    "transfer": 1
  }
}
`);
    });

    it('should properly do and undo transfer action', () => {
      const state = `
p_1{b_0} p_2{w_0} p_3{w_1} 
p_2{bs } p_3{   } p_2{w_1} 
p_3{rs } p_1{   } p_1{   } 
p_1{ys }          p_1{   } 
p_1{   } p_1{   } p_1{   } 
===
{
  "objective": "elimination",
  "turnOrder": [
    "0",
    "1"
  ],
  "actionCounter": {
    "move": 1,
    "attack": 1,
    "transfer": 1
  }
}
`;
      const m = new GameMap(deserialize(state));
      const transferAction = m.getActions().filter((action) => action.name === 'transfer')[0];
      m.doAction(transferAction);
      expect(m.serialize()).to.equal(`
p_1{w_0} p_2{b_0} p_3{w_1} 
p_2{bs } p_3{   } p_2{w_1} 
p_3{rs } p_1{   } p_1{   } 
p_1{ys }          p_1{   } 
p_1{   } p_1{   } p_1{   } 
===
{
  "objective": "elimination",
  "turnOrder": [
    "0",
    "1"
  ],
  "actionCounter": {
    "move": 1,
    "attack": 1,
    "transfer": 0
  }
}
`);
      m.undoAction(transferAction);
      expect(m.serialize()).to.equal(state);
    });

    it('should properly do and undo attack action', () => {
      const m = new GameMap(deserialize(state1String));
      const attackAction = {
        name: 'attack',
        src: {
          x: 0, y: 0, h: 1, type: 'p', mapObject: { type: 'w', player: '0' },
        },
        dst: [{
          x: 1, y: 0, h: 2, type: 'p', mapObject: { type: 'w', player: '0' },
        }],
      };
      m.doAction(attackAction);
      expect(m.serialize()).to.equal(`
p_1{w_0} p_2{   } p_3{w_1} 
p_2{bs } p_3{   } p_2{w_1} 
p_3{rs } p_1{   } p_1{   } 
p_1{ys }          p_1{   } 
p_1{   } p_1{   } p_1{   } 
===
{
  "objective": "elimination",
  "turnOrder": [
    "0",
    "1"
  ],
  "actionCounter": {
    "move": 1,
    "attack": 0,
    "transfer": 1
  }
}
`);
      m.undoAction(attackAction);
      expect(m.serialize()).to.equal(`
p_1{w_0} p_2{w_0} p_3{w_1} 
p_2{bs } p_3{   } p_2{w_1} 
p_3{rs } p_1{   } p_1{   } 
p_1{ys }          p_1{   } 
p_1{   } p_1{   } p_1{   } 
===
{
  "objective": "elimination",
  "turnOrder": [
    "0",
    "1"
  ],
  "actionCounter": {
    "move": 1,
    "attack": 1,
    "transfer": 1
  }
}
`);
    });

    it('should properly undo multiple actions', () => {
      const m = new GameMap(deserialize(state1String));
      const moveAction = m.getActions()[2];
      m.doAction(moveAction);
      const attackAction = m.getActions()[1];
      m.doAction(attackAction);
      m.undoAction(attackAction);
      m.undoAction(moveAction);
      expect(m.serialize()).to.equal(state1String);
    });
  });

  describe('getWinners: elimination', () => {
    it('should return null if no winners', () => {
      const m = new GameMap(deserialize(state1String));
      expect(m.getWinners()).to.equal(null);
    });

    it('should return correct winner', () => {
      const state = `
p_1{w_0} p_2{w_0} p_3{   } 
p_2{bs } p_3{   } p_2{   } 
p_3{rs } p_1{   } p_1{   } 
p_1{ys }          p_1{   } 
p_1{   } p_1{   } p_1{   } 
===
{
  "objective": "elimination",
  "turnOrder": [
    "0",
    "1"
  ],
  "actionCounter": {
    "move": 1,
    "attack": 1,
    "transfer": 1
  }
}
`;
      const m = new GameMap(deserialize(state));
      expect(m.getWinners()).to.equal('0');
    });
  });
});
