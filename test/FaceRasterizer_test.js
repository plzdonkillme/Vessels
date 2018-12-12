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

    it('should correctly rasterize static face', () => {
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

    it('should correctly rasterize dynamic faces', () => {
      const face1 = Face.createFromBuffer([
        0, 0, 100,
        0, 100, 100,
        100, 100, 100,
        100, 0, 100,
      ]);
      const face2 = Face.createFromBuffer([
        25, 0, 150,
        25, 100, 150,
        25, 100, 50,
        25, 0, 50,
      ]);
      const rasterizer = new FaceRasterizer([face1]);
      const rasterFaces = rasterizer.rasterize(viewport, [face2]);
      expect(rasterFaces).to.have.lengthOf(3);
      const [rasterFace1, rasterFace2, rasterFace3] = rasterFaces;

      expect(rasterFace1.getFace()).to.equal(face2);
      const visiblePoints1 = rasterFace1.getPoints();
      const expPoints1 = Point.createFromBuffer([
        25, 37.5, 0,
        30, 40, 0,
        70, 40, 0,
        75, 37.5, 0,
      ]);
      expect(Point.arrayEquals(visiblePoints1, expPoints1)).to.be.true;
      expect(rasterFace1.getEdges()).to.deep.equal([[0, 1], [1, 2], [2, 3]]);

      expect(rasterFace2.getFace()).to.equal(face1);
      const visiblePoints2 = rasterFace2.getPoints();
      const expPoints2 = Point.createFromBuffer([
        25, 25, 0,
        75, 25, 0,
        75, 75, 0,
        25, 75, 0,
      ]);
      expect(Point.arrayEquals(visiblePoints2, expPoints2)).to.be.true;
      expect(rasterFace2.getEdges()).to.deep.equal([[0, 1], [1, 2], [2, 3], [3, 0]]);

      expect(rasterFace3.getFace()).to.equal(face2);
      const visiblePoints3 = rasterFace3.getPoints();
      const expPoints3 = Point.createFromBuffer([
        25, 37.5, 0,
        75, 37.5, 0,
        83.333, 33.333, 0,
        16.666, 33.333, 0,
      ]);
      expect(Point.arrayEquals(visiblePoints3, expPoints3, false)).to.be.true;
      expect(rasterFace3.getEdges()).to.deep.equal([[1, 2], [2, 3], [3, 0]]);
    });
  });
  describe('getMappedParentEdges', () => {
    it('should correctly get mapped parent edges 1', () => {
      expect(FaceRasterizer.getMappedParentEdges(
        [0, 1, 2, 3],
        [[0, 1], [1, 2], [2, 3], [0, 3]],
      )).to.deep.equal([[0, 1], [1, 2], [2, 3], [3, 0]]);
    });

    it('should correctly get mapped parent edges 2', () => {
      expect(FaceRasterizer.getMappedParentEdges(
        [0, [0, 1], [1, 2], 2, 3],
        [[0, 1], [1, 2], [2, 3]],
      )).to.deep.equal([[0, 1], [2, 3], [3, 4]]);
    });
  });
});
