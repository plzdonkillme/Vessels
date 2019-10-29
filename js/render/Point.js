class Point {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  midpoint(p, perc) {
    const x = (1 - perc) * this.x + perc * p.getX();
    const y = (1 - perc) * this.y + perc * p.getY();
    const z = (1 - perc) * this.z + perc * p.getZ();
    return new Point(x, y, z);
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getZ() {
    return this.z;
  }

  translate(x, y, z) {
    this.x += x;
    this.y += y;
    this.z += z;
  }

  rotate(v, rad) {
    const cost = Math.cos(rad);
    const sint = Math.sin(rad);
    const mcost = 1 - cost;
    const vx = v.getX();
    const vy = v.getY();
    const vz = v.getZ();
    const dot = this.x * vx + this.y * vy + this.z * vz;
    const newx = this.x * cost + (vy * this.z - vz * this.y) * sint + vx * dot * mcost;
    const newy = this.y * cost + (vz * this.x - vx * this.z) * sint + vy * dot * mcost;
    const newz = this.z * cost + (vx * this.y - vy * this.x) * sint + vz * dot * mcost;
    this.x = newx;
    this.y = newy;
    this.z = newz;
  }

  scale(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
  }

  dot(p) {
    return this.x * p.getX() + this.y * p.getY() + this.z * p.getZ();
  }

  copy() {
    return new Point(this.x, this.y, this.z);
  }

  equals(p, strict = true) {
    if (strict) {
      return this.x === p.getX() && this.y === p.getY() && this.z === p.getZ();
    }
    return Math.abs(this.x - p.getX()) < 0.001
      && Math.abs(this.y - p.getY()) < 0.001
      && Math.abs(this.z - p.getZ()) < 0.001;
  }

  static createFromBuffer(buffer) {
    if (buffer.length % 3 !== 0) {
      throw Error('createFromBuffer must receive a buffer whose length is a multiple of 3');
    }
    const points = [];
    for (let i = 0; i < buffer.length; i += 3) {
      points.push(new Point(buffer[i], buffer[i + 1], buffer[i + 2]));
    }
    return points;
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

export default Point;
