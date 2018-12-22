import { deserialize } from '../js/GameMapSerializer';
import GameMap from '../js/GameMap';

describe('GameMap', () => {
  describe('constructor', () => {
    it('should properly construct', () => {
      const str = `
        p_1{w_0} p_2{w_0} p_3{w_1}
        p_2{bs } p_3{   } p_2{w_1}
        p_3{rs } p_1{   } p_1{   }
        p_1{ys } e_1{   } p_1{   }
        p_1{   } p_1{   } p_1{   }
        ===
        {
          "turnOrder": ["0", "1"],
          "actionCounter": {
            "move": 1,
            "attack": 1,
            "transfer": 1
          },
          "objective": "elimination"
        }
      `;
      const m = new GameMap(deserialize(str));
      const expected = {
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
      expect(m.toJSON()).to.deep.equal(expected);
    });
  });
});
