import { Vector } from './Vector';

class BSPTree {
    
    constructor(planes) {
        this.nodes = [];
        this.frontnodes = null;
        this.backnodes = null;
        if (planes.length == 0) {
            return;
        }

        // Hacky thing to avoid cutting planes
        let i = 0;
        for (let j = 0; j < planes.length; j++) {
            if (planes[j].getNormal().getZ() === 0) {
                i = j;
                break;
            }
        }
        if (i === planes.length) {
            i = 0;
        }

        this.nodes = [planes[i]];

        const p0 = planes[i].getPoints()[0];
        const n = planes[i].getNormal();
        const frontnodes = [];
        const backnodes = [];
        for (let j = 0; j < planes.length; j++) {
            if (j !== i) {
                let p1 = planes[j].getPoints()[0];
                let p2 = planes[j].getPoints()[2];
                let vector1 = Vector.createFromPoints(p0, p1);
                let vector2 = Vector.createFromPoints(p0, p2);
                let d1 = vector1.dot(n);
                let d2 = vector2.dot(n);
                
                if (d1 === 0 && d2 === 0) {
                    if (planes[j].getNormal().equals(n)) {
                        this.nodes.push(planes[j]);
                    } else {
                        backnodes.push(planes[j]);
                    }
                } else if (d1 <= 0 && d2 <= 0) {
                    backnodes.push(planes[j]);
                } else if (d1 >= 0 && d2 >= 0) {
                    frontnodes.push(planes[j]);
                } else {
                    throw Error('BSP should not reach this point...');
                }
            }
        }

        if (frontnodes.length > 0) {
            this.frontnodes = new BSPTree(frontnodes);
        }
        if (backnodes.length > 0) {
            this.backnodes = new BSPTree(backnodes);
        }
    }

    traverse(fn, ref) {
        if (this.nodes.length > 0) {
            const n = this.nodes[0].getNormal();
            const p = this.nodes[0].getPoints()[0];
            const viewVector = Vector.createFromPoints(ref, p);
            const ndir = viewVector.dot(n);
            if (ndir <= 0) {
                if (this.backnodes !== null) {
                    this.backnodes.traverse(fn, ref);
                }
                for (let i = 0; i < this.nodes.length; i++) {
                    fn(this.nodes[i]);
                }
                if (this.frontnodes !== null) {
                    this.frontnodes.traverse(fn, ref);
                }
            } else {
                if (this.frontnodes !== null) {
                    this.frontnodes.traverse(fn, ref);
                }
                for (let i = 0; i < this.nodes.length; i++) {
                    fn(this.nodes[i]);
                }
                if (this.backnodes !== null) {
                    this.backnodes.traverse(fn, ref);
                }
                
            }
        }
    }
}

export { BSPTree };