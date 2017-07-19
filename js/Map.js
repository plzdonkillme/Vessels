import { Tile, PlainTile, EmptyTile } from "./Tile";
import { BSPTree } from "./BSPTree";
import { MapSerializer } from "./MapSerializer";
import { Viewport } from "./Viewport";
import { Point } from "./Vector";
import { TileRenderObject } from "./TileRenderObject";

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
        this.viewport = new Viewport(
            new Point(0, 0, 500),
            new Point(this.canvas.width, 0, 500),
            new Point(0, this.canvas.height, 500),
            new Point(this.canvas.width, this.canvas.height, 500),
            500
        );
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
        //this.startDragX = x;
        //this.startDragY = y;
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
        //this.startDragX = null;
        //this.startDragY = null;
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
        this.viewport.setMouse(null, null);
        //this.startDragX = null;
        //this.startDragY = null;
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

class MapRenderer {

    constructor(canvas, map, viewport) {
        this.canvas = canvas;
        this.boundingBoxes = [];
        this.map = map;
        this.viewport = viewport;

        this.tileRenderObjects = this.map.getTilesFlattened().map(tile => new TileRenderObject(tile));
        this.buildBSP();
    }

    buildBSP() {
        const flattened = this.tileRenderObjects.reduce(function(a, b) {
            return a.concat(b.getFaces());
        }, []);
        this.bsp = new BSPTree(flattened);
    }
    
    renderMap() {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.boundingBoxes = [];

        this.viewport.updatePosition();

        let selectedFace = null;
        const facesToDraw = [];
        this.bsp.traverse((face) => {
            const { visiblePoints, clippedPoints, visible} = this.viewport.projectPlane(face.getPoints(), face.getNormal());
            if (visible) {
                if (this.viewport.mouseInside(visiblePoints)) {
                    selectedFace = face;
                }
                face.setVisiblePoints(visiblePoints);
                face.setClippedPoints(clippedPoints);
                facesToDraw.push(face);
            }
        }, this.viewport.getReference());

        /*this.renderTiles.forEach((renderTile) => {
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
        });*/

        /*if (selectedFace !== null) {
            selectedFace.renderTile.faces.forEach((face) => {
                face.hover = true;
            });
            if (selectedFace.renderTile.clippedFace !== null) {
                selectedFace.renderTile.clippedFace.hover = true;
            }
        }*/

        facesToDraw.forEach((face) => {
            face.draw(ctx);
            /*if (face.hover) {
                this.drawFace(face, "#000000", "#e6e6e6");
            } else {
                this.drawFace(face);
            }*/
        });

        window.requestAnimationFrame((step) => {
            this.renderMap();
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

export {Map, MapObject, MapRenderer, MapScreen, Knight}