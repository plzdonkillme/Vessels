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

    equals(p) {
        return this.x === p.getX() && this.y === p.getY() && this.z === p.getZ();
    }
}

class Vector {

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.mag = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    static createFromPoints(p1, p2) {
        return new Vector(p2.getX() - p1.getX(), p2.getY() - p1.getY(), p2.getZ() - p1.getZ());
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

    getMag() {
        return this.mag;
    }

    normalize() {
        this.x = this.x / this.mag;
        this.y = this.y / this.mag;
        this.z = this.z / this.mag;
        this.mag = 1;
    }

    cross(v) {
        const vx = v.getX();
        const vy = v.getY();
        const vz = v.getZ();
        const x = this.y * vz - this.z * vy;
        const y = this.z * vx - this.x * vz;
        const z = this.x * vy - this.y * vx;
        return new Vector(x, y, z);
    }

    dot(v) {
        return this.x * v.getX() + this.y * v.getY() + this.z * v.getZ();
    }

    equals(v) {
        return this.x === v.getX() && this.y === v.getY() && this.z === v.getZ();
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
}

export { Point, Vector };