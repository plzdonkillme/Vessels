import { Point, Vector } from './Vector';

class Viewport {

    /*
        p1 (origin)       p2
        --------------------
        |                  |
        |                  |
        |                  |
        --------------------
        p3                p4
     */
    constructor(p1, p2, p3, p4, d=-1) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.p4 = p4;
        this.d = d;
        this.calcVectors();

        this.rates = {
            r1: 0,
            r2: 0,
            t1: 0,
            t2: 0,
            t3: 0,
        };
        this.mx = null;
        this.my = null;
    }

    projectPlane(points, n) {
        const visiblePoints = [];
        const clippedPoints = [];
        let viewVector, pointVector, pz, li, lz, ri, rz, midpoint, projected;
        let threshold = this.d;
        let visible = null;
        if (this.d === -1) {
            threshold = 0;
            visible = this.unitNormal.dot(n) < 0;
        }

        for (let i = 0; i < points.length; i++) {
            if (this.d !== -1) {
                viewVector = Vector.createFromPoints(this.p5, points[i]);
            } else {
                viewVector = Vector.createFromPoints(this.midpoint, points[i]);
            }
            pz = viewVector.dot(this.unitNormal);
            if (pz >= threshold) {
                if (visible === null) {
                    visible = viewVector.dot(n) < 0;
                }
                if (this.d === -1) {
                    pointVector = Vector.createFromPoints(this.p1, points[i]);
                } else {
                    midpoint = this.p5.midpoint(points[i], this.d / pz);
                    pointVector = Vector.createFromPoints(this.p1, midpoint);
                }
                projected = new Point(pointVector.dot(this.basis1), pointVector.dot(this.basis2), 0);
                visiblePoints.push(projected);
            } else {
                li = i == 0 ? points.length - 1 : i - 1;
                if (this.d !== -1) {
                    viewVector = Vector.createFromPoints(this.p5, points[li]);
                } else {
                    viewVector = Vector.createFromPoints(this.midpoint, points[li]);
                }
                lz = viewVector.dot(this.unitNormal);
                if (lz >= threshold) {
                    midpoint = points[i].midpoint(points[li], (threshold - pz) / (lz - pz));
                    pointVector = Vector.createFromPoints(this.p1, midpoint);
                    projected = new Point(pointVector.dot(this.basis1), pointVector.dot(this.basis2), 0);
                    visiblePoints.push(projected);
                    clippedPoints.push(projected);
                }
                ri = i == points.length - 1 ? 0 : i + 1;
                if (this.d !== -1) {
                    viewVector = Vector.createFromPoints(this.p5, points[ri]);
                } else {
                    viewVector = Vector.createFromPoints(this.midpoint, points[ri]);
                }
                rz = viewVector.dot(this.unitNormal);
                if (rz >= threshold) {
                    midpoint = points[i].midpoint(points[ri], (threshold - pz) / (rz - pz));
                    pointVector = Vector.createFromPoints(this.p1, midpoint);
                    projected = new Point(pointVector.dot(this.basis1), pointVector.dot(this.basis2), 0);
                    visiblePoints.push(projected);
                    clippedPoints.push(projected);
                }
            }
        }
        return {
            visiblePoints: visiblePoints,
            clippedPoints: clippedPoints,
            visible: visible,
        };
    }

    calcVectors() {
        this.basis1 = Vector.createFromPoints(this.p1, this.p2);
        this.width = this.basis1.mag;
        this.basis1.normalize();
        this.basis2 = Vector.createFromPoints(this.p1, this.p3);
        this.height = this.basis2.mag;
        this.basis2.normalize();
        this.unitNormal = this.basis2.cross(this.basis1);
        this.midpoint = this.p1.midpoint(this.p4, 0.5);
        if (this.d !== -1) {
            const xDist = this.unitNormal.x * this.d; 
            const yDist = this.unitNormal.y * this.d;
            const zDist = this.unitNormal.z * this.d;
            this.p5 = this.midpoint.copy()
            this.p5.translate(-xDist, -yDist, -zDist);
        }
    }

    translateAlongBasis(s1, s2, s3) {
        const xDist = this.basis1.x * s1 + this.basis2.x * s2 + this.unitNormal.x * s3;
        const yDist = this.basis1.y * s1 + this.basis2.y * s2 + this.unitNormal.y * s3;
        const zDist = this.basis1.z * s1 + this.basis2.z * s2 + this.unitNormal.z * s3;
        this.translate(xDist, yDist, zDist);
    }

    translate(x, y, z, calc=true) {
        this.p1.translate(x, y, z);
        this.p2.translate(x, y, z);
        this.p3.translate(x, y, z);
        this.p4.translate(x, y, z);
        if (calc) {
            this.calcVectors();
        }
    }

    rotateByBasis(theta1, theta2, theta3) {
        const xDist = this.midpoint.getX();
        const yDist = this.midpoint.getY();
        const zDist = this.midpoint.getZ();
        const rad1 = theta1 / 360 * Math.PI;
        const rad2 = theta2 / 360 * Math.PI;
        const rad3 = theta3 / 360 * Math.PI;

        this.translate(-xDist, -yDist, -zDist, false);
        this.p1.rotate(this.basis1, rad1);
        this.p1.rotate(this.basis2, rad2);
        this.p1.rotate(this.unitNormal, rad3);
        this.p2.rotate(this.basis1, rad1);
        this.p2.rotate(this.basis2, rad2);
        this.p2.rotate(this.unitNormal, rad3);
        this.p3.rotate(this.basis1, rad1);
        this.p3.rotate(this.basis2, rad2);
        this.p3.rotate(this.unitNormal, rad3);
        this.p4.rotate(this.basis1, rad1);
        this.p4.rotate(this.basis2, rad2);
        this.p4.rotate(this.unitNormal, rad3);
        this.translate(xDist, yDist, zDist, true);
    }

    updatePosition() {
        if (this.rates.r1 || this.rates.r2) {
            this.rotateByBasis(this.rates.r1, this.rates.r2, 0);
        }
        if (this.rates.t1 || this.rates.t2 || this.rates.t3) {
            this.translateAlongBasis(this.rates.t1, this.rates.t2, this.rates.t3);
        }
    }

    updateRates(rates) {
        this.rates.r1 += (rates.r1 || 0);
        this.rates.r2 += (rates.r2 || 0);
        this.rates.t1 += (rates.t1 || 0);
        this.rates.t2 += (rates.t2 || 0);
        this.rates.t3 += (rates.t3 || 0);
    }

    setMouse(x, y) {
        this.mx = x;
        this.my = y;
    }

    mouseInside(points) {
        if (this.mx === null && this.my === null) {
            return false;
        }
        let zPos = null;
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            const np = i === points.length - 1 ? points[0] : points[i + 1];
            const v1 = {
                x: np.getX() - p.getX(),
                y: np.getY() - p.getY(),
            };
            const v2 = {
                x: this.mx - p.getX(),
                y: this.my - p.getY(),
            };
            const cross = (v1.x * v2.y) - (v1.y * v2.x);
            if (zPos === null) {
                zPos = cross > 0;
            } else if ((cross > 0) !== zPos) {
                return false;
            }
        }
        return true;
    }

    getReference() {
        if (this.d === -1) {
            return this.midpoint;
        } else {
            return this.p5;
        }
    }
}

/*
class Viewport {

    /*
        p1 (origin)       p2
        --------------------
        |                  |
        |                  |
        |                  |
        --------------------
        p3                p4
     *//*
    constructor(p1, p2, p3 ,p4, d=-1) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.p4 = p4;
        this.d = d;
        this.p5 = null;
        this.calcBasis1();
        this.calcBasis2();
        this.calcUnitNormal();
        this.calcFocalPoint();
        const wx = p2.x - p1.x;
        const wy = p2.y - p1.y;
        const wz = p2.z - p2.z;
        this.width = Math.sqrt(wx * wx + wy * wy + wz * wz);
        const hx = p3.x - p1.x;
        const hy = p3.y - p1.y;
        const hz = p3.z - p1.z;
        this.height = Math.sqrt(hx * hx + hy * hy + hz * hz);
        this.rates = {
            r1: 0,
            r2: 0,
            t1: 0,
            t2: 0,
            t3: 0,
        };
        this.mx = null;
        this.my = null;
    }

    dot(p1, p2) {
        return p1.x * p2.x + p1.y * p2.y + p1.z * p2.z;
    }

    projectPlane(plane) {
        const n = plane.n;
        const points = plane.points;
        const visiblePoints = [];
        const clippedPoints = [];
        let normalCheck = null;
        let pz, lpz, rpz, midpoint, projected;
        for (let i = 0; i < points.length; i++) {
            pz = this.dot(points[i], this.unitNormal) - this.dot(this.p1, this.unitNormal);
            if (pz >= 0) {
                if (normalCheck === null) {
                    normalCheck = this.dot({
                        x: points[i].x - this.p5.x,
                        y: points[i].y - this.p5.y,
                        z: points[i].z - this.p5.z,
                    }, n);
                }
                projected = this.projectPoint(points[i]);
                visiblePoints.push(projected);
            } else {
                let li = i == 0 ? points.length - 1 : i - 1;
                lpz = this.dot(points[li], this.unitNormal) - this.dot(this.p1, this.unitNormal);
                if (lpz > 0) {
                    midpoint = {
                        x: lpz / (lpz - pz) * points[i].x - pz / (lpz - pz) * points[li].x,
                        y: lpz / (lpz - pz) * points[i].y - pz / (lpz - pz) * points[li].y,
                        z: lpz / (lpz - pz) * points[i].z - pz / (lpz - pz) * points[li].z,
                    };
                    projected = this.projectPoint(midpoint);
                    visiblePoints.push(projected);
                    clippedPoints.push(projected);
                }
                let ri = i == points.length - 1 ? 0 : i + 1;
                rpz = this.dot(points[ri], this.unitNormal) - this.dot(this.p1, this.unitNormal);
                if (rpz > 0) {
                    midpoint = {
                        x: rpz / (rpz - pz) * points[i].x - pz / (rpz - pz) * points[ri].x,
                        y: rpz / (rpz - pz) * points[i].y - pz / (rpz - pz) * points[ri].y,
                        z: rpz / (rpz - pz) * points[i].z - pz / (rpz - pz) * points[ri].z,
                    };
                    projected = this.projectPoint(midpoint);
                    visiblePoints.push(projected);
                    clippedPoints.push(projected);
                }
            }
        }
        return {
            n: n,
            points: points,
            visiblePoints: visiblePoints,
            clippedPoints: clippedPoints,
            visible: normalCheck !== null && normalCheck <= 0,
        };
    }

    projectPoint(point) {
        if (this.d == -1) {
            return {
                x: this.dot(point, this.basis1) - this.dot(this.p1, this.basis1),
                y: this.dot(point, this.basis2) - this.dot(this.p1, this.basis2),
                z: this.dot(point, this.unitNormal) - this.dot(this.p1, this.unitNormal),
            };
        } else {
            const px = this.dot(point, this.basis1) - this.dot(this.p1, this.basis1);
            const py = this.dot(point, this.basis2) - this.dot(this.p1, this.basis2);
            const pz = this.dot(point, this.unitNormal) - this.dot(this.p1, this.unitNormal);
            return {
                x: (this.width / 2 - px) / (1 + this.d / pz) + px,
                y: (this.height / 2 - py) / (1 + this.d / pz) + py,
                z: pz,
            };
        }
    }

    calcFocalPoint() {
        if (this.d !== -1) {
            const cx = (this.p1.x + this.p4.x) / 2;
            const cy = (this.p1.y + this.p4.y) / 2;
            const cz = (this.p1.z + this.p4.z) / 2;
            this.p5 = {
                x: cx - this.d * this.unitNormal.x,
                y: cy - this.d * this.unitNormal.y,
                z: cz - this.d * this.unitNormal.z,
            };
        }
    }

    calcBasis1() {
        const bx = this.p2.x - this.p1.x;
        const by = this.p2.y - this.p1.y;
        const bz = this.p2.z - this.p1.z;
        const mag = Math.sqrt(bx * bx + by * by + bz * bz);
        this.basis1 = {
            x: bx / mag,
            y: by / mag,
            z: bz / mag,
        };
    }

    calcBasis2() {
        const bx = this.p3.x - this.p1.x;
        const by = this.p3.y - this.p1.y;
        const bz = this.p3.z - this.p1.z;
        const mag = Math.sqrt(bx * bx + by * by + bz * bz);
        this.basis2 = {
            x: bx / mag,
            y: by / mag,
            z: bz / mag,
        };
    }

    // Basis 
    calcUnitNormal() {
        this.unitNormal = {
            x: this.basis2.y * this.basis1.z - this.basis2.z * this.basis1.y,
            y: this.basis2.z * this.basis1.x - this.basis2.x * this.basis1.z,
            z: this.basis2.x * this.basis1.y - this.basis2.y * this.basis1.x,
        };
    };

    translateAlongBasis(scalar1, scalar2, scalar3) {
        this.translate({
            x: this.basis1.x * scalar1 + this.basis2.x * scalar2 + this.unitNormal.x * scalar3,
            y: this.basis1.y * scalar1 + this.basis2.y * scalar2 + this.unitNormal.y * scalar3,
            z: this.basis1.z * scalar1 + this.basis2.z * scalar2 + this.unitNormal.z * scalar3,
        });
    }

    translate(a) {
        this.p1 = this.translatePoint(this.p1, a);
        this.p2 = this.translatePoint(this.p2, a);
        this.p3 = this.translatePoint(this.p3, a);
        this.p4 = this.translatePoint(this.p4, a);
        this.calcBasis1();
        this.calcBasis2();
        this.calcUnitNormal();
        this.calcFocalPoint();
    }

    translatePoint(p, a) {
        return {
            x: p.x + a.x,
            y: p.y + a.y,
            z: p.z + a.z,
        };
    }

    rotateByBasis1(theta) {
        let mx, my, mz;
        if (this.d !== -1) {
            mx = this.p5.x;
            my = this.p5.y;
            mz = this.p5.z;
        } else {
            mx = (this.p1.x + this.p4.x) / 2;
            my = (this.p1.y + this.p4.y) / 2;
            mz = (this.p1.z + this.p4.z) / 2;
        }
        this.translate({
            x: -mx,
            y: -my,
            z: -mz,
        });
        this.rotate(this.basis1, theta);
        this.translate({
            x: mx,
            y: my,
            z: mz,
        });
    }

    rotateByBasis2(theta) {
        let mx, my, mz;
        if (this.d !== -1) {
            mx = this.p5.x;
            my = this.p5.y;
            mz = this.p5.z;
        } else {
            mx = (this.p1.x + this.p4.x) / 2;
            my = (this.p1.y + this.p4.y) / 2;
            mz = (this.p1.z + this.p4.z) / 2;
        }
        this.translate({
            x: -mx,
            y: -my,
            z: -mz,
        });
        this.rotate(this.basis2, theta);
        this.translate({
            x: mx,
            y: my,
            z: mz,
        });
    }

    rotate(axis, theta) {
        const mag = Math.sqrt(this.dot(axis, axis));
        const normAxis = {
            x: axis.x / mag,
            y: axis.y / mag,
            z: axis.z / mag,
        };
        const rad = theta / 360 * Math.PI;
        this.p1 = this.rotatePoint(this.p1, normAxis, rad);
        this.p2 = this.rotatePoint(this.p2, normAxis, rad);
        this.p3 = this.rotatePoint(this.p3, normAxis, rad);
        this.p4 = this.rotatePoint(this.p4, normAxis, rad);
        this.calcBasis1();
        this.calcBasis2();
        this.calcUnitNormal();
        this.calcFocalPoint();
    }

    // Axis must be unit, Theta must be radians.
    rotatePoint(p, ax, rad) {
        const cost = Math.cos(rad);
        const sint = Math.sin(rad);
        const mcost = 1 - cost;
        const dot = this.dot(ax, p);
        return {
            x: p.x * cost + (ax.y * p.z - ax.z * p.y) * sint + ax.x * dot * mcost,
            y: p.y * cost + (ax.z * p.x - ax.x * p.z) * sint + ax.y * dot * mcost,
            z: p.z * cost + (ax.x * p.y - ax.y * p.x) * sint + ax.z * dot * mcost,
        };
    }

    updatePosition() {
        if (this.rates.r1 !== 0) {
            this.rotateByBasis1(this.rates.r1);
        }
        if (this.rates.r2 !== 0) {
            this.rotateByBasis2(this.rates.r2);
        }
        if (this.rates.t1 || this.rates.t2 || this.rates.t3) {
            this.translateAlongBasis(this.rates.t1, this.rates.t2, this.rates.t3);
        }
    }

    updateRates(rates) {
        this.rates.r1 += (rates.r1 || 0);
        this.rates.r2 += (rates.r2 || 0);
        this.rates.t1 += (rates.t1 || 0);
        this.rates.t2 += (rates.t2 || 0);
        this.rates.t3 += (rates.t3 || 0);
    }

    setMouse(x, y) {
        this.mx = x;
        this.my = y;
    }

    mouseInside(face) {
        if (this.mx === null && this.my === null) {
            return false;
        }
        let zPos = null;
        for (let i = 0; i < face.visiblePoints.length; i++) {
            const p = face.visiblePoints[i];
            const np = i === face.visiblePoints.length - 1 ? face.visiblePoints[0] : face.visiblePoints[i + 1];
            const v1 = {
                x: np.x - p.x,
                y: np.y - p.y,
            };
            const v2 = {
                x: this.mx - p.x,
                y: this.my - p.y,
            };
            const cross = (v1.x * v2.y) - (v1.y * v2.x);
            if (zPos === null) {
                zPos = cross > 0;
            } else if ((cross > 0) !== zPos) {
                return false;
            }
        }
        return true;
    }
}*/

export { Viewport };