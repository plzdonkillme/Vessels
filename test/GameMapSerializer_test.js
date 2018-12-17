import { serialize, deserialize } from '../js/GameMapSerializer';

describe('GameMapSerializer', () => {
  describe('deserialize', () => {
    it('should properly deserialize state', () => {
      const str = `
        p_1{   } p_2{   }
        p_1{w_0} e_1{   }
        ===
        {
          "foo": "bar"
        }
      `;
      expect(deserialize(str)).to.deep.equal({
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
      });
    });
  });
  describe('serialize', () => {
    it('should properly serialize state', () => {
      const state = {
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
      expect(serialize(state)).to.equal('p_1{   } p_2{   }\np_1{w_0} e_1{   }\n===\n{\n  "foo": "bar"\n}');
    });
  });
});
