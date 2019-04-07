import GameMapRenderer from '../js/GameMapRenderer';
import { Point } from '../js/render/Vector';

const mockCanvas = {};

describe('GameMapRenderer', () => {
  describe('mouseInside', () => {
    it('should detect mouse inside', () => {
      const gameMapRenderer = new GameMapRenderer(mockCanvas);
      gameMapRenderer.setMouse(1, 1);
      const points = Point.createFromBuffer([
        0, 0, 0,
        2, 0, 0,
        2, 2, 0,
        0, 2, 0,
      ]);
      expect(gameMapRenderer.mouseInside(points)).to.be.true;
    });

    it('should detect mouse outside', () => {
      const gameMapRenderer = new GameMapRenderer(mockCanvas);
      gameMapRenderer.setMouse(3, 1);
      const points = Point.createFromBuffer([
        0, 0, 0,
        2, 0, 0,
        2, 2, 0,
        0, 2, 0,
      ]);
      expect(gameMapRenderer.mouseInside(points)).to.be.false;
    });
  });
});
