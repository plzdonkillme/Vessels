import FaceRasterizer from '../js/FaceRasterizer';
import Viewport from '../js/Viewport';
import Face from '../js/Face';
import { Point } from '../js/Vector';

describe('FaceRasterizer', () => {
  describe('rasterize', () => {
    const viewport = new Viewport(
      new Point(0, 0, 0),
      new Point(0, 100, 0),
      new Point(100, 0, 0),
      new Point(100, 100, 0),
      100,
    );

    it('should correctly rasterize static edges', () => {
      const face = Face.createFromBuffer([
        0, 0, 100,
        0, 100, 100,
        100, 100, 100,
        100, 0, 100,
      ]);
      const rasterizer = new FaceRasterizer([face]);
      const rasterFaces = rasterizer.rasterize(viewport, []);
      expect(rasterFaces).to.have.lengthOf(1);
      const [rasterFace] = rasterFaces;
      expect(rasterFace.getFace()).to.equal(face);
      const visiblePoints = rasterFace.getPoints();
      const expPoints = Point.createFromBuffer([
        25, 25, 0,
        75, 25, 0,
        75, 75, 0,
        25, 75, 0,
      ]);
      expect(Point.arrayEquals(visiblePoints, expPoints)).to.be.true;
      expect(rasterFace.getEdges()).to.deep.equal([[0, 1], [1, 2], [2, 3], [3, 0]]);
    });
  });
});
