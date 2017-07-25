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

    getSelectedAction(obj) {
        if (obj instanceof Tile) {
            if (obj.isHighlighted()) {
                return {
                    actor: this.turnActor,
                    action: 'move',
                    receiver: obj,
                };
            }
        }
        return null;
    }

    applyAction(actor, action, receiver) {
        if (action === 'move') {
            actor.moveTo(receiver);
        }
    }

    clicked(obj) {
        if (obj instanceof MapObject) {
            //this.setSelection(obj);
            //rerender = true;
        } else if (obj instanceof Tile) {
            if (obj.isHighlighted()) {
                this.turnActor.moveTo(obj);
            }
        }
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

    getTurnActor() {
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
        this.orientation = attributes.orientation || 'u';
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

    getOrientation() {
        return this.orientation;
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
        return `${this.x}-${this.getY()}-${this.getOrientation()}`;
    }

    static parseAttributes(attrString) {
        const attrSplit = attrString.split('-');
        const attr = {
            x: parseInt(attrSplit[0]),
            y: parseInt(attrSplit[1]),
            orientation: attrSplit[2],
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
        this.turnLoop();
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
        const tile = this.mapRenderer.getClickedTile();
        if (tile !== null) {
            const action = this.map.getSelectedAction(tile);
            if (action !== null && action.action === 'move') {
                this.mapRenderer.animateMove(action.actor, action.receiver).then(() => {
                    this.map.applyAction(action.actor, action.action, action.receiver);
                });
            }
        }
        //const clickedObjs = this.mapRenderer.getClickedObjects();

        //const rerender = this.map.clicked(clickedObjs);
        //if (rerender) {
            //this.mapRenderer.renderMap(this.map, this.viewport);
        //}
    }

    animateAction() {
        this.mapRenderer
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

        this.hoveredRenderObject = null;
        this.tileRenderObjects = this.map.getTilesFlattened()
            .filter(tile => !(tile instanceof EmptyTile))
            .map(tile => new TileRenderObject(tile));
        this.mapObjectFaces = this.tileRenderObjects
            .filter(t => t.getMapObjectFace() !== null)
            .map(t => t.getMapObjectFace());
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
        this.mapObjectFaces.forEach(m => m.updatePosition());

        let selectedFace = null;
        const facesToDraw = [];
        this.bsp.traverse((face) => {
            const { visiblePoints, clippedPoints, visible} = this.viewport.projectPlane(face.getPoints(), face.getNormal());
            face.setVisiblePoints(visiblePoints);
            face.setClippedPoints(clippedPoints);
            if (visible) {
                if (this.viewport.mouseInside(visiblePoints)) {
                    selectedFace = face;
                }
                facesToDraw.push(face);
            }
            const mapObjectFace = face.getMapObjectFace();
            if (mapObjectFace !== null) {
                const projectedBottom = this.viewport.projectPoint(mapObjectFace.getBottomPoint());
                const projectedTop = this.viewport.projectPoint(mapObjectFace.getTopPoint());

                if (projectedBottom !== null && projectedTop !== null) {
                    const viewDir = this.viewport.getViewDir(mapObjectFace.getBottomPoint(), mapObjectFace.getTopVector());
                    const viewVector = this.viewport.getViewVector(mapObjectFace.getBottomPoint());
                    
                    const x = viewVector.getX();
                    const y = viewVector.getY();
                    let angle = Math.atan(y / x);
                    if (x > 0) {
                        angle += Math.PI;
                    }
                    if (angle < 0) {
                        angle += 2 * Math.PI;
                    }

                    mapObjectFace.setViewAngle(angle);
                    mapObjectFace.setProjectedTop(projectedTop);
                    mapObjectFace.setProjectedBottom(projectedBottom);
                    mapObjectFace.setViewDir(viewDir);
                    facesToDraw.push(mapObjectFace);
                }
            }
        }, this.viewport);

        this.tileRenderObjects.forEach(obj => {
            obj.calcClippedFace();
            const clippedFace = obj.getClippedFace();
            if (clippedFace !== null) {
                if (this.viewport.mouseInside(clippedFace.getVisiblePoints())) {
                    selectedFace = clippedFace;
                }
                facesToDraw.push(clippedFace);
            }
        });

        if (this.hoveredRenderObject !== null) {
            this.hoveredRenderObject.toggleHover();
        }
        if (selectedFace !== null) {
            this.hoveredRenderObject = selectedFace.getTileRenderObject();
            this.hoveredRenderObject.toggleHover();
        } else {
            this.hoveredRenderObject = null;
        }

        facesToDraw.forEach((face) => {
            face.draw(ctx);
        });

        window.requestAnimationFrame((step) => {
            this.renderMap();
        });
    }

    animateMove(mapObject, destTile) {
        return new Promise((resolve, reject) => {
            const mapObjectFace = this.mapObjectFaces.filter(m => m.getMapObject() === mapObject)[0];
            const tileRenderObject = this.tileRenderObjects.filter(t => t.getTile() === destTile)[0];
            const endpoint = tileRenderObject.getMapObjectPoint();
            /*mapObjectFace.setTileRenderObject(tileRenderObject);
            mapObjectFace.animate({
                endpoint: endpoint,
                rate: null,
                frames: 30,
            }).then(() => {
                resolve();
            });*/
            const midpoint = mapObjectFace.getBottomPoint().midpoint(endpoint, 0.5);
            mapObjectFace.animate({
                endpoint: midpoint,
                rate: null,
                frames: 30, 
            }).then(() => {
                mapObjectFace.setTileRenderObject(tileRenderObject);
                mapObjectFace.animate({
                    endpoint: endpoint,
                    rate: null,
                    frames: 30,
                }).then(() => {
                    resolve();
                });
            });
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

    getClickedTile() {
        if (this.hoveredRenderObject !== null) {
            return this.hoveredRenderObject.getTile();
        }
        return null;
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