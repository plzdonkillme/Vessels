import { serialize, deserialize } from '../js/GameMapSerializer';

const state1String = `
p_1{   } p_2{   }
p_1{w_0} e_1{   }
===
{
  "foo": "bar"
}
`;
const state1JSON = {
  tiles: [
    [
      {
        type: 'p',
        x: 0,
        y: 0,
        h: 1,
      },
      {
        type: 'p',
        x: 1,
        y: 0,
        h: 2,
      },
    ],
    [
      {
        type: 'p',
        x: 0,
        y: 1,
        h: 1,
        mapObject: {
          player: '0',
          type: 'w',
          x: 0,
          y: 1,
        },
      },
      {
        type: 'e',
        x: 1,
        y: 1,
        h: 1,
      },
    ],
  ],
  state: {
    foo: 'bar',
  },
};
const state2String = `
p_1{w_0} p_2{w_0} p_3{w_1}
p_2{bs } p_3{   } p_2{w_1}
p_3{rs } p_1{   } p_1{   }
p_1{ys } e_1{   } p_1{   }
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
const state2JSON = {
  tiles: [[{
    x: 0,
    y: 0,
    h: 1,
    type: 'p',
    mapObject: {
      type: 'w', x: 0, y: 0, player: '0',
    },
  }, {
    x: 1,
    y: 0,
    h: 2,
    type: 'p',
    mapObject: {
      type: 'w', x: 1, y: 0, player: '0',
    },
  }, {
    x: 2,
    y: 0,
    h: 3,
    type: 'p',
    mapObject: {
      type: 'w', x: 2, y: 0, player: '1',
    },
  }], [{
    x: 0, y: 1, h: 2, type: 'p', mapObject: { type: 'bs', x: 0, y: 1 },
  }, {
    x: 1, y: 1, h: 3, type: 'p',
  }, {
    x: 2,
    y: 1,
    h: 2,
    type: 'p',
    mapObject: {
      type: 'w', x: 2, y: 1, player: '1',
    },
  }], [{
    x: 0, y: 2, h: 3, type: 'p', mapObject: { type: 'rs', x: 0, y: 2 },
  }, {
    x: 1, y: 2, h: 1, type: 'p',
  }, {
    x: 2, y: 2, h: 1, type: 'p',
  }], [{
    x: 0, y: 3, h: 1, type: 'p', mapObject: { type: 'ys', x: 0, y: 3 },
  }, {
    x: 1, y: 3, h: 1, type: 'e',
  }, {
    x: 2, y: 3, h: 1, type: 'p',
  }], [{
    x: 0, y: 4, h: 1, type: 'p',
  }, {
    x: 1, y: 4, h: 1, type: 'p',
  }, {
    x: 2, y: 4, h: 1, type: 'p',
  }]],
  state: { objective: 'elimination', turnOrder: ['0', '1'], actionCounter: { move: 1, attack: 1, transfer: 1 } },
};

describe('GameMapSerializer', () => {
  describe('deserialize', () => {
    it('should properly deserialize state1', () => {
      expect(deserialize(state1String)).to.deep.equal(state1JSON);
    });

    it('should properly deserialize state2', () => {
      expect(deserialize(state2String)).to.deep.equal(state2JSON);
    });
  });
  describe('serialize', () => {
    it('should properly serialize state1', () => {
      expect(serialize(state1JSON)).to.equal(state1String);
    });

    it('should properly serialize state2', () => {
      expect(serialize(state2JSON)).to.deep.equal(state2String);
    });
  });
});
