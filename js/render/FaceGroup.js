import Face from './Face';
import { Point, Vector } from './Vector';

export default function getCube(x, y, z, w, l, h) {
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
