import Viewport from '../../js/render/Viewport';
import Point from '../../js/render/Point';
import ProjectedPoint from '../../js/render/ProjectedPoint';

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
      const points = Point.createFromBuffer([
        0, 0, 100,
        0, 100, 100,
        100, 100, 100,
        100, 0, 100,
      ]);
      const projectedPoints = viewport.projectPoints(points);
      const expPoints = ProjectedPoint.createFromBuffer([
        25, 25, points[0],
        75, 25, points[1],
        75, 75, points[2],
        25, 75, points[3],
      ]);
      expect(ProjectedPoint.arrayEquals(projectedPoints, expPoints)).to.be.true;
    });

    it('should correctly project face with cuts', () => {
      const points = Point.createFromBuffer([
        10, 10, 100,
        10, 90, 100,
        10, 90, -100,
        10, 10, -100,
      ]);
      const projectedPoints = viewport.projectPoints(points);
      const expPoints = ProjectedPoint.createFromBuffer([
        30, 30, points[0],
        70, 30, points[1],
        90, 10, null,
        10, 10, null,
      ]);
      expect(ProjectedPoint.arrayEquals(projectedPoints, expPoints)).to.be.true;
    });

    it('should return no visiblePoints if face not visible', () => {
      const points = Point.createFromBuffer([
        0, 0, -100,
        0, 100, -100,
        100, 100, -100,
        100, 0, -100,
      ]);
      const projectedPoints = viewport.projectPoints(points);
      expect(projectedPoints).to.deep.equal([]);
    });
  });
});
