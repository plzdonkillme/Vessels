import { Point, Vector } from "./Vector";

class Polygon {
    constructor(faces, type) {
        this.faces = faces;
        faces.forEach(face => face.setPolygon(this));
        this.type = type;
        this.clippedFace = null;
        this.hover = false;
        this.originalFaces = faces.slice();
    }

    translate(x, y, z) {
        const points = Array.from(new Set(this.faces.reduce((a,b) => a.concat(b.getPoints()), [])));
        points.forEach(point => point.translate(x, y, z));
    }

    rotate(v, rad) {
        const points = Array.from(new Set(this.faces.reduce((a,b) => a.concat(b.getPoints()), [])));
        const x = points.reduce((a,b) => a + b.getX(), 0) / points.length;
        const y = points.reduce((a,b) => a + b.getY(), 0) / points.length;
        const z = points.reduce((a,b) => a + b.getZ(), 0) / points.length;
        points.forEach(point => {
            point.translate(-x, -y, -z);
            point.rotate(v, rad);
            point.translate(x, y, z);
        });
        this.faces.forEach(face => {
            face.getNormal().rotate(v, rad);
        });
    }

    getHover() {
        return this.hover;
    }

    toggleHover() {
        this.hover = !this.hover;
    }

    getFaces() {
        return this.faces;
    }

    restoreFaces() {
        this.faces = this.originalFaces.slice();
    }

    getClippedFace() {
        return this.clippedFace;
    }

    calcClippedFace() {
        let newFacePoints = null;
        this.faces.forEach(face => {
            const clippedPoints = face.getClippedPoints();
            if (clippedPoints.length > 0) {
                if (newFacePoints === null) {
                    newFacePoints = clippedPoints.slice();
                } else {
                    for (let i = 0; i < clippedPoints.length; i++) {
                        const c = clippedPoints[i];
                        let minDist = null;
                        let minDistIdx = null;
                        let match = false;
                        for (let j = 0; j < newFacePoints.length; j++) {
                            const cp = newFacePoints[j];
                            const nextcp = j == newFacePoints.length - 1 ? newFacePoints[0] : newFacePoints[j + 1];
                            const currDist = Vector.createFromPoints(cp, nextcp).getMag();
                            const cDist1 = Vector.createFromPoints(cp, c).getMag();
                            const cDist2 = Vector.createFromPoints(nextcp, c).getMag();
                            const distInc = cDist1 + cDist2 - currDist;
                            if (distInc === 0) {
                                match = true;
                                break;
                            }
                            if (minDist == null || distInc < minDist) {
                                minDist = distInc;
                                minDistIdx = j;
                            }
                        }
                        if (!match) {
                            if (minDistIdx == newFacePoints.length - 1) {
                                newFacePoints.splice(0, 0, c);
                            } else {
                                newFacePoints.splice(minDistIdx + 1, 0, c);
                            }
                        }
                    }

                }
            }
        });
        if (newFacePoints !== null) {
            this.clippedFace = new PolygonFace();
            this.clippedFace.setVisiblePoints(newFacePoints, []);
            this.clippedFace.setPolygon(this);
        } else {
            this.clippedFace = null;
        }
    }

    splitFace(face, points1, points2) {
        this.faces.splice(this.faces.indexOf(face), 1);
        const blacklist = face.getEdgeBlacklist();
        const sharedPoints = points1.filter(p => points2.indexOf(p) !== -1);
        const n = face.getNormal();

        const [face1, face2] = [points1, points2].map(points => {
            const f = new PolygonFace(points, n);
            f.setPolygon(this);
            const newBlacklist = [sharedPoints];
            blacklist.forEach(b => {
                const idx1 = points.indexOf(b[0]);
                const idx2 = points.indexOf(b[1]);
                if (idx1 !== -1 && idx2 !== -1) {
                    newBlacklist.push(b);
                } else if (idx1 !== -1 || idx2 !== -1) {
                    const idx = idx1 !== -1 ? idx1 : idx2;
                    const nidx = idx === points.length - 1 ? 0 : idx + 1;
                    const pidx = idx === 0 ? points.length - 1 : idx - 1;
                    const p = points[idx];
                    const np = points[nidx];
                    const pp = points[pidx];
                    if (sharedPoints.indexOf(np) === -1) {
                        newBlacklist.push([p, pp]);
                    } else if (sharedPoints.indexOf(pp) === -1) {
                        newBlacklist.push([p, np]);
                    } else {
                        // You've got a triangle
                        const v1 = Vector.createFromPoints(b[0], b[1]);
                        v1.normalize();
                        const v2 = Vector.createFromPoints(p, np);
                        v2.normalize();
                        if (Math.abs(Math.abs(v1.dot(v2)) - 1) < 0.001) {
                            newBlacklist.push([p, np]);
                        } else {
                            newBlacklist.push([p, pp]);
                        }
                    }
                }
            });
            f.setEdgeBlacklist(newBlacklist);
            this.faces.push(f);
            return f;
        });

        return {
            face1,
            face2
        };
    }

    static createBox(x, y, z, w, l, h) {
        const v = [
            new Point(x, y, z + h),
            new Point(x + w, y, z + h),
            new Point(x + w, y + l, z + h),
            new Point(x , y + l, z + h),
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
            new PolygonFace([v[2], v[3], v[7], v[6]], new Vector(0, 1, 0))
        ];

        return new Polygon(faces, 'box');
    }

    static createIcosahedron(x, y, z, scale) {
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
            new Point(-t, 0, 1)
        ];

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
        [9, 8, 1]
        ].map(idx => {
            const p1 = v[idx[0]];
            const p2 = v[idx[1]];
            const p3 = v[idx[2]];
            const v1 = Vector.createFromPoints(p1, p2);
            const v2 = Vector.createFromPoints(p1, p3);
            const n = v1.cross(v2);
            n.normalize();
            return new PolygonFace([p1, p2, p3], n);
        });

        v.forEach(v => {
            v.scale(scale);
            v.translate(x, y, z);
        });

        return new Polygon(faces, 'icosahedron');
    }
}

class PolygonFace {
    constructor(points, unitNormal) {
        this.points = points;
        this.normal = unitNormal;
        this.polygon = null;
        this.visiblePoints = [];
        this.mapping = [];
        this.edgeBlacklist = [];
    }

    translate(x, y, z) {
        this.points.forEach(p => p.translate(x, y, z));
    }

    rotate(v, rad) {
        this.points.forEach(p => p.rotate(v, rad));
        this.normal.rotate(v, rad);
    }

    getPoints() {
        return this.points;
    }

    getNormal() {
        return this.normal;
    }

    getPolygon() {
        return this.polygon;
    }

    setPolygon(polygon) {
        this.polygon = polygon;
    }

    getClippedPoints() {
        const clippedPoints = [];
        for (let i = 0; i < this.mapping.length; i++) {
            if (typeof this.mapping[i] !== 'number') {
                clippedPoints.push(this.visiblePoints[i]);
            }
        }
        return clippedPoints;
    }

    getVisiblePoints() {
        return this.visiblePoints;
    }

    setVisiblePoints(points, mapping) {
        if (this.normal !== undefined && this.normal.getY() === 0 && this.normal.getX() < 0 && this.normal.getZ() > 0) {
            var a = 1;
        }
        this.visiblePoints = points;
        this.mapping = mapping;
    }

    getEdgeBlacklist() {
        return this.edgeBlacklist;
    }

    setEdgeBlacklist(blacklist) {
        this.edgeBlacklist = blacklist;
    }

    draw(ctx) {
        let fillColor;
        if (this.polygon.getHover()) {
            fillColor = "#E6E6E6";
        } else {
            fillColor = "#CCCCCC";
        }
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        let k;
        for (k = 0; k < this.visiblePoints.length; k++) {
            if (k == 0) {
                ctx.moveTo(this.visiblePoints[k].getX(), this.visiblePoints[k].getY());
            }
            if (k == this.visiblePoints.length - 1) {
                ctx.lineTo(this.visiblePoints[0].getX(), this.visiblePoints[0].getY());
            } else {
                ctx.lineTo(this.visiblePoints[k + 1].getX(), this.visiblePoints[k + 1].getY());
            }
        }
        ctx.fill();

        let nextK;
        let edge;
        let blacklist;
        ctx.strokeStyle = "#000000";
        //Draw outline
        for (k = 0; k < this.visiblePoints.length; k++) {
            nextK = k === this.visiblePoints.length - 1 ? 0 : k + 1;
            edge = null;
            blacklist = false;
            if (typeof this.mapping[k] === 'number') {
                if (typeof this.mapping[nextK] === 'number') {
                    edge = [this.points[this.mapping[k]], this.points[this.mapping[nextK]]];
                } else {
                    if (this.points[this.mapping[k]] === this.points[this.mapping[nextK][0]]) {
                        edge = [this.points[this.mapping[k]], this.points[this.mapping[nextK][1]]];
                    } else {
                        edge = [this.points[this.mapping[k]], this.points[this.mapping[nextK][0]]];
                    }
                }
            } else if (typeof this.mapping[nextK] === 'number') {
                if (this.points[this.mapping[k][0]] === this.points[this.mapping[nextK]]) {
                    edge = [this.points[this.mapping[k][1]], this.points[this.mapping[nextK]]];
                } else {
                    edge = [this.points[this.mapping[k][0]], this.points[this.mapping[nextK]]];
                }
            }

            if (edge !== null) {
                blacklist = this.edgeBlacklist.filter(b => b.indexOf(edge[0]) !== -1 && b.indexOf(edge[1]) !== -1).length > 0;
            }

            if (!blacklist) {
                ctx.beginPath();
                ctx.moveTo(this.visiblePoints[k].getX(), this.visiblePoints[k].getY());
                ctx.lineTo(this.visiblePoints[nextK].getX(), this.visiblePoints[nextK].getY());
                ctx.stroke();
            }
        }
    }
}

export { Polygon, PolygonFace };