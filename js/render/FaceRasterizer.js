import BSPTree from './BSPTree';
import RasterizedFace from './RasterizedFace';
import Edge from './Edge';

class FaceRasterizer {
  constructor(staticFaces = []) {
    if (staticFaces.length === 0) {
      this.bsp = null;
    } else {
      this.bsp = new BSPTree();
      this.bsp.addFaces(staticFaces);
    }
  }

  rasterize(viewport, faces) {
    const rasterFaces = [];
    if (this.bsp === null) {
      this.bsp = new BSPTree();
      this.bsp.addFaces(faces);
    } else {
      this.bsp.addFaces(faces);
    }
    this.bsp.traverse((node) => {
      const projectedPoints = viewport.projectPoints(node.getPoints());
      if (projectedPoints.length > 0) {
        const projectedEdges = [];
        for (let i = 0; i < projectedPoints.length; i += 1) {
          const j = i === projectedPoints.length - 1 ? 0 : i + 1;
          const origP1 = projectedPoints[i].getOrigPoint();
          const origP2 = projectedPoints[j].getOrigPoint();
          const origEdge = new Edge(origP1, origP2);
          if (node.isParentEdge(origEdge)) {
            const projectedEdge = new Edge(projectedPoints[i], projectedPoints[j]);
            projectedEdges.push(projectedEdge);
          }
        }
        const rasterFace = new RasterizedFace(projectedPoints, projectedEdges, node.getFace());
        rasterFaces.push(rasterFace);
      }
    }, viewport.getPoint());
    this.bsp = BSPTree.removeFaces(this.bsp, faces);
    return rasterFaces;
  }
}

export default FaceRasterizer;
