class Face {
  constructor(points, unitNormal) {
    this.points = points;
    this.normal = unitNormal;
  }

  getPoints() {
    return this.points;
  }

  getNormal() {
    return this.normal;
  }

  split(frontPoints, backPoints) {
    const frontFace = new Face(frontPoints, this.normal.copy());
    const backFace = new Face(backPoints, this.normal.copy());
    return {
      frontFace,
      backFace,
    };
  }
}

export default Face;
