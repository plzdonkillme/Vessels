import Face from './Face';
import { Point, Vector } from './Vector';

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
    new Face([v[0].copy(), v[1].copy(), v[2].copy(), v[3].copy()], new Vector(0, 0, 1)),
    new Face([v[1].copy(), v[2].copy(), v[6].copy(), v[5].copy()], new Vector(1, 0, 0)),
    new Face([v[4].copy(), v[5].copy(), v[6].copy(), v[7].copy()], new Vector(0, 0, -1)),
    new Face([v[0].copy(), v[1].copy(), v[5].copy(), v[4].copy()], new Vector(0, -1, 0)),
    new Face([v[0].copy(), v[3].copy(), v[7].copy(), v[4].copy()], new Vector(-1, 0, 0)),
    new Face([v[2].copy(), v[3].copy(), v[7].copy(), v[6].copy()], new Vector(0, 1, 0)),
  ];

  return faces;
}

export function getIcosahedron(x, y, z, scale) {
  const t = (1 + Math.sqrt(5)) / 2;
  const v = [
    new Point(-1, t, 0),
    new Point(1, t, 0),
    new Point(-1, -t, 0),
    new Point(1, -t, 0),
    new Point(0, -1, t),
    new Point(0, 1, t),
    new Point(0, -1, -t),
    new Point(0, 1, -t),
    new Point(t, 0, -1),
    new Point(t, 0, 1),
    new Point(-t, 0, -1),
    new Point(-t, 0, 1),
  ];

  v.forEach((p) => {
    p.scale(scale);
    p.translate(x, y, z);
  });

  const faces = [
    [0, 11, 5],
    [0, 5, 1],
    [0, 1, 7],
    [0, 7, 10],
    [0, 10, 11],

    [1, 5, 9],
    [5, 11, 4],
    [11, 10, 2],
    [10, 7, 6],
    [7, 1, 8],

    [3, 9, 4],
    [3, 4, 2],
    [3, 2, 6],
    [3, 6, 8],
    [3, 8, 9],

    [4, 9, 5],
    [2, 4, 11],
    [6, 2, 10],
    [8, 6, 7],
    [9, 8, 1],
  ].map((idx) => {
    const p1 = v[idx[0]].copy();
    const p2 = v[idx[1]].copy();
    const p3 = v[idx[2]].copy();
    const v1 = Vector.createFromPoints(p1, p2);
    const v2 = Vector.createFromPoints(p1, p3);
    const n = v1.cross(v2);
    n.normalize();
    return new Face([p1, p2, p3], n);
  });

  return faces;
}
