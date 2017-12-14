import { Point } from './Vector';

class QudraticBezier {

    constructor(p0, p1, p2) {
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
    }

    evaluate(t) {
        const x = (1 - t) * (1 - t) * this.p0.getX() + 2 * (1 - t) * t * this.p1.getX() + t * t * this.p2.getX();
        const y = (1 - t) * (1 - t) * this.p0.getY() + 2 * (1 - t) * t * this.p1.getY() + t * t * this.p2.getY();
        const z = (1 - t) * (1 - t) * this.p0.getZ() + 2 * (1 - t) * t * this.p1.getZ() + t * t * this.p2.getZ();
        return new Point(x ,y ,z);
    }
}

export { QudraticBezier }