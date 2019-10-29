class RasterizedFace {
  constructor(points, edges, face) {
    this.points = points;
    this.edges = edges;
    this.face = face;
  }

  getPoints() {
    return this.points;
  }

  getEdges() {
    return this.edges;
  }

  getFace() {
    return this.face;
  }
}

export default RasterizedFace;
