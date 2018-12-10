import BSPTree from './BSPTree';

class FaceRasterizer {
  constructor(staticFaces = []) {
    this.bsp = new BSPTree(staticFaces);
  }

  rasterize(viewport, faces) {
    const rasterFaces = [];
    this.bsp.addFaces(faces);
    this.bsp.traverse((face, parentFace) => {
      const parentEdges = face.findParentEdges(parentFace);
      const { visiblePoints, mapping } = viewport.projectFace(face);
      const rasterFace = new RasterFace(visiblePoints);
    }, viewport.getNormal());
    this.bsp = BSPTree.removeFaces(this.bsp, faces);

    return rasterFaces;
  }
}

export default FaceRasterizer;
