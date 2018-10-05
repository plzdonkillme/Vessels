import BSPTree from '../js/BSPTree';
import { Point, Vector } from '../js/Vector';
import Face from '../js/Face';

describe('BSPTree', () => {
  describe('sortPoints', () => {
    const p0 = new Point(0, 0, 0);
    const n = new Vector(0, 0, 1);

    it('should properly sort points on the same plane', () => {
      const points = Point.createFromBuffer([
        1, 1, 0,
        1, -1, 0,
        -1, -1, 0,
        -1, 1, 0,
      ]);
      const expFrontPoints = Point.createFromBuffer([
        1, 1, 0,
        1, -1, 0,
        -1, -1, 0,
        -1, 1, 0,
      ]);
      const expBackPoints = Point.createFromBuffer([
        1, 1, 0,
        1, -1, 0,
        -1, -1, 0,
        -1, 1, 0,
      ]);
      const { frontPoints, backPoints } = BSPTree.sortPoints(points, p0, n);
      expect(Point.arrayEquals(frontPoints, expFrontPoints)).to.be.true;
      expect(Point.arrayEquals(backPoints, expBackPoints)).to.be.true;
    });

    it('should properly sort points in front', () => {
      const points = Point.createFromBuffer([
        1, 1, 1,
        1, -1, 1,
        -1, -1, 1,
        -1, 1, 1,
      ]);
      const expFrontPoints = Point.createFromBuffer([
        1, 1, 1,
        1, -1, 1,
        -1, -1, 1,
        -1, 1, 1,
      ]);
      const expBackPoints = Point.createFromBuffer([]);
      const { frontPoints, backPoints } = BSPTree.sortPoints(points, p0, n);
      expect(Point.arrayEquals(frontPoints, expFrontPoints)).to.be.true;
      expect(Point.arrayEquals(backPoints, expBackPoints)).to.be.true;
    });

    it('should properly sort points in back', () => {
      const points = Point.createFromBuffer([
        1, 1, -1,
        1, -1, -1,
        -1, -1, -1,
        -1, 1, -1,
      ]);
      const expFrontPoints = Point.createFromBuffer([]);
      const expBackPoints = Point.createFromBuffer([
        1, 1, -1,
        1, -1, -1,
        -1, -1, -1,
        -1, 1, -1,
      ]);
      const { frontPoints, backPoints } = BSPTree.sortPoints(points, p0, n);
      expect(Point.arrayEquals(frontPoints, expFrontPoints)).to.be.true;
      expect(Point.arrayEquals(backPoints, expBackPoints)).to.be.true;
    });

    it('should properly sort points in front, mid, and back', () => {
      const points = Point.createFromBuffer([
        1, 1, -1,
        1, 0, 0,
        1, 1, 1,
      ]);
      const expFrontPoints = Point.createFromBuffer([
        1, 1, 0,
        1, 0, 0,
        1, 1, 1,
      ]);
      const expBackPoints = Point.createFromBuffer([
        1, 1, 0,
        1, 1, -1,
        1, 0, 0,
      ]);
      const { frontPoints, backPoints } = BSPTree.sortPoints(points, p0, n);
      expect(Point.arrayEquals(frontPoints, expFrontPoints)).to.be.true;
      expect(Point.arrayEquals(backPoints, expBackPoints)).to.be.true;
    });
  });

  describe('sortFaces', () => {
    const p0 = new Point(0, 0, 0);
    const n = new Vector(0, 0, 1);

    it('should properly sort faces on same plane', () => {

    });
  });
});
