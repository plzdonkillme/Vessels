class BSPNode {
  constructor(points, normal, face) {
    this.points = points;
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
    return true;
  }
}

export default BSPNode;
