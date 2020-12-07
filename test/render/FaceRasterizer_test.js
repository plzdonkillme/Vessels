import FaceRasterizer from '../../js/render/FaceRasterizer';
import Viewport from '../../js/render/Viewport';
import Face from '../../js/render/Face';
import Point from '../../js/render/Point';
import ProjectedPoint from '../../js/render/ProjectedPoint';
import Edge from '../../js/render/Edge';

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
      const projectedPoints = rasterFace.getPoints();
      const expPoints = ProjectedPoint.createFromBuffer([
        25, 25, face.getPoints()[0],
        75, 25, face.getPoints()[1],
        75, 75, face.getPoints()[2],
        25, 75, face.getPoints()[3],
      ]);
      expect(ProjectedPoint.arrayEquals(projectedPoints, expPoints)).to.be.true;
      const projectedEdges = rasterFace.getEdges();
      const expEdges = Edge.createFromBuffer([
        expPoints[0], expPoints[1],
        expPoints[1], expPoints[2],
        expPoints[2], expPoints[3],
        expPoints[3], expPoints[0],
      ]);
      expect(Edge.arrayEquals(projectedEdges, expEdges)).to.be.true;
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
      const projectedPoints1 = rasterFace1.getPoints();
      const expPoints1 = ProjectedPoint.createFromBuffer([
        25, 37.5, new Point(25, 0, 100),
        30, 40, new Point(25, 0, 150),
        70, 40, new Point(25, 100, 150),
        75, 37.5, new Point(25, 100, 100),
      ]);
      expect(ProjectedPoint.arrayEquals(projectedPoints1, expPoints1)).to.be.true;
      const projectedEdges1 = rasterFace1.getEdges();
      const expEdges1 = Edge.createFromBuffer([
        expPoints1[0], expPoints1[1],
        expPoints1[1], expPoints1[2],
        expPoints1[2], expPoints1[3],
      ]);
      expect(Edge.arrayEquals(projectedEdges1, expEdges1)).to.be.true;

      expect(rasterFace2.getFace()).to.equal(face1);
      const projectedPoints2 = rasterFace2.getPoints();
      const expPoints2 = ProjectedPoint.createFromBuffer([
        25, 25, new Point(0, 0, 100),
        75, 25, new Point(0, 100, 100),
        75, 75, new Point(100, 100, 100),
        25, 75, new Point(100, 0, 100),
      ]);
      expect(ProjectedPoint.arrayEquals(projectedPoints2, expPoints2)).to.be.true;
      const projectedEdges2 = rasterFace2.getEdges();
      const expEdges2 = Edge.createFromBuffer([
        expPoints2[0], expPoints2[1],
        expPoints2[1], expPoints2[2],
        expPoints2[2], expPoints2[3],
        expPoints2[3], expPoints2[0],
      ]);
      expect(Edge.arrayEquals(projectedEdges2, expEdges2)).to.be.true;

      expect(rasterFace3.getFace()).to.equal(face2);
      const projectedPoints3 = rasterFace3.getPoints();
      const expPoints3 = ProjectedPoint.createFromBuffer([
        25, 37.5, new Point(25, 0, 100),
        75, 37.5, new Point(25, 100, 100),
        83.333, 33.333, new Point(25, 100, 50),
        16.666, 33.333, new Point(25, 0, 50),
      ]);
      expect(ProjectedPoint.arrayEquals(projectedPoints3, expPoints3, false)).to.be.true;
      // expect(rasterFace3.getEdges()).to.deep.equal([[1, 2], [2, 3], [3, 0]]);
      const projectedEdges3 = rasterFace3.getEdges();
      const expEdges3 = Edge.createFromBuffer([
        expPoints3[1], expPoints3[2],
        expPoints3[2], expPoints3[3],
        expPoints3[3], expPoints3[0],
      ]);
      expect(Edge.arrayEquals(projectedEdges3, expEdges3, false)).to.be.true;
    });
  });
});
