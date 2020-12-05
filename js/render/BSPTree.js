import Point from './Point';
import Vector from './Vector';
import BSPNode from './BSPNode';

class BSPTree {
  constructor() {
    this.nodes = [];
    this.front = null;
    this.back = null;
  }

  getPlane() {
    const node = this.nodes[0];
    const p0 = node.getPoints()[0];
    const n = node.getNormal();
    return {
      p0,
      n,
    };
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

  addNodes(nodes) {
    if (nodes.length === 0) {
      return;
    }

    if (this.nodes.length === 0) {
      this.nodes.push(nodes[0]);
      this.addNodes(nodes.slice(1));
      return;
    }

    const { p0, n } = this.getPlane();

    // sort nodes
    const { frontNodes, backNodes, currNodes } = BSPTree.sortNodes(
      nodes,
      p0,
      n,
    );

    for (let i = 0; i < currNodes.length; i += 1) {
      const node = currNodes[i];
      this.nodes.push(node);
    }
    if (frontNodes.length > 0) {
      if (this.front === null) {
        this.front = new BSPTree();
      }
      this.front.addNodes(frontNodes);
    }
    if (backNodes.length > 0) {
      if (this.back === null) {
        this.back = new BSPTree();
      }
      this.back.addNodes(backNodes);
    }
  }

  addFaces(faces) {
    const nodes = faces.map((face) => new BSPNode(face.getPoints(), face.getNormal(), face));
    this.addNodes(nodes);
  }

  addFace(face) {
    this.addFaces([face]);
  }

  static removeFaces(bsp, faces) {
    if (bsp.getBack() !== null) {
      const backBsp = BSPTree.removeFaces(bsp.getBack(), faces);
      bsp.setBack(backBsp);
    }
    if (bsp.getFront() !== null) {
      const frontBsp = BSPTree.removeFaces(bsp.getFront(), faces);
      bsp.setFront(frontBsp);
    }
    const nodes = bsp.getNodes();
    const newNodes = [];
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      if (!faces.includes(node.getFace())) {
        newNodes.push(node);
      }
    }
    bsp.setNodes(newNodes);
    if (newNodes.length === 0) {
      if (bsp.getBack() === null && bsp.getFront() === null) {
        return null;
      }
      if (bsp.getBack() === null) {
        return bsp.getFront();
      }
      if (bsp.getFront() === null) {
        return bsp.getBack();
      }
      const nodesToMove = [];
      const traverseFn = (node) => nodesToMove.push(node);
      bsp.getBack().traverse(traverseFn, new Point(0, 0, 1));
      bsp.getFront().addNodes(nodesToMove);
      return bsp.getFront();
    }
    return bsp;
  }

  static removeFace(bsp, face) {
    return BSPTree.removeFaces(bsp, [face]);
  }

  static sortNodes(nodes, p0, n) {
    const frontNodes = [];
    const backNodes = [];
    const currNodes = [];

    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      const points = node.getPoints();
      const { frontPoints, backPoints } = BSPTree.sortPoints(points, p0, n);

      if (Point.arrayEquals(frontPoints, points) && Point.arrayEquals(backPoints, points)) {
        currNodes.push(node);
      } else if (Point.arrayEquals(frontPoints, points)) {
        frontNodes.push(node);
      } else if (Point.arrayEquals(backPoints, points)) {
        backNodes.push(node);
      } else {
        const frontNode = new BSPNode(frontPoints, node.getNormal(), node.getFace());
        const backNode = new BSPNode(backPoints, node.getNormal(), node.getFace());
        frontNodes.push(frontNode);
        backNodes.push(backNode);
      }
    }

    return {
      frontNodes,
      backNodes,
      currNodes,
    };
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
        frontPoints.push(p);
      } else if (pos === 'back') {
        if (prevPos === 'front') {
          const mid = p.midpoint(prevP, d / (d - prevD));
          frontPoints.push(mid);
          backPoints.push(mid);
        }
        backPoints.push(p);
      } else {
        frontPoints.push(p);
        backPoints.push(p);
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

  // TODO: Add optional view vector and angle for hidden surface culling
  traverse(fn, p) {
    const { p0, n } = this.getPlane();
    const d = n.dot(Vector.createFromPoints(p0, p));
    if (d > 0) {
      if (this.back !== null) {
        this.back.traverse(fn, p);
      }
      for (let i = 0; i < this.nodes.length; i += 1) {
        const node = this.nodes[i];
        fn(node);
      }
      if (this.front !== null) {
        this.front.traverse(fn, p);
      }
    } else {
      if (this.front !== null) {
        this.front.traverse(fn, p);
      }
      for (let i = 0; i < this.nodes.length; i += 1) {
        const node = this.nodes[i];
        fn(node);
      }
      if (this.back !== null) {
        this.back.traverse(fn, p);
      }
    }
  }
}

export default BSPTree;
