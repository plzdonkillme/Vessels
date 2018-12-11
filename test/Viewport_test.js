import Viewport from '../js/Viewport';
import { Point } from '../js/Vector';
import Face from '../js/Face';

describe('Viewport', () => {
  describe('projectFace', () => {
    const viewport = new Viewport(
      new Point(0, 0, 0),
      new Point(0, 100, 0),
      new Point(100, 0, 0),
      new Point(100, 100, 0),
      100,
    );

    it('should correctly project face with no cuts', () => {
      const face = Face.createFromBuffer([
        0, 0, 100,
        0, 100, 100,
        100, 100, 100,
        100, 0, 100,
      ]);
      const { visiblePoints, mapping } = viewport.projectFace(face);
      const expPoints = Point.createFromBuffer([
        25, 25, 0,
        75, 25, 0,
        75, 75, 0,
        25, 75, 0,
      ]);
      expect(Point.arrayEquals(visiblePoints, expPoints)).to.be.true;
      expect(mapping).to.deep.equal([1, 2, 3, 4]);
    });

    it('should correctly project face with cuts', () => {
      const face = Face.createFromBuffer([
        0, 0, 100,
        0, 100, 100,
        100, 100, 100,
        100, 0, 100,
      ]);
      const { visiblePoints, mapping } = viewport.projectFace(face);
      const expPoints = Point.createFromBuffer([
        25, 25, 0,
        75, 25, 0,
        75, 75, 0,
        25, 75, 0,
      ]);
      expect(Point.arrayEquals(visiblePoints, expPoints)).to.be.true;
      expect(mapping).to.deep.equal([1, 2, 3, 4]);
    });

    it('should return no visiblePoints if face not visible', () => {
      const face = Face.createFromBuffer([
        0, 0, 100,
        0, 100, 100,
        100, 100, 100,
        100, 0, 100,
      ]);
      const { visiblePoints, mapping } = viewport.projectFace(face);
      const expPoints = Point.createFromBuffer([
        25, 25, 0,
        75, 25, 0,
        75, 75, 0,
        25, 75, 0,
      ]);
      expect(Point.arrayEquals(visiblePoints, expPoints)).to.be.true;
      expect(mapping).to.deep.equal([1, 2, 3, 4]);
    });
  });
});
