import { Point, Vector } from "./Vector";

const TLEN = 100;

class TileRenderObject {
    
    constructor(tile) {
        const tx = tile.getX() * TLEN;
        const ty = tile.getY() * TLEN;
        const tz = tile.getH() * TLEN;
        this.vertices = [
            new Point(tx, ty, tz),
            new Point(tx + TLEN, ty, tz),
            new Point(tx + TLEN, ty + TLEN, tz),
            new Point(tx, ty + TLEN, tz),
            new Point(tx, ty, 0),
            new Point(tx + TLEN, ty, 0),
            new Point(tx + TLEN, ty + TLEN, 0),
            new Point(tx, ty + TLEN, 0)
        ];
        this.faces = [
            new TileFace(this, [0, 1, 2, 3], new Vector(0, 0, 1)),
            new TileFace(this, [1, 2, 6, 5], new Vector(1, 0, 0)),
            new TileFace(this, [4, 5, 6, 7], new Vector(0, 0, -1)),
            new TileFace(this, [0, 1, 5, 4], new Vector(0, -1, 0)),
            new TileFace(this, [0, 3, 7, 4], new Vector(-1, 0, 0)),
            new TileFace(this, [2, 3, 7, 6], new Vector(0, 1, 0))
        ]
    }

    getVertices() {
        return this.vertices;
    }

    getFaces() {
        return this.faces;
    }
}

class TileFace {

    constructor(tileRenderObject, vi, normal) {
        this.tileRenderObject = tileRenderObject;
        const v = tileRenderObject.getVertices();
        this.points = [v[vi[0]], v[vi[1]], v[vi[2]], v[vi[3]]];
        this.normal = normal;
        this.visiblePoints = [];
        this.clippedPoints = [];
    }

    getNormal() {
        return this.normal;
    }

    getPoints() {
        return this.points;
    }

    setVisiblePoints(points) {
        this.visiblePoints = points;
    }

    setClippedPoints(points) {
        this.clippedPoints = points;
    }

    draw(ctx) {
        ctx.fillStyle = "#CCCCCC";
        ctx.beginPath();
        for (let k = 0; k < this.visiblePoints.length; k++) {
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
        ctx.strokeStyle = "#000000";
        ctx.beginPath();
        for (let k = 0; k < this.visiblePoints.length; k++) {
            if (k == 0) {
                ctx.moveTo(this.visiblePoints[k].getX(), this.visiblePoints[k].getY());
            }
            if (k == this.visiblePoints.length - 1) {
                ctx.lineTo(this.visiblePoints[0].getX(), this.visiblePoints[0].getY());
            } else {
                ctx.lineTo(this.visiblePoints[k + 1].getX(), this.visiblePoints[k + 1].getY());
            }
        }
        ctx.stroke();
    }
}

export { TileRenderObject };