class BSPNode {
  constructor(points, edges, normal, face) {
    this.points = points;
    this.edges = edges;
    this.normal = normal;
    this.face = face;
  }

  getPoints() {
    return this.points;
  }

  getNormal() {
    return this.normal;
  }

  getFace() {
    return this.face;
  }

  isParentEdge(edge) {
    if (edge.getP1() === null && edge.getP2() === null) {
      return false;
    }
    let match = 0;
    for (let i = 0; i < this.edges.length; i += 1) {
      if (edge.getP1() === this.edges[i].getP1() || edge.getP2() === this.edges[i].getP2()) {
        match += 1;
      }
    }
    return match === 1;
  }
}

export default BSPNode;
