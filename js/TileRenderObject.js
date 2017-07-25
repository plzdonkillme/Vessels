import { Point, Vector } from "./Vector";

const TLEN = 100;

class TileRenderObject {
    
    constructor(tile) {
        this.tile = tile;
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
        const v = this.vertices;
        this.faces = [
            new TileFace(this, [v[0], v[1], v[2], v[3]], new Vector(0, 0, 1)),
            new TileFace(this, [v[1], v[2], v[6], v[5]], new Vector(1, 0, 0)),
            new TileFace(this, [v[4], v[5], v[6], v[7]], new Vector(0, 0, -1)),
            new TileFace(this, [v[0], v[1], v[5], v[4]], new Vector(0, -1, 0)),
            new TileFace(this, [v[0], v[3], v[7], v[4]], new Vector(-1, 0, 0)),
            new TileFace(this, [v[2], v[3], v[7], v[6]], new Vector(0, 1, 0))
        ];
        this.clippedFace = null;
        this.hover = false;

        const mObj = this.tile.getMapObject();
        if (mObj !== null) {
            const mPoint = this.getMapObjectPoint();
            const mapObjectFace = new MapObjectFace(mObj, mPoint, this);
            this.setMapObjectFace(mapObjectFace);
        }
    }

    getTile() {
        return this.tile;
    }

    getHover() {
        return this.hover;
    }

    getHighlight() {
        return this.tile.isHighlighted();
    }

    toggleHover() {
        this.hover = !this.hover;
    }

    getVertices() {
        return this.vertices;
    }

    getFaces() {
        return this.faces;
    }

    getMapObjectFace() {
        return this.faces[0].getMapObjectFace();
    }

    setMapObjectFace(mapObjectFace) {
        this.faces[0].setMapObjectFace(mapObjectFace);
    }

    getMapObjectPoint() {
        const tx = this.tile.getX() * TLEN;
        const ty = this.tile.getY() * TLEN;
        const tz = this.tile.getH() * TLEN;
        return new Point(tx + TLEN / 2, ty + TLEN / 2, tz);
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
            this.clippedFace = new TileFace(this, newFacePoints);
            this.clippedFace.setVisiblePoints(newFacePoints);
        } else {
            this.clippedFace = null;
        }
    }

    getClippedFace() {
        return this.clippedFace;
    }
}

class TileFace {

    constructor(tileRenderObject, points, normal=null) {
        this.tileRenderObject = tileRenderObject;
        this.points = points;
        this.normal = normal;
        this.visiblePoints = [];
        this.clippedPoints = [];
        this.mapObjectFace = null;
    }

    getTileRenderObject() {
        return this.tileRenderObject;
    }

    getMapObjectFace() {
        return this.mapObjectFace;
    }

    setMapObjectFace(face) {
        this.mapObjectFace = face;
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

    getVisiblePoints() {
        return this.visiblePoints;
    }

    setClippedPoints(points) {
        this.clippedPoints = points;
    }

    getClippedPoints(points) {
        return this.clippedPoints;
    }

    draw(ctx) {
        if (this.tileRenderObject.getHover()) {
            if (this.tileRenderObject.getHighlight()) {
                ctx.fillStyle = "#80BFFF";
            } else {
                ctx.fillStyle = "#E6E6E6";
            }
        } else {
            if (this.tileRenderObject.getHighlight()) {
                ctx.fillStyle = "#0080FF";
            } else {
                ctx.fillStyle = "#CCCCCC";
            }
        }
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

class MapObjectFace {

    constructor(mapObject, mPoint, tileRenderObject) {
        this.mapObject = mapObject;
        this.bottomPoint = mPoint;
        this.topPoint = mPoint.copy();
        this.topPoint.translate(0, 0, 100);
        this.calcTopVector();
        this.projectedTop = null;
        this.projectedBottom = null;

        const orientation = mapObject.getOrientation();
        if (orientation === 'u') {
            this.orientationAngle = 3 * Math.PI / 2;
        } else if (orientation === 'r') {
            this.orientationAngle = 0;
        } else if (orientation === 'd') {
            this.orientationAngle = Math.PI / 2;
        } else if (orientation === 'l') {
            this.orientationAngle = Math.PI;
        }

        this.viewDir = null;
        this.viewAngle = null;
        this.animation = null;
        this.tileRenderObject = tileRenderObject;
    }

    animate(animation) {
        return new Promise((resolve, reject) => {
            animation.resolve = resolve;
            this.animation = animation;
        });
    }

    // endpoint, number of frames
    updatePosition() {
        if (this.animation !== null) {
            if (this.animation.rate === null) {
                this.animation.rate = {
                    x: (this.animation.endpoint.getX() - this.bottomPoint.getX()) / this.animation.frames,
                    y: (this.animation.endpoint.getY() - this.bottomPoint.getY()) / this.animation.frames,
                    z: (this.animation.endpoint.getZ() - this.bottomPoint.getZ()) / this.animation.frames,
                }
            }
            const dx = this.animation.rate.x;
            const dy = this.animation.rate.y;
            const dz = this.animation.rate.z;
            this.bottomPoint.translate(dx, dy, dz);
            this.topPoint.translate(dx, dy, dz);
            this.animation.frames -= 1;
            if (this.animation.frames === 0) {
                this.animation.resolve();
                this.animation = null;
            }
        }
    }

    calcTopVector() {
        this.topVector = Vector.createFromPoints(this.bottomPoint, this.topPoint);
        this.topVector.normalize();
    }

    getBottomPoint() {
        return this.bottomPoint;
    }

    getTopPoint() {
        return this.topPoint;
    }

    getTopVector() {
        return this.topVector;
    }

    getMapObject() {
        return this.mapObject;
    }

    getTileRenderObject() {
        return this.tileRenderObject;
    }

    setTileRenderObject(tileRenderObject) {
        this.tileRenderObject.setMapObjectFace(null);
        this.tileRenderObject = tileRenderObject;
        this.tileRenderObject.setMapObjectFace(this);
    }

    setProjectedTop(point) {
        this.projectedTop = point;
    }

    setProjectedBottom(point) {
        this.projectedBottom = point;
    }

    setViewDir(dir) {
        this.viewDir = dir;
    }

    setViewAngle(angle) {
        this.viewAngle = angle;
    }

    draw(ctx) {
        ctx.strokeStyle = "#000000";
        ctx.beginPath();
        ctx.moveTo(this.projectedBottom.getX(), this.projectedBottom.getY());
        ctx.lineTo(this.projectedTop.getX(), this.projectedTop.getY());
        ctx.stroke();

        let image = document.getElementById('gray');
        let needOffset = false;

        if (this.viewDir === 'towards') {

            let rad = this.viewAngle - this.orientationAngle;
            if (rad < 0){
                rad += 2 * Math.PI;
            }
            //debugger;
            if (rad <= Math.PI / 8 || rad > 15 * Math.PI / 8) {
                image = document.getElementById('s');
            } else if (rad > Math.PI / 8 && rad <= 3 * Math.PI / 8) {
                image = document.getElementById('se');
                needOffset = true;
            } else if (rad > 3 * Math.PI / 8 && rad <= 5 * Math.PI / 8) {
                image = document.getElementById('e');
            } else if (rad > 5 * Math.PI / 8 && rad <= 7 * Math.PI / 8 ) {
                image = document.getElementById('ne');
                needOffset = true;
            } else if (rad > 7 * Math.PI / 8 && rad <= 9 * Math.PI / 8 ) {
                image = document.getElementById('n');
            } else if (rad > 9 * Math.PI / 8 && rad <= 11 * Math.PI / 8 ) {
                image = document.getElementById('nw');
                needOffset = true;
            } else if (rad > 11 * Math.PI / 8 && rad <= 13 * Math.PI / 8 ) {
                image = document.getElementById('w');
            } else if (rad > 13 * Math.PI / 8 && rad <= 15 * Math.PI / 8 ) {
                image = document.getElementById('sw');
                needOffset = true;
            }
        }

        const x = this.projectedBottom.getX();
        const y = this.projectedBottom.getY();
        const nw = image.naturalWidth;
        const nh = image.naturalHeight;

        const angleVector = Vector.createFromPoints(this.projectedBottom, this.projectedTop);
        const scaledh = angleVector.getMag();
        const scaledw = nw * scaledh / nh;
        const angle = Math.atan(-angleVector.getY() / angleVector.getX());

        ctx.translate(x, y);
        if (angleVector.getX() > 0) {
            ctx.rotate(-angle + Math.PI / 2);
        } else {
            ctx.rotate(Math.PI - angle + Math.PI / 2);
        }

        let offsetX = -(scaledw / 2);
        let offsetY = -scaledh;
        if (needOffset) {
            offsetX -= scaledw * 1 / 12;
            offsetY += scaledh * 1 / 12;
        }
        ctx.drawImage(image, 0, 0, nw, nh, offsetX, offsetY, scaledw, scaledh);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

}

export { TileRenderObject };