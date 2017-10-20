import { Vector } from './Vector';

class BSPTree {
    
    constructor(faces) {
        this.nodes = [];
        this.front = null;
        this.back = null;
        if (faces.length == 0) {
            return;
        }

        this.nodes = [faces[0]];
        const p0 = faces[0].getPoints()[0];
        const n = faces[0].getNormal();
        const frontFaces = [];
        const backFaces = [];

        for (let i = 1; i < faces.length; i++) {
            let pos;
            let cut = false;
            const frontPoints = [];
            const backPoints = [];
            const points = faces[i].getPoints();

            //Get initial pos
            const lastD = Vector.createFromPoints(p0, points[points.length - 1]).dot(n);
            if (lastD === 0) {
                pos = null;
            } else if (lastD > 0) {
                pos = 'front';
            } else {
                pos = 'back';
            }

            // Iterate over points
            for (let j = 0; j < points.length; j++) {
                const p = points[j];
                const d = Vector.createFromPoints(p0, p).dot(n);
                if (d === 0) {
                    pos = null;
                    frontPoints.push(p);
                    backPoints.push(p);
                } else if (d > 0) {
                    if (pos === 'back') {
                        const prevP = j === 0 ? points[points.length - 1] : points[j - 1];
                        const prevD = Vector.createFromPoints(p0, prevP).dot(n);
                        const mid = p.midpoint(prevP, d / (d - prevD));
                        frontPoints.push(mid);
                        backPoints.push(mid);
                        cut = true;
                    }
                    frontPoints.push(p);
                    pos = 'front';
                } else {
                    if (pos === 'front') {
                        const prevP = j === 0 ? points[points.length - 1] : points[j - 1];
                        const prevD = Vector.createFromPoints(p0, prevP).dot(n);
                        const mid = p.midpoint(prevP, d / (d - prevD));
                        frontPoints.push(mid);
                        backPoints.push(mid);
                        cut = true;
                    }
                    backPoints.push(p);
                    pos = 'back';
                }
            }

            if (cut) {
                // Split a face...
                const { face1, face2 } = faces[i].getPolygon().splitFace(faces[i], frontPoints, backPoints);
                frontFaces.push(face1);
                backFaces.push(face2);
            } else {
                if (frontPoints.length === points.length && backPoints.length === points.length) {
                    this.nodes.push(faces[i]);
                } else if (frontPoints.length === points.length) {
                    frontFaces.push(faces[i]);
                } else {
                    backFaces.push(faces[i]);
                }
            }
        }

        if (frontFaces.length > 0) {
            this.front = new BSPTree(frontFaces);
        }
        if (backFaces.length > 0) {
            this.back = new BSPTree(backFaces);
        }
    }

    traverse(fn, viewport) {
        if (this.nodes.length > 0) {
            const n = this.nodes[0].getNormal();
            const p = this.nodes[0].getPoints()[0];
            const viewDir = viewport.getViewDir(p, n);
            if (viewDir === 'towards') {
                if (this.back !== null) {
                    this.back.traverse(fn, viewport);
                }
                for (let i = 0; i < this.nodes.length; i++) {
                    fn(this.nodes[i]);
                }
                if (this.front !== null) {
                    this.front.traverse(fn, viewport);
                }
            } else {
                if (this.front !== null) {
                    this.front.traverse(fn, viewport);
                }
                for (let i = 0; i < this.nodes.length; i++) {
                    fn(this.nodes[i]);
                }
                if (this.back !== null) {
                    this.back.traverse(fn, viewport);
                }
                
            }
        }
    }
}

export { BSPTree };