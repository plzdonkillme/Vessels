class ProjectedPoint {
  constructor(x, y, origPoint) {
    this.x = x;
    this.y = y;
    this.origPoint = origPoint;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getOrigPoint() {
    return this.origPoint;
  }

  equals(p, strict = true) {
    if (this.origPoint == null) {
      if (!strict) {
        return Math.abs(this.x - p.getX()) < 0.001
          && Math.abs(this.y - p.getY()) < 0.001
          && p.getOrigPoint() == null;
      }
      return this.x === p.getX() && this.y === p.getY() && p.getOrigPoint() == null;
    }
    if (!strict) {
      return Math.abs(this.x - p.getX()) < 0.001
        && Math.abs(this.y - p.getY()) < 0.001
        && this.origPoint.equals(p.getOrigPoint());
    }
    return this.x === p.getX() && this.y === p.getY() && this.origPoint.equals(p.getOrigPoint());
  }

  static createFromBuffer(buffer) {
    if (buffer.length % 3 !== 0) {
      throw Error('createFromBuffer must receive a buffer whose length is a multiple of 3');
    }
    const projectedPoints = [];
    for (let i = 0; i < buffer.length; i += 3) {
      projectedPoints.push(new ProjectedPoint(buffer[i], buffer[i + 1], buffer[i + 2]));
    }
    return projectedPoints;
  }

  static arrayEquals(points1, points2, strict = true) {
    if (points1.length !== points2.length) {
      return false;
    }
    for (let i = 0; i < points1.length; i += 1) {
      if (!points1[i].equals(points2[i], strict)) {
        return false;
      }
    }
    return true;
  }
}

export default ProjectedPoint;
