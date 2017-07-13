import { Tile, PlainTile, EmptyTile } from "./Tile";
import { BSPTree } from "./BSPTree";

class Map {

    constructor(tiles, mapObjects) {
        this.tiles = tiles
        this.mapObjects = mapObjects;
        this.actors = mapObjects.filter(m => m.isActor());

        this.TICK_THRESHOLD = 100;

        // Priority Queue of actors. Format is [[actor, ticks]]
        this.turnQueue = [];

        for (let i = 0; i < this.actors.length; i++) {
            const ticks = this.actors[i].getTicks();
            if (ticks > this.TICK_THRESHOLD) {
                let idx = this.turnQueue.length;
                for (let j = 0; j < this.turnQueue.length; j++) {
                    if (this.turnQueue[j][1] > ticks) {
                        idx = j;
                        break;
                    }
                }
                this.turnQueue.splice(idx, 0, [this.actors[i], ticks]);
            }
        }
        if (this.turnQueue.length > 0) {
            this.turnActor = this.turnQueue[this.turnQueue.length - 1][0];
        } else {
            this.turnActor = null;
        };
    }

    getTilesFlattened() {
        let flattenedArray = [];
        this.tiles.forEach((row) => {
            flattenedArray = flattenedArray.concat(row);
        });
        return flattenedArray;
    }

    getTiles() {
        return this.tiles;
    }

    getMapObjects() {
        return this.mapObjects;
    }

    //TODO: Implement Map Objective Functions
    isResolved() {
        return false;
    }

    clicked(objs) {
        let rerender = false;
        for (let i = 0; i < objs.length; i++) {
            const obj = objs[i];
            if (obj instanceof MapObject) {
                //this.setSelection(obj);
                //rerender = true;
            } else if (obj instanceof Tile) {
                if (obj.isHighlighted()) {
                    this.turnActor.moveTo(obj);
                    rerender = true;
                }
            }
        }
        return rerender;
    }

    serialize() {
        const serializer = new MapSerializer();
        return serializer.serialize(this);
    }

    nextTurn() {
        if (this.turnActor !== null) {
            this.turnQueue.pop();
            this.turnActor.subtractTicks(this.TICK_THRESHOLD);
        }
        while (this.turnQueue.length === 0) {
            for (let i = 0; i < this.actors.length; i++) {
                this.actors[i].tickForward();
                const ticks = this.actors[i].getTicks();
                if (ticks > this.TICK_THRESHOLD) {
                    let idx = this.turnQueue.length;
                    for (let j = 0; j < this.turnQueue.length; j++) {
                        if (this.turnQueue[j][1] > ticks) {
                            idx = j;
                            break;
                        }
                    }
                    this.turnQueue.splice(idx, 0, [this.actors[i], ticks]);
                }
            }
        }
        this.turnActor = this.turnQueue[this.turnQueue.length - 1][0];
        return this.turnActor;
    }
}

class MapSerializer {
    constructor() {
        this.classNameToString = {
            'Plain' : 'p',
            'Empty' : 'e',
            'Knight' : 'k',
        }
        this.stringToClass = {
            'p': PlainTile,
            'e': EmptyTile,
            'k': Knight,
        }
    }

    serialize(map) {
        let mapString = '';
        const tiles = map.getTiles();
        for (let i = 0; i < tiles.length; i++) {
            const tileRow = tiles[i];
            for (let j = 0; j < tileRow.length; j++) {
                const tile = tileRow[j];
                const tileString = `${this.classNameToString[tile.getClassName()]}-${tile.getH()}`;
                mapString += tileString;
                if (j !== tileRow.length - 1) {
                    mapString += ' ';
                }
            }
            mapString += '\n';
        }
        mapString += '===\n';
        const mapObjects = map.getMapObjects();
        for (let i = 0; i < mapObjects.length; i++) {
            const mapObject = mapObjects[i];
            const mapObjectString = `${this.classNameToString[mapObject.getClassName()]}-${mapObject.serialize()}`;
            mapString += mapObjectString;
            if (i !== mapObjects.length - 1) {
                mapString += '\n';
            }
        }
        return mapString;
    }

    deserialize(mapString) {
        const splitString = mapString.split('\n===\n');
        const tileArrayString = splitString[0];
        const mapObjectArrayString = splitString[1];
        const tiles = [];
        const tileRowStrings = tileArrayString.split('\n');
        for (let y = 0; y < tileRowStrings.length; y++) {
            const tileRow = [];
            const tileStrings = tileRowStrings[y].split(' ');
            for (let x = 0; x < tileStrings.length; x++) {
                const props = tileStrings[x].split('-');
                const tileClass = this.stringToClass[props[0]];
                const tile = new tileClass(x, y, props[1]);

                if (x > 0) {
                    tile.link('left', tileRow[x - 1]);
                    tileRow[x - 1].link('right', tile);
                }
                if (y > 0) {
                    tile.link('top', tiles[y - 1][x]);
                    tiles[y - 1][x].link('down', tile);
                }
                tileRow.push(tile);
            }
            tiles.push(tileRow);
        }
        const mapObjects = [];
        const mapObjectStrings = mapObjectArrayString.split('\n');
        for (let i = 0; i < mapObjectStrings.length; i++) {
            const props = mapObjectStrings[i].split('-');
            const classString = props[0];
            const attrString = props.slice(1, props.length).join('-');
            const mapObjectClass = this.stringToClass[props[0]];
            const mapObject = mapObjectClass.deserialize(attrString);
            mapObjects.push(mapObject);
        }
        for (let i = 0; i < mapObjects.length; i++) {
            mapObjects[i].setReferences(tiles, mapObjects);
        }
        return new Map(tiles, mapObjects);
    }
}

class MapObject {

    getClassName() {
        return 'MapObject';
    }

    constructor(attributes) {
        this.tile = null;
        this.x = attributes.x;
        this.y = attributes.y;
        this.highlighted = false;
    }

    getTile() {
        return this.tile;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    isHighlighted() {
        return this.highlighted;
    }

    setHighlight(h) {
        this.highlighted = h;
    }

    moveTo(tile) {
        this.tile.unsetMapObject(this);
        tile.setMapObject(this);
        this.tile = tile;
        this.x = tile.getX();
        this.y = tile.getY();
    }

    isActor() {
        return false;
    }

    serialize() {
        return `${this.x}-${this.getY()}`;
    }

    static parseAttributes(attrString) {
        const attrSplit = attrString.split('-');
        const attr = {
            x: parseInt(attrSplit[0]),
            y: parseInt(attrSplit[1]),
        };
        return attr;
    }

    static deserialize(attrString) {
        return new this(this.parseAttributes(attrString));
    }

    setReferences(tiles, mapObjects) {
        this.tile = tiles[this.y][this.x];
        this.tile.setMapObject(this);
    }
}

class Actor extends MapObject {

    constructor(attributes) {
        super(attributes);
        this.ticks = attributes.ticks;
        this.tickAmount = attributes.tickAmount;
    }

    getTicks() {
        return this.ticks;
    }

    getTickAmount() {
        return this.tickAmount;
    }

    tickForward() {
        this.ticks += this.tickAmount;
    }

    subtractTicks(amt) {
        this.ticks -= amt;
    }

    isActor() {
        return true;
    }

    takeTurn() {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    serialize() {
        return `${super.serialize()}-${this.ticks}-${this.tickAmount}`;
    }

    static parseAttributes(attrString) {
        const attrSplit = attrString.split('-');
        const parAttrString = attrSplit.slice(0, attrSplit.length - 2).join('-');
        const attr = super.parseAttributes(parAttrString);
        attr.ticks = parseInt(attrSplit[attrSplit.length - 2]);
        attr.tickAmount = parseInt(attrSplit[attrSplit.length - 1]);
        return attr;
    }
}

class Knight extends Actor {

    getClassName() {
        return 'Knight';
    }

    constructor(attributes) {
        super(attributes);

        //attributes
        // HP
        // MP
        // Speed
        // Skill Points
        // Attack
        // Defense
        // 
        this.turnResolve = function() {
            throw Error('Called turnResolve() before it was set');
        };
    }

    takeTurn() {
        this.setHighlight(true);
        this.tile.changeNeighbors(2, true, (tile) => {
            return tile.getMapObject() == null;
        });
        return new Promise((resolve, reject) => {
            this.turnResolve = resolve;
        });
    }

    moveTo(tile) {
        this.setHighlight(false);
        this.tile.changeNeighbors(2, false);
        super.moveTo(tile);
        this.turnResolve();
    }
}

class MapScreen {

    constructor(canvas, map) {
        this.canvas = canvas;
        this.map = map;
        this.viewport = new Viewport({
            x: 0,
            y: 0,
            z: 500,
        }, {
            x: this.canvas.width,
            y: 0,
            z: 500,
        }, {
            x: 0,
            y: this.canvas.height,
            z: 500,
        }, {
            x: this.canvas.width,
            y: this.canvas.height,
            z: 500,
        }, 500);
        this.startDragX = null;
        this.startDragY = null;
        this.pressed = {};
        this.mapRenderer = new MapRenderer(this.canvas, this.map, this.viewport);
    }

    start() {
        this.mapRenderer.renderMap();
        //this.turnLoop();
    }

    turnLoop() {
        if (this.map.isResolved()) {
            // End
        } else {
            const turnActor = this.map.nextTurn();
            this.animateNextTurn(turnActor).then(() => {
                turnActor.takeTurn().then(() => {
                    this.turnLoop();
                });
                //this.mapRenderer.renderMap(this.map, this.viewport);
            });
        }
    }

    animateNextTurn(turnActor) {
        return new Promise((resolve, reject) => {
            resolve();
            //return this.mapRenderer.centerOn(turnActor);
        });
    }

    handleMouseDown(x, y) {
        this.startDragX = x;
        this.startDragY = y;
    }

    handleMouseMove(x, y) {
        this.viewport.setMouse(x,y);
        /*if (this.startDragX !== null && this.startDragY !== null) {
            const dx = this.startDragX - x;
            const dy = this.startDragY - y;
            this.viewport.translateAlongBasis(dx, dy);
            this.startDragX = x;
            this.startDragY = y;
        }*/
        //this.mapRenderer.renderMap();
    }

    handleMouseUp(x, y) {
        this.startDragX = null;
        this.startDragY = null;
    }

    handleClick(x, y) {
        //this.viewport.mx = this.viewport.x1 + x;
        //this.viewport.my = this.viewport.y1 + y;
        //const clickedObjs = this.mapRenderer.getClickedObjects(this.viewport);
        //const rerender = this.map.clicked(clickedObjs);
        //if (rerender) {
            //this.mapRenderer.renderMap(this.map, this.viewport);
        //}
    }

    handleMouseLeave() {
        this.viewport.mx = null;
        this.viewport.my = null;
        this.startDragX = null;
        this.startDragY = null;
        //this.mapRenderer.renderMap(this.map, this.viewport);
    }

    handleKeyDown(code) {
        if (!this.pressed[code]) {
            this.pressed[code] = true;
            const updateRates = {};
            switch (code) {
                case 'KeyA':
                    updateRates.t1 = -20;
                    break;
                case 'KeyW':
                    updateRates.t3 = 20;
                    break;
                case 'KeyD':
                    updateRates.t1 = 20;
                    break;
                case 'KeyS':
                    updateRates.t3 = -20;
                    break;
                case 'Space':
                    updateRates.t2 = -20;
                    break;
                case 'ShiftLeft':
                    updateRates.t2 = 20;
                    break;
                case 'ArrowUp':
                    updateRates.r1 = -3;
                    break;
                case 'ArrowDown':
                    updateRates.r1 = 3;
                    break;
                case 'ArrowLeft':
                    updateRates.r2 = 3;
                    break;
                case 'ArrowRight':
                    updateRates.r2 = -3;
                    break;
            }
            this.viewport.updateRates(updateRates);
        }
    }

    handleKeyUp(code) {
        if (this.pressed[code]) {
            this.pressed[code] = false;
            const updateRates = {};
            switch (code) {
                case 'KeyA':
                    updateRates.t1 = 20;
                    break;
                case 'KeyW':
                    updateRates.t3 = -20;
                    break;
                case 'KeyD':
                    updateRates.t1 = -20;
                    break;
                case 'KeyS':
                    updateRates.t3 = 20;
                    break;
                case 'Space':
                    updateRates.t2 = 20;
                    break;
                case 'ShiftLeft':
                    updateRates.t2 = -20;
                    break;
                case 'ArrowUp':
                    updateRates.r1 = 3;
                    break;
                case 'ArrowDown':
                    updateRates.r1 = -3;
                    break;
                case 'ArrowLeft':
                    updateRates.r2 = -3;
                    break;
                case 'ArrowRight':
                    updateRates.r2 = 3;
                    break;
            }
            this.viewport.updateRates(updateRates);
        }
    }
}

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
}

class MapRenderer {

    constructor(canvas, map, viewport) {
        this.canvas = canvas;
        this.boundingBoxes = [];
        this.map = map;
        this.viewport = viewport;

        this.buildTileFaces();
        this.buildBSP();
    }

    buildTileFaces() {
        this.renderTiles = [];
        const tiles = this.map.getTilesFlattened();
        const tlen = 100;
        for (let i = 0; i < tiles.length; i++) {
            const renderTile = {
                tile: tiles[i],
            }
            const tx = tiles[i].getX() * tlen;
            const ty = tiles[i].getY() * tlen;
            const tz = tiles[i].getH() * tlen;
            const vertices = [{
                x: tx,
                y: ty,
                z: tz,
            }, {
                x: tx + 100,
                y: ty,
                z: tz,
            }, {
                x: tx + 100,
                y: ty + 100,
                z: tz,
            }, {
                x: tx,
                y: ty + 100,
                z: tz,
            }, {
                x: tx,
                y: ty,
                z: 0,
            }, {
                x: tx + 100,
                y: ty,
                z: 0,
            }, {
                x: tx + 100,
                y: ty + 100,
                z: 0,
            }, {
                x: tx,
                y: ty + 100,
                z: 0,
            }];
            renderTile.vertices = vertices;
            const cubeFaces = [
                {
                    n: {
                        x: 0,
                        y: 0,
                        z: 1,
                    },
                    points: [
                        vertices[0],
                        vertices[1],
                        vertices[2],
                        vertices[3],
                    ],
                },
                {
                    n: {
                        x: 1,
                        y: 0,
                        z: 0,
                    },
                    points: [
                        vertices[1],
                        vertices[2],
                        vertices[6],
                        vertices[5],
                    ],
                },
                {
                    n: {
                        x: 0,
                        y: 0,
                        z: -1,
                    },
                    points: [
                        vertices[4],
                        vertices[5],
                        vertices[6],
                        vertices[7],
                    ],
                },
                {
                    n: {
                        x: 0,
                        y: -1,
                        z: 0,
                    },
                    points: [
                        vertices[0],
                        vertices[1],
                        vertices[5],
                        vertices[4],
                    ],
                },
                {
                    n: {
                        x: -1,
                        y: 0,
                        z: 0,
                    },
                    points: [
                        vertices[0],
                        vertices[3],
                        vertices[7],
                        vertices[4],
                    ],
                },
                {
                    n: {
                        x: 0,
                        y: 1,
                        z: 0,
                    },
                    points: [
                        vertices[2],
                        vertices[3],
                        vertices[7],
                        vertices[6],
                    ],
                },
            ];
            renderTile.faces = cubeFaces;
            cubeFaces.forEach((face) => {
                face.renderTile = renderTile;
            });
            this.renderTiles.push(renderTile);
        }
    }

    buildBSP() {
        const flattened = this.renderTiles.reduce(function(a, b) {
            return a.concat(b.faces);
        }, []);
        this.bsp = new BSPTree(flattened);
    }

    drawFace(face, stroke="#000000", fill="#CCCCCC") {
        const ctx = this.canvas.getContext('2d');
        if (fill !== null) {
            ctx.fillStyle = fill;
            ctx.beginPath();
            for (let k = 0; k < face.visiblePoints.length; k++) {
                if (k == 0) {
                    ctx.moveTo(face.visiblePoints[k].x, face.visiblePoints[k].y);
                }
                if (k == face.visiblePoints.length - 1) {
                    ctx.lineTo(face.visiblePoints[0].x, face.visiblePoints[0].y);
                } else {
                    ctx.lineTo(face.visiblePoints[k + 1].x, face.visiblePoints[k + 1].y);
                }
            }
            ctx.fill();
        }
        if (stroke !== null) {
            ctx.strokeStyle = stroke;
            ctx.beginPath();
            for (let k = 0; k < face.visiblePoints.length; k++) {
                if (k == 0) {
                    ctx.moveTo(face.visiblePoints[k].x, face.visiblePoints[k].y);
                }
                if (k == face.visiblePoints.length - 1) {
                    ctx.lineTo(face.visiblePoints[0].x, face.visiblePoints[0].y);
                } else {
                    ctx.lineTo(face.visiblePoints[k + 1].x, face.visiblePoints[k + 1].y);
                }
            }
            ctx.stroke();
        }
    }

    
    renderMap() {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.boundingBoxes = [];

        this.viewport.updatePosition();

        let selectedFace = null;
        const facesToDraw = [];
        this.bsp.traverse((face) => {
            face.hover = false;
            const projected = this.viewport.projectPlane(face);
            face.visible = projected.visible;
            face.clippedPoints = projected.clippedPoints;
            face.visiblePoints = projected.visiblePoints;
            if (face.visible) {
                if (this.viewport.mouseInside(face)) {
                    selectedFace = face;
                }
                facesToDraw.push(face);
            }
        }, this.viewport.p5);

        this.renderTiles.forEach((renderTile) => {
            renderTile.clippedFace = null;
            let clippedFace = null;
            renderTile.faces.forEach((face) => {
                if (face.clippedPoints.length == 2) {
                    if (clippedFace == null) {
                        clippedFace = {
                            visiblePoints: face.clippedPoints.slice(),
                        };
                    } else {
                        for (let i = 0; i < face.clippedPoints.length; i++) {
                            const c = face.clippedPoints[i];
                            let minDist = null;
                            let minDistIdx = null;
                            let match = false;
                            for (let j = 0; j < clippedFace.visiblePoints.length; j++) {
                                const cp = clippedFace.visiblePoints[j];
                                const nextcp = j == clippedFace.visiblePoints.length - 1 ? clippedFace.visiblePoints[0] : clippedFace.visiblePoints[j + 1];
                                const currDist = Math.sqrt((nextcp.x - cp.x) * (nextcp.x - cp.x) + (nextcp.y - cp.y) * (nextcp.y - cp.y) + (nextcp.z - cp.z) * (nextcp.z - cp.z));
                                const cDist1 = Math.sqrt((cp.x - c.x) * (cp.x - c.x) + (cp.y - c.y) * (cp.y - c.y) + (cp.z - c.z) * (cp.z - c.z));
                                const cDist2 = Math.sqrt((nextcp.x - c.x) * (nextcp.x - c.x) + (nextcp.y - c.y) * (nextcp.y - c.y) + (nextcp.z - c.z) * (nextcp.z - c.z));
                                const distInc = cDist1 + cDist2 - currDist;
                                if (distInc == 0) {
                                    match = true;
                                    break;
                                }
                                if (minDist == null | distInc < minDist) {
                                    minDist = distInc;
                                    minDistIdx = j;
                                }
                            }
                            if (!match) {
                                if (minDistIdx == clippedFace.visiblePoints.length - 1) {
                                    clippedFace.visiblePoints.splice(0, 0, c);
                                } else {
                                    clippedFace.visiblePoints.splice(minDistIdx + 1, 0, c);
                                }
                            }
                        }
                    }
                }
            });
            if (clippedFace !== null) {
                if (this.viewport.mouseInside(clippedFace)) {
                    selectedFace = clippedFace;
                }
                clippedFace.renderTile = renderTile;
                renderTile.clippedFace = clippedFace;
                facesToDraw.push(clippedFace);
            }
        });

        if (selectedFace !== null) {
            selectedFace.renderTile.faces.forEach((face) => {
                face.hover = true;
            });
            if (selectedFace.renderTile.clippedFace !== null) {
                selectedFace.renderTile.clippedFace.hover = true;
            }
        }

        facesToDraw.forEach((face) => {
            if (face.hover) {
                this.drawFace(face, "#000000", "#e6e6e6");
            } else {
                this.drawFace(face);
            }
        });

        window.requestAnimationFrame((step) => {
            this.renderMap();
        });
    }



    renderTiles(tiles, viewport) {
        const ctx = this.canvas.getContext("2d");
        tiles.forEach((tile) => {
            const tx = tile.getX();
            const ty = tile.getY();

            //map tx and ty into screen x and y (sx & sy) 
            const sx1 = tx * 100;
            const sx2 = tx * 100 + 100;
            const sy1 = ty * 100;
            const sy2 = ty * 100 + 100;

            if (sx2 >= viewport.x1 && sx1 <= viewport.x2 && sy2 >= viewport.y1 && sy1 <= viewport.y2) {

                let hover = false;
                if (viewport.mx !== null && viewport.my !== null) {
                    if (viewport.mx > sx1 && viewport.mx < sx2 && viewport.my > sy1 && viewport.my < sy2) {
                        hover = true;
                    }
                }
                if (tile instanceof PlainTile) {
                    ctx.strokeStyle = "#000000";
                    if (tile.isHighlighted()) {
                        if (hover) {
                            ctx.fillStyle = "#0066FF";
                        }  else {
                            ctx.fillStyle = "#0000FF";
                        }
                    } else {
                        if (hover) {
                        ctx.fillStyle = "#D9D9D9";
                        } else {
                            ctx.fillStyle = "#CCCCCC";
                        }
                    }
                    ctx.fillRect(sx1 - viewport.x1, sy1 - viewport.y1, 100, 100);
                    ctx.strokeRect(sx1 - viewport.x1, sy1 - viewport.y1, 100, 100);
                    this.boundingBoxes.push({
                        obj: tile,
                        x1: sx1,
                        x2: sx2,
                        y1: sy1,
                        y2: sy2,
                    });
                }
            }
        });
    }

    renderMapObjects(mapObjects, viewport) {
        const ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "#0000FF";
        ctx.strokeStyle = "#000000";
        let counter = 0;
        mapObjects.forEach((mapObject) => {
            const mx = mapObject.getX();
            const my = mapObject.getY();

            //map tx and ty into screen x and y (sx & sy) 
            const sx1 = mx * 100;
            const sx2 = mx * 100 + 100;
            const sy1 = my * 100;
            const sy2 = my * 100 + 100;

            if (sx2 >= viewport.x1 && sx1 <= viewport.x2 && sy2 >= viewport.y1 && sy1 <= viewport.y2) {
                
                if (mapObject.isHighlighted()) {
                    ctx.fillStyle = "#00FF00";
                } else {
                    ctx.fillStyle = "#0000FF";
                }
                ctx.fillRect(sx1 + 15 - viewport.x1, sy1 + 15 - viewport.y1, 70, 70);
                ctx.strokeRect(sx1 + 15 - viewport.x1, sy1 + 15 - viewport.y1, 70, 70);
                ctx.fillStyle = "#000000";
                ctx.font = "48px serif";
                ctx.fillText(`${counter}`,sx1 + 40 - viewport.x1, sy1 + 60 - viewport.y1);
                counter += 1;
                this.boundingBoxes.push({
                    obj: mapObject,
                    x1: sx1,
                    x2: sx2,
                    y1: sy1,
                    y2: sy2,
                });
            }
        });
    }

    getClickedObjects(viewport) {
        const clickedObjects = [];
        const mx = viewport.mx;
        const my = viewport.my;
        for (let i = 0; i < this.boundingBoxes.length; i++) {
            let boundingBox = this.boundingBoxes[i];
            if (mx > boundingBox.x1 && mx < boundingBox.x2 && my > boundingBox.y1 && my < boundingBox.y2) {
                clickedObjects.push(boundingBox.obj);
            }
        }
        return clickedObjects;
    }

    getCenteredViewport(mapObject) {

    }
}

export {Map, MapObject, MapSerializer, MapRenderer, MapScreen, Knight}