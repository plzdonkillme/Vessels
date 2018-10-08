import { Point, Vector } from './Vector';
import Face from './Face';

class BSPTree {
  constructor(faces, splitFacesMap = new Map()) {
    if (faces.length === 0) {
      throw Error('Must provide faces to BSP');
    }
    this.nodes = [faces[0]];
    this.front = null;
    this.back = null;
    this.splitFacesMap = splitFacesMap;
    this.addFaces(faces.slice(1));
  }

  getPlane() {
    const face = this.nodes[0];
    const p0 = face.getPoints()[0];
    const n = face.getNormal();
    return {
      p0,
      n,
    };
  }

  getSplitFacesMap() {
    return this.splitFacesMap;
  }

  getFront() {
    return this.front;
  }

  getBack() {
    return this.back;
  }

  getNodes() {
    return this.nodes;
  }

  setFront(bsp) {
    this.front = bsp;
  }

  setBack(bsp) {
    this.back = bsp;
  }

  setNodes(nodes) {
    this.nodes = nodes;
  }

  addFaces(faces) {
    if (faces.length === 0) {
      return;
    }

    const { p0, n } = this.getPlane();

    // sort faces
    const { frontFaces, backFaces, nodeFaces } = BSPTree.sortFaces(
      faces,
      p0,
      n,
      this.splitFacesMap,
    );

    for (let i = 0; i < nodeFaces.length; i += 1) {
      const face = nodeFaces[i];
      if (this.nodes.includes(face)) {
        throw Error('Cannot add face twice to BSP');
      }
      this.nodes.push(face);
    }
    if (frontFaces.length > 0) {
      if (this.front === null) {
        this.front = new BSPTree(frontFaces, this.splitFacesMap);
      } else {
        this.front.addFaces(frontFaces);
      }
    }
    if (backFaces.length > 0) {
      if (this.back === null) {
        this.back = new BSPTree(backFaces, this.splitFacesMap);
      } else {
        this.back.addFace(backFaces);
      }
    }
  }

  addFace(face) {
    this.addFaces([face]);
  }

  static removeFaces(bsp, faces) {
    if (faces.length === 0) {
      return bsp;
    }

    if (bsp === null && faces.length > 0) {
      throw Error('Cannot remove from null');
    }

    const { p0, n } = bsp.getPlane();

    // sort faces
    const { frontFaces, backFaces, nodeFaces } = BSPTree.sortFaces(
      faces,
      p0,
      n,
      bsp.getSplitFacesMap(),
    );
    bsp.setBack(BSPTree.removeFaces(bsp.getBack(), backFaces));
    bsp.setFront(BSPTree.removeFaces(bsp.getFront(), frontFaces));
    const nodes = bsp.getNodes();
    const splitFacesMap = bsp.getSplitFacesMap();
    for (let i = 0; i < nodeFaces.length; i += 1) {
      const face = nodeFaces[i];
      const idx = nodes.indexOf(face);
      if (idx === -1) {
        throw Error('Node face does not exist');
      }
      nodes.splice(idx, 1);
      if (splitFacesMap.has(face)) {
        splitFacesMap.delete(face);
      }
    }

    if (nodes.length === 0) {
      if (bsp.getBack() === null && bsp.getFront() === null) {
        return null;
      }
      if (bsp.getBack() === null) {
        return bsp.getFront();
      }
      if (bsp.getFront() === null) {
        return bsp.getBack();
      }
      const facesToMove = [];
      const traverseFn = face => facesToMove.push(face);
      bsp.getBack().traverse(traverseFn, new Vector(0, 0, 1));
      bsp.getFront().addFaces(facesToMove);
      return bsp.getFront();
    }
    return bsp;
  }

  removeFace(face) {
    this.removeFaces([face]);
  }

  static sortPoints(points, p0, n) {
    const frontPoints = [];
    const backPoints = [];
    let prevP;
    let prevD;
    let prevPos;
    let p;
    let d;
    let pos;

    // Get initial prevP, prevPos, and prevD
    prevP = points[points.length - 1];
    prevD = Vector.createFromPoints(p0, prevP).dot(n);
    if (Math.abs(prevD) < 0.001) {
      prevPos = null;
    } else if (prevD > 0) {
      prevPos = 'front';
    } else {
      prevPos = 'back';
    }

    // Iterate over points
    for (let i = 0; i < points.length; i += 1) {
      p = points[i];
      d = Vector.createFromPoints(p0, p).dot(n);
      if (Math.abs(d) < 0.001) {
        pos = null;
      } else if (d > 0) {
        pos = 'front';
      } else {
        pos = 'back';
      }

      if (pos === 'front') {
        if (prevPos === 'back') {
          const mid = p.midpoint(prevP, d / (d - prevD));
          frontPoints.push(mid);
          backPoints.push(mid);
        }
        frontPoints.push(p.copy());
      } else if (pos === 'back') {
        if (prevPos === 'front') {
          const mid = p.midpoint(prevP, d / (d - prevD));
          frontPoints.push(mid);
          backPoints.push(mid);
        }
        backPoints.push(p.copy());
      } else {
        frontPoints.push(p.copy());
        backPoints.push(p.copy());
      }

      prevP = p;
      prevPos = pos;
      prevD = d;
    }

    return {
      frontPoints,
      backPoints,
    };
  }

  static sortFaces(faces, p0, n, splitFacesMap = new Map()) {
    const frontFaces = [];
    const backFaces = [];
    const nodeFaces = [];

    const childMap = new Map();
    splitFacesMap.forEach((value, key) => {
      if (childMap.has(value)) {
        childMap.get(value).push(key);
      } else {
        childMap.set(value, [key]);
      }
    });
    const facesToIterate = [].concat(
      ...faces.map(face => (childMap.has(face) ? childMap.get(face) : [face])),
    );

    for (let i = 0; i < facesToIterate.length; i += 1) {
      const face = facesToIterate[i];
      const points = face.getPoints();
      const { frontPoints, backPoints } = BSPTree.sortPoints(points, p0, n);

      if (Point.arrayEquals(frontPoints, points) && Point.arrayEquals(backPoints, points)) {
        nodeFaces.push(face);
      } else if (Point.arrayEquals(frontPoints, points)) {
        frontFaces.push(face);
      } else if (Point.arrayEquals(backPoints, points)) {
        backFaces.push(face);
      } else {
        const frontFace = new Face(frontPoints, face.getNormal().copy());
        const backFace = new Face(backPoints, face.getNormal().copy());
        let parentFace = face;
        if (splitFacesMap.has(face)) {
          parentFace = splitFacesMap.get(face);
          splitFacesMap.delete(face);
        }
        splitFacesMap.set(frontFace, parentFace);
        splitFacesMap.set(backFace, parentFace);

        frontFaces.push(frontFace);
        backFaces.push(backFace);
      }
    }

    return {
      frontFaces,
      backFaces,
      nodeFaces,
    };
  }

  traverse(fn, dir) {
    const { n } = this.getPlane();
    const d = n.dot(dir);
    if (d > 0) {
      if (this.front !== null) {
        this.front.traverse(fn, dir);
      }
      for (let i = 0; i < this.nodes.length; i += 1) {
        const face = this.nodes[i];
        let parentFace = face;
        if (this.splitFacesMap.has(face)) {
          parentFace = this.splitFacesMap.get(face);
        }
        fn(face, parentFace);
      }
      if (this.back !== null) {
        this.back.traverse(fn, dir);
      }
    } else {
      if (this.back !== null) {
        this.back.traverse(fn, dir);
      }
      for (let i = 0; i < this.nodes.length; i += 1) {
        const face = this.nodes[i];
        let parentFace = face;
        if (this.splitFacesMap.has(face)) {
          parentFace = this.splitFacesMap.get(face);
        }
        fn(face, parentFace);
      }
      if (this.front !== null) {
        this.front.traverse(fn, dir);
      }
    }
  }
}

export default BSPTree;
