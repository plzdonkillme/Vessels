import { Tile, PlainTile, EmptyTile } from "./Tile";

class Map {

    constructor(tiles, mapObjects) {
        this.tiles = tiles
        this.mapObjects = mapObjects;
        this.actors = mapObjects.filter(m => m.isActor());
        this.selectedObject= null;

        this.TICK_THRESHOLD = 100;
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

    setSelection(mapObject) {
        if (this.selectedObject) {
            this.selectedObject.unselectObject();
        }
        if (this.selectedObject === mapObject) {
            this.selectedObject = null;
        } else {
            this.selectedObject = mapObject;
            this.selectedObject.selectObject();
        }
    }

    clicked(objs) {
        let rerender = false;
        for (let i = 0; i < objs.length; i++) {
            const obj = objs[i];
            if (obj instanceof MapObject) {
                this.setSelection(obj);
                rerender = true;
            }
            if (obj instanceof Tile) {
                if (obj.isHighlighted()) {
                    this.selectedObject.unselectObject();
                    this.selectedObject.setTile(obj);
                    this.selectedObject = null;
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

    setTile(tile) {
        this.tile = tile;
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
        this.tile = tiles[this.x][this.y];
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
    }

    selectObject() {
        this.tile.changeNeighbors(2, true);
        this.tile.unhighlight();
    }

    unselectObject() {
        this.tile.changeNeighbors(2, false);
    }
}

class MapScreen {

    constructor(canvas, map) {
        this.canvas = canvas;
        this.map = map;
        this.viewport = {
            x1: 0,
            x2: this.canvas.width,
            y1: 0,
            y2: this.canvas.height,
            mx: null,
            my: null,
        };
        this.startDragX = null;
        this.startDragY = null;
        this.mapRenderer = new MapRenderer(this.canvas);
    }

    setMap(map) {
        this.map = map;
    }

    start() {
        this.map.nextTurn();
        this.mapRenderer.renderMap(this.map, this.viewport);
    }

    draw() {
        this.mapRenderer.renderMap(this.map, this.viewport);
    }

    handleMouseDown(x, y) {
        this.startDragX = x;
        this.startDragY = y;
    }

    handleMouseMove(x, y) {
        if (this.startDragX !== null && this.startDragY !== null) {
            const dx = x - this.startDragX;
            const dy = y - this.startDragY;
            this.viewport.x1 -= dx;
            this.viewport.x2 -= dx;
            this.viewport.y1 -= dy;
            this.viewport.y2 -= dy;
            this.startDragX = x;
            this.startDragY = y;
        }
        this.viewport.mx = this.viewport.x1 + x;
        this.viewport.my = this.viewport.y1 + y;
        //console.log(`mousemove - x: ${x} y: ${y}`);
        this.mapRenderer.renderMap(this.map, this.viewport);
    }

    handleMouseUp(x, y) {
        this.startDragX = null;
        this.startDragY = null;
        //console.log(`mouseup - x: ${x} y: ${y}`);
    }

    handleClick(x, y) {
        this.viewport.mx = this.viewport.x1 + x;
        this.viewport.my = this.viewport.y1 + y;
        const clickedObjs = this.mapRenderer.getClickedObjects(this.viewport);
        const rerender = this.map.clicked(clickedObjs);
        if (rerender) {
            this.mapRenderer.renderMap(this.map, this.viewport);
        }
    }

    handleMouseLeave() {
        this.viewport.mx = null;
        this.viewport.my = null;
        this.startDragX = null;
        this.startDragY = null;
        this.mapRenderer.renderMap(this.map, this.viewport);
    }
}

class MapRenderer {

    constructor(canvas) {
        this.canvas = canvas;
        this.boundingBoxes = [];
        this.viewport = {
            x1: 0,
            x2: canvas.width,
            y1: 0,
            y2: canvas.height,
        };
    }

    renderMap(map, viewport) {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.boundingBoxes = []
        const tiles = map.getTilesFlattened();
        this.renderTiles(tiles, viewport);
        const mapObjects = map.getMapObjects();
        this.renderMapObjects(mapObjects, viewport);
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
                    if (hover) {
                        ctx.fillStyle = "#D9D9D9";
                    } else {
                        ctx.fillStyle = "#CCCCCC";
                    }
                    if (tile.isHighlighted()) {
                        ctx.fillStyle = "#0000FF"
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
        mapObjects.forEach((mapObject) => {
            const mx = mapObject.getX();
            const my = mapObject.getY();

            //map tx and ty into screen x and y (sx & sy) 
            const sx1 = mx * 100;
            const sx2 = mx * 100 + 100;
            const sy1 = my * 100;
            const sy2 = my * 100 + 100;

            if (sx2 >= viewport.x1 && sx1 <= viewport.x2 && sy2 >= viewport.y1 && sy1 <= viewport.y2) {

                ctx.fillRect(sx1 + 15 - viewport.x1, sy1 + 15 - viewport.y1, 70, 70);
                ctx.strokeRect(sx1 + 15 - viewport.x1, sy1 + 15 - viewport.y1, 70, 70);
                this.boundingBoxes.push({
                    obj: mapObject,
                    x1: sx1,
                    x2: sx2,
                    y1: sy1,
                    y2: sy2,
                })
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
}

export {Map, MapObject, MapSerializer, MapRenderer, MapScreen, Knight}