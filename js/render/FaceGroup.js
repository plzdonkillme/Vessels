import Face from './Face';
import Point from './Point';
import Vector from './Vector';

export function getCube(x, y, z, w, l, h) {
  const v = [
    new Point(x, y, z + h),
    new Point(x + w, y, z + h),
    new Point(x + w, y + l, z + h),
    new Point(x, y + l, z + h),
    new Point(x, y, z),
    new Point(x + w, y, z),
    new Point(x + w, y + l, z),
    new Point(x, y + l, z),
  ];

  const faces = [
    new Face([v[1].copy(), v[2].copy(), v[6].copy(), v[5].copy()], new Vector(1, 0, 0)),
    new Face([v[0].copy(), v[3].copy(), v[7].copy(), v[4].copy()], new Vector(-1, 0, 0)),
    new Face([v[2].copy(), v[3].copy(), v[7].copy(), v[6].copy()], new Vector(0, 1, 0)),
    new Face([v[0].copy(), v[1].copy(), v[5].copy(), v[4].copy()], new Vector(0, -1, 0)),
    new Face([v[0].copy(), v[1].copy(), v[2].copy(), v[3].copy()], new Vector(0, 0, 1)),
    new Face([v[4].copy(), v[5].copy(), v[6].copy(), v[7].copy()], new Vector(0, 0, -1)),
  ];

  return faces;
}

/*
  Regular Polyhedrons
  http://www.sacred-geometry.es/?q=en/content/phi-sacred-solids
*/
export function getTetrahedron(x, y, z, scale) {
  const vertices = {
    M: new Point(1, 1, 1),
    O: new Point(-1, -1, 1),
    S: new Point(1, -1, -1),
    Q: new Point(-1, 1, -1),
  };

  Object.values(vertices).forEach((p) => {
    p.scale(scale);
    p.translate(x, y, z);
  });

  const facesMap = [
    ['M', 'S', 'Q'],
    ['M', 'Q', 'O'],
    ['M', 'S', 'O'],
    ['O', 'S', 'Q'],
  ];

  const faces = [];
  for (let i = 0; i < facesMap.length; i += 1) {
    const p1 = vertices[facesMap[i][0]].copy();
    const p2 = vertices[facesMap[i][1]].copy();
    const p3 = vertices[facesMap[i][2]].copy();
    const v1 = Vector.createFromPoints(p1, p2);
    const v2 = Vector.createFromPoints(p1, p3);
    const n = v1.cross(v2);
    n.normalize();
    faces.push(new Face([p1, p2, p3], n));
  }

  return faces;
}

export function getIcosahedron(x, y, z, scale) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const vertices = {
    U: new Point(0, -phi, 1),
    V: new Point(0, phi, 1),
    W: new Point(0, phi, -1),
    X: new Point(0, -phi, -1),
    Y: new Point(1, 0, phi),
    Z: new Point(-1, 0, phi),
    A: new Point(-1, 0, -phi),
    B: new Point(1, 0, -phi),
    C: new Point(phi, 1, 0),
    D: new Point(-phi, 1, 0),
    E: new Point(-phi, -1, 0),
    F: new Point(phi, -1, 0),
  };

  Object.values(vertices).forEach((p) => {
    p.scale(scale);
    p.translate(x, y, z);
  });

  const facesMap = [
    ['F', 'C', 'Y'],
    ['F', 'C', 'B'],
    ['F', 'Y', 'U'],
    ['F', 'B', 'X'],
    ['F', 'U', 'X'],
    ['E', 'D', 'Z'],
    ['E', 'D', 'A'],
    ['E', 'Z', 'U'],
    ['E', 'A', 'X'],
    ['E', 'X', 'U'],
    ['D', 'V', 'W'],
    ['D', 'V', 'Z'],
    ['D', 'W', 'A'],
    ['C', 'V', 'W'],
    ['C', 'V', 'Y'],
    ['C', 'W', 'B'],
    ['Y', 'Z', 'U'],
    ['Y', 'Z', 'V'],
    ['B', 'A', 'X'],
    ['B', 'A', 'W'],
  ];

  const faces = [];
  for (let i = 0; i < facesMap.length; i += 1) {
    const p1 = vertices[facesMap[i][0]].copy();
    const p2 = vertices[facesMap[i][1]].copy();
    const p3 = vertices[facesMap[i][2]].copy();
    const v1 = Vector.createFromPoints(p1, p2);
    const v2 = Vector.createFromPoints(p1, p3);
    const n = v1.cross(v2);
    n.normalize();
    faces.push(new Face([p1, p2, p3], n));
  }

  return faces;
}

export function getDodecahedron(x, y, z, scale) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const phi1 = 1 / phi;
  const vertices = {
    A: new Point(phi, 0, phi1),
    B: new Point(-phi, 0, phi1),
    C: new Point(-phi, 0, -phi1),
    D: new Point(phi, 0, -phi1),
    E: new Point(phi1, phi, 0),
    F: new Point(phi1, -phi, 0),
    G: new Point(-phi1, -phi, 0),
    H: new Point(-phi1, phi, 0),
    I: new Point(0, phi1, phi),
    J: new Point(0, phi1, -phi),
    K: new Point(0, -phi1, -phi),
    L: new Point(0, -phi1, phi),
    M: new Point(1, 1, 1),
    N: new Point(1, -1, 1),
    O: new Point(-1, -1, 1),
    P: new Point(-1, 1, 1),
    Q: new Point(-1, 1, -1),
    R: new Point(1, 1, -1),
    S: new Point(1, -1, -1),
    T: new Point(-1, -1, -1),
  };

  Object.values(vertices).forEach((p) => {
    p.scale(scale);
    p.translate(x, y, z);
  });

  const facesMap = [
    ['E', 'H', 'P', 'I', 'M'],
    ['E', 'H', 'Q', 'J', 'R'],
    ['F', 'G', 'T', 'K', 'S'],
    ['F', 'G', 'O', 'L', 'N'],
    ['A', 'D', 'R', 'E', 'M'],
    ['A', 'D', 'S', 'F', 'N'],
    ['B', 'C', 'T', 'G', 'O'],
    ['B', 'C', 'Q', 'H', 'P'],
    ['L', 'I', 'M', 'A', 'N'],
    ['L', 'I', 'P', 'B', 'O'],
    ['K', 'J', 'Q', 'C', 'T'],
    ['K', 'J', 'R', 'D', 'S'],
  ];

  const faces = [];
  for (let i = 0; i < facesMap.length; i += 1) {
    const p1 = vertices[facesMap[i][0]].copy();
    const p2 = vertices[facesMap[i][1]].copy();
    const p3 = vertices[facesMap[i][2]].copy();
    const p4 = vertices[facesMap[i][3]].copy();
    const p5 = vertices[facesMap[i][4]].copy();
    const v1 = Vector.createFromPoints(p1, p2);
    const v2 = Vector.createFromPoints(p1, p3);
    const n = v1.cross(v2);
    n.normalize();
    faces.push(new Face([p1, p2, p3, p4, p5], n));
  }

  return faces;
}

export function getSmallStellatedDodecahedron(x, y, z, scale) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const phi2 = phi * phi;
  const phi1 = 1 / phi;
  const peaks = [
    new Point(0, phi2, phi),
    new Point(0, phi2, -phi),
    new Point(0, -phi2, -phi),
    new Point(0, -phi2, phi),
    new Point(phi2, phi, 0),
    new Point(phi2, -phi, 0),
    new Point(-phi2, -phi, 0),
    new Point(-phi2, phi, 0),
    new Point(phi, 0, phi2),
    new Point(-phi, 0, phi2),
    new Point(-phi, 0, -phi2),
    new Point(phi, 0, -phi2),
  ];

  peaks.forEach((p) => {
    p.scale(scale);
    p.translate(x, y, z);
  });

  const valleys = {
    A: new Point(phi, 0, phi1),
    B: new Point(-phi, 0, phi1),
    C: new Point(-phi, 0, -phi1),
    D: new Point(phi, 0, -phi1),
    E: new Point(phi1, phi, 0),
    F: new Point(phi1, -phi, 0),
    G: new Point(-phi1, -phi, 0),
    H: new Point(-phi1, phi, 0),
    I: new Point(0, phi1, phi),
    J: new Point(0, phi1, -phi),
    K: new Point(0, -phi1, -phi),
    L: new Point(0, -phi1, phi),
    M: new Point(1, 1, 1),
    N: new Point(1, -1, 1),
    O: new Point(-1, -1, 1),
    P: new Point(-1, 1, 1),
    Q: new Point(-1, 1, -1),
    R: new Point(1, 1, -1),
    S: new Point(1, -1, -1),
    T: new Point(-1, -1, -1),
  };

  Object.values(valleys).forEach((p) => {
    p.scale(scale);
    p.translate(x, y, z);
  });

  const facesMap = [
    ['E', 'H', 'P', 'I', 'M'],
    ['E', 'H', 'Q', 'J', 'R'],
    ['F', 'G', 'T', 'K', 'S'],
    ['F', 'G', 'O', 'L', 'N'],
    ['A', 'D', 'R', 'E', 'M'],
    ['A', 'D', 'S', 'F', 'N'],
    ['B', 'C', 'T', 'G', 'O'],
    ['B', 'C', 'Q', 'H', 'P'],
    ['L', 'I', 'M', 'A', 'N'],
    ['L', 'I', 'P', 'B', 'O'],
    ['K', 'J', 'Q', 'C', 'T'],
    ['K', 'J', 'R', 'D', 'S'],
  ];

  const faces = [];
  for (let i = 0; i < peaks.length; i += 1) {
    const valleyPoints = facesMap[i];
    for (let k = 0; k < 5; k += 1) {
      const peak = peaks[i].copy();
      const nextk = k === 4 ? 0 : k + 1;
      const p1 = valleys[valleyPoints[k]].copy();
      const p2 = valleys[valleyPoints[nextk]].copy();
      const v1 = Vector.createFromPoints(peak, p1);
      const v2 = Vector.createFromPoints(peak, p2);
      const n = v1.cross(v2);
      n.normalize();
      faces.push(new Face([peak, p1, p2], n));
    }
  }

  return faces;
}
