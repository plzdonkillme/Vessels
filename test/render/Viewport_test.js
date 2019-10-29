import Viewport from '../../js/render/Viewport';
import Point from '../../js/render/Point';
import Face from '../../js/render/Face';

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
      expect(mapping).to.deep.equal([0, 1, 2, 3]);
    });

    it('should correctly project face with cuts', () => {
      const face = Face.createFromBuffer([
        10, 10, 100,
        10, 90, 100,
        10, 90, -100,
        10, 10, -100,
      ]);
      const { visiblePoints, mapping } = viewport.projectFace(face);
      const expPoints = Point.createFromBuffer([
        30, 30, 0,
        70, 30, 0,
        90, 10, 0,
        10, 10, 0,
      ]);
      expect(Point.arrayEquals(visiblePoints, expPoints)).to.be.true;
      expect(mapping).to.deep.equal([0, 1, [1, 2], [3, 0]]);
    });

    it('should return no visiblePoints if face not visible', () => {
      const face = Face.createFromBuffer([
        0, 0, -100,
        0, 100, -100,
        100, 100, -100,
        100, 0, -100,
      ]);
      const { visiblePoints, mapping } = viewport.projectFace(face);
      expect(visiblePoints).to.deep.equal([]);
      expect(mapping).to.deep.equal([]);
    });
  });
});
