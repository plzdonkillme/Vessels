import { Point, Vector } from "./Vector";

class Polygon {
    constructor(faces, type) {
        this.faces = faces;
        faces.forEach(face => face.setPolygon(this));
        this.type = type;
        this.clippedFace = null;
        this.hover = false;
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
        const face1 = new PolygonFace(points1, face.getNormal());
        const face2 = new PolygonFace(points2, face.getNormal());
        face1.setPolygon(this);
        face2.setPolygon(this);

        const blacklist = face.getEdgeBlacklist();
        const sharedPoints = points1.filter(p => points2.indexOf(p) !== -1);
        const face1Blacklist = [sharedPoints];
        const face2Blacklist = [sharedPoints];
        for (let i = 0; i < blacklist.length; i++) {
            debugger;
            const b = blacklist[i];
            let idx1 = points1.indexOf(b[0]);
            let idx2 = points1.indexOf(b[1]);
            if (idx1 !== -1 && idx2 !== -1) {
                face1Blacklist.push(b);
            } else if (idx1 !== -1 && idx2 === -1) {
                const nidx = idx1 === points1.length - 1 ? 0 : idx1 + 1;
                const pidx = idx1 === 0 ? points1.length - 1 : idx1 - 1;
                if (sharedPoints.indexOf(points1[nidx]) !== -1) {
                    face1Blacklist.push([b[0], points1[nidx]]);
                } else {
                    face1Blacklist.push([b[0], points1[pidx]]);
                }
            } else if (idx1 === -1 && idx2 !== -1) {
                const nidx = idx2 === points1.length - 1 ? 0 : idx2 + 1;
                const pidx = idx2 === 0 ? points1.length - 1 : idx2 - 1;
                if (sharedPoints.indexOf(points1[nidx]) !== -1) {
                    face1Blacklist.push([b[1], points1[nidx]]);
                } else {
                    face1Blacklist.push([b[1], points1[pidx]]);
                }
            }

            idx1 = points2.indexOf(b[0]);
            idx2 = points2.indexOf(b[1]);
            if (idx1 !== -1 && idx2 !== -1) {
                face2Blacklist.push(b);
            } else if (idx1 !== -1 && idx2 === -1) {
                const nidx = idx1 === points2.length - 1 ? 0 : idx1 + 1;
                const pidx = idx1 === 0 ? points2.length - 1 : idx1 - 1;
                if (sharedPoints.indexOf(points2[nidx]) !== -1) {
                    face2Blacklist.push([b[0], points2[nidx]]);
                } else {
                    face2Blacklist.push([b[0], points2[pidx]]);
                }
            } else if (idx1 === -1 && idx2 !== -1) {
                const nidx = idx2 === points2.length - 1 ? 0 : idx2 + 1;
                const pidx = idx2 === 0 ? points2.length - 1 : idx2 - 1;
                if (sharedPoints.indexOf(points2[nidx]) !== -1) {
                    face2Blacklist.push([b[1], points2[nidx]]);
                } else {
                    face2Blacklist.push([b[1], points2[pidx]]);
                }
            }
        }

        face1.setEdgeBlacklist(face1Blacklist);
        face2.setEdgeBlacklist(face2Blacklist);
        this.faces.push(face1);
        this.faces.push(face2);
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

    static createHex(scale, translate) {
        const phi = (1 + Math.sqrt(5)) / 2;
        const v = [
            new Point(0, 1, phi),
            new Point(0, 1, -phi),
            new Point(0, -1, phi),
            new Point(0, -1, -phi),
            new Point(1, phi, 0),
            new Point(1, -phi, 0),
            new Point(-1, phi, 0),
            new Point(-1, -phi, 0),
            new Point(phi, 0, 1),
            new Point(phi, 0, -1),
            new Point(-phi, 0, 1),
            new Point(-phi, 0, -1)
        ];

        [],
        [],
        [],
        [],
        []
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