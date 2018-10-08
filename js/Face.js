import { Point, Vector } from './Vector';

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

  equals(face) {
    const points1 = this.getPoints();
    const points2 = face.getPoints();
    const n1 = this.getNormal();
    const n2 = face.getNormal();
    return Point.arrayEquals(points1, points2) && n1.equals(n2);
  }

  static createFromBuffer(buffer) {
    if (buffer.length % 3 !== 0 && buffer.length < 9) {
      throw Error('createFromBuffer recieved a bad length buffer');
    }
    const points = Point.createFromBuffer(buffer);
    const v1 = Vector.createFromPoints(points[0], points[1]);
    const v2 = Vector.createFromPoints(points[1], points[2]);
    const n = v1.cross(v2);
    n.normalize();
    return new Face(points, n);
  }

  static arrayEquals(faces1, faces2) {
    if (faces1.length !== faces2.length) {
      return false;
    }
    for (let i = 0; i < faces1.length; i += 1) {
      if (!faces1[i].equals(faces2[i])) {
        return false;
      }
    }
    return true;
  }
}

export default Face;
