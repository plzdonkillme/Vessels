import BSPTree from './BSPTree';

class RasterFace {
  constructor(visiblePoints, sigEdges, face) {
    this.visiblePoints = visiblePoints;
    this.sigEdges = sigEdges;
    this.face = face;
  }
}

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
      const sigEdges = FaceRasterizer.getSigEdges(mapping, parentEdges);
      const rasterFace = new RasterFace(visiblePoints, sigEdges, parentFace);
      rasterFaces.push(rasterFace);
    }, viewport.getNormal());
    this.bsp = BSPTree.removeFaces(this.bsp, faces);
    return rasterFaces;
  }

  static getSigEdges(mapping, parentEdges) {
    const sigEdges = [];
    for (let i = 0; i < mapping.length; i += 1) {
      const j = i === mapping.length - 1 ? 0 : i + 1;
      let m = mapping[i];
      let nm = mapping[j];
      if (Array.isArray(m) && Array.isArray(nm)) {
        continue; // eslint-disable-line no-continue
      }
      if (Array.isArray(m)) {
        m = m[1]; // eslint-disable-line prefer-destructuring
      }
      if (Array.isArray(nm)) {
        nm = nm[0]; // eslint-disable-line prefer-destructuring
      }
      for (let k = 0; k < parentEdges.length; k += 1) {
        if (parentEdges[j][0] === m && parentEdges[j][1] === nm) {
          sigEdges.push([i, j]);
          break;
        }
      }
    }
    return sigEdges;
  }
}

export default FaceRasterizer;
