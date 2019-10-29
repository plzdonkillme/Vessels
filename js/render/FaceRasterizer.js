import BSPTree from './BSPTree';
import RasterizedFace from './RasterizedFace';

class FaceRasterizer {
  constructor(staticFaces = []) {
    if (staticFaces.length === 0) {
      this.bsp = null;
    } else {
      this.bsp = new BSPTree(staticFaces);
    }
  }

  rasterize(viewport, faces) {
    const rasterFaces = [];
    if (this.bsp === null) {
      this.bsp = new BSPTree(faces);
    } else {
      this.bsp.addFaces(faces);
    }
    this.bsp.traverse((face, parentFace) => {
      const parentEdges = face.findParentEdges(parentFace);
      const { visiblePoints, mapping } = viewport.projectFace(face);
      if (visiblePoints.length > 0) {
        const mappedParentEdges = FaceRasterizer.getMappedParentEdges(mapping, parentEdges);
        const rasterFace = new RasterizedFace(visiblePoints, mappedParentEdges, parentFace);
        rasterFaces.push(rasterFace);
      }
    }, viewport.getPoint());
    this.bsp = BSPTree.removeFaces(this.bsp, faces);
    return rasterFaces;
  }

  static getMappedParentEdges(mapping, parentEdges) {
    const edges = [];
    for (let i = 0; i < mapping.length; i += 1) {
      const j = i === mapping.length - 1 ? 0 : i + 1;
      let m = mapping[i];
      let nm = mapping[j];
      if (Array.isArray(m) && Array.isArray(nm)) {
        // edges.push([i, j]);    uncomment to draw clipped edges
        continue; // eslint-disable-line no-continue
      }
      if (Array.isArray(m)) {
        m = m[0]; // eslint-disable-line prefer-destructuring
      }
      if (Array.isArray(nm)) {
        nm = nm[1]; // eslint-disable-line prefer-destructuring
      }
      for (let k = 0; k < parentEdges.length; k += 1) {
        if ((parentEdges[k][0] === m && parentEdges[k][1] === nm)
          || (parentEdges[k][1] === m && parentEdges[k][0] === nm)) {
          edges.push([i, j]);
          break;
        }
      }
    }
    return edges;
  }
}

export default FaceRasterizer;
