import Face from './Face';

export default function getCube(x, y, h, tlen) {
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
    new PolygonFace([v[0], v[1], v[2], v[3]], new Vector(0, 0, 1)),
    new PolygonFace([v[1], v[2], v[6], v[5]], new Vector(1, 0, 0)),
    new PolygonFace([v[4], v[5], v[6], v[7]], new Vector(0, 0, -1)),
    new PolygonFace([v[0], v[1], v[5], v[4]], new Vector(0, -1, 0)),
    new PolygonFace([v[0], v[3], v[7], v[4]], new Vector(-1, 0, 0)),
    new PolygonFace([v[2], v[3], v[7], v[6]], new Vector(0, 1, 0)),
  ];

  return new Polygon(faces, 'box');
}