import { Point, Vector } from './Vector';


/**
face
  getPoints()
  getNormal()
  split()
**/

class BSPTree {
  constructor(faces) {
    if (faces.length === 0) {
      throw Error('Must provide faces to BSP');
    }
    this.nodes = [faces[0]];
    this.front = null;
    this.back = null;
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

  addFaces(faces) {
    if (faces.length === 0) {
      return;
    }

    const { p0, n } = this.getPlane();

    // sort faces
    const { frontFaces, backFaces, nodeFaces } = this.sortFaces(faces, p0, n);

    for (let i = 0; i < nodeFaces.length; i += 1) {
      const face = nodeFaces[i];
      if (this.nodes.includes(face)) {
        throw Error('Cannot add face twice to BSP');
      }
      this.nodes.push(face);
    }
    if (frontFaces.length > 0) {
      if (this.front === null) {
        this.front = new BSPTree(frontFaces);
      } else {
        this.front.addFaces(frontFaces);
      }
    }
    if (backFaces.length > 0) {
      if (this.back === null) {
        this.back = new BSPTree(backFaces);
      } else {
        this.back.addFace(backFaces);
      }
    }
  }

  addFace(face) {
    this.addFaces([face]);
  }

  removeFaces(faces) {
    if (faces.length === 0) {
      return;
    }

    const { p0, n } = this.getPlane();

    // sort faces
    const { frontFaces, backFaces, nodeFaces } = this.sortFaces(faces, p0, n);

    if (backFaces.length > 0) {
      if (this.back === null) {
        throw Error('Back faces do not exist');
      } else {
        this.back.removeFaces(backFaces);
      }
    }
    if (frontFaces.length > 0) {
      if (this.front === null) {
        throw Error('Front faces do not exist');
      } else {
        this.front.removeFaces(frontFaces);
      }
    }
    for (let i = 0; i < nodeFaces.length; i += 1) {
      const face = nodeFaces[i];
      const idx = this.nodes.indexOf(face);
      if (idx === -1) {
        throw Error('Node face does not exist');
      }
      this.nodes.splice(idx, 1);
    }

    // TODO REORDER TREE
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

  static sortFaces(faces, p0, n) {
    const frontFaces = [];
    const backFaces = [];
    const nodeFaces = [];
    for (let i = 0; i < faces.length; i += 1) {
      const face = faces[i];
      const points = face.getPoints();
      const { frontPoints, backPoints } = this.sortPoints(points, p0, n);

      if (Point.arrayEquals(frontPoints, points) && Point.arrayEquals(backPoints, points)) {
        nodeFaces.push(face);
      } else if (Point.arrayEquals(frontPoints, points)) {
        frontFaces.push(face);
      } else if (Point.arrayEquals(backPoints, points)) {
        backFaces.push(face);
      } else {
        const { frontFace, backFace } = face.split(frontPoints, backPoints);
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

  traverse(fn, viewport) {
    if (this.nodes.length > 0) {
      const n = this.nodes[0].getNormal();
      const p = this.nodes[0].getPoints()[0];
      const viewDir = viewport.getViewDir(p, n);
      if (viewDir === 'towards') {
        if (this.back !== null) {
          this.back.traverse(fn, viewport);
        }
        for (let i = 0; i < this.nodes.length; i++) {
          fn(this.nodes[i]);
        }
        if (this.front !== null) {
          this.front.traverse(fn, viewport);
        }
      } else {
        if (this.front !== null) {
          this.front.traverse(fn, viewport);
        }
        for (let i = 0; i < this.nodes.length; i++) {
          fn(this.nodes[i]);
        }
        if (this.back !== null) {
          this.back.traverse(fn, viewport);
        }
      }
    }
  }
}

export default BSPTree;
