import { serialize, deserialize } from '../js/GameMapSerializer';

const state1String = `
p_1{   } p_2{   } 
p_1{w_0}          
===
{
  "foo": "bar"
}
`;
const state1JSON = {
  tiles: [{
    type: 'p', h: 1, x: 0, y: 0,
  }, {
    type: 'p', h: 2, x: 1, y: 0,
  }, {
    type: 'p', h: 1, x: 0, y: 1, mapObject: { type: 'w', player: '0' },
  }],
  state: { foo: 'bar' },
};
const state2String = `
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
const state2JSON = {
  tiles: [{
    type: 'p', h: 1, x: 0, y: 0, mapObject: { type: 'w', player: '0' },
  }, {
    type: 'p', h: 2, x: 1, y: 0, mapObject: { type: 'w', player: '0' },
  }, {
    type: 'p', h: 3, x: 2, y: 0, mapObject: { type: 'w', player: '1' },
  }, {
    type: 'p', h: 2, x: 0, y: 1, mapObject: { type: 'bs' },
  }, {
    type: 'p', h: 3, x: 1, y: 1,
  }, {
    type: 'p', h: 2, x: 2, y: 1, mapObject: { type: 'w', player: '1' },
  }, {
    type: 'p', h: 3, x: 0, y: 2, mapObject: { type: 'rs' },
  }, {
    type: 'p', h: 1, x: 1, y: 2,
  }, {
    type: 'p', h: 1, x: 2, y: 2,
  }, {
    type: 'p', h: 1, x: 0, y: 3, mapObject: { type: 'ys' },
  }, {
    type: 'p', h: 1, x: 2, y: 3,
  }, {
    type: 'p', h: 1, x: 0, y: 4,
  }, {
    type: 'p', h: 1, x: 1, y: 4,
  }, {
    type: 'p', h: 1, x: 2, y: 4,
  }],
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
