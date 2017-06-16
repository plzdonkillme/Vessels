import { Tile, PlainTile, EmptyTile } from "./Tile";

class Map {

    constructor(tiles, mapObjects) {
        this.tiles = tiles
        this.mapObjects = mapObjects;
        this.selectedObject= null;
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
            const mapObjectString = `${this.classNameToString[mapObject.getClassName()]}-${mapObject.getX()}-${mapObject.getY()}`;
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
            const mapObjectClass = this.stringToClass[props[0]];
            const mapObjectTile = tiles[parseInt(props[2])][parseInt(props[1])];
            const mapObject = new mapObjectClass(mapObjectTile);
            mapObjects.push(mapObject);
        }
        return new Map(tiles, mapObjects);
    }
}

class MapObject {

    getclassName() {
        throw Error('Unimplemented');
    }

    constructor(tile) {
        this.tile = tile;
    }

    getTile() {
        return this.tile;
    }

    getX() {
        return this.tile.getX();
    }

    getY() {
        return this.tile.getY();
    }

    setTile(tile) {
        this.tile = tile;
    }
}

class Knight extends MapObject {

    getClassName() {
        return 'Knight';
    }

    constructor(tile) {
        super(tile);
        this.selected = false;
    }

    toString() {
        return `Knight on ${this.tile.toString()}`;
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
        this.mapRenderer = new MapRenderer(this.canvas);
    }

    setMap(map) {
        this.map = map;
    }

    draw() {
        this.mapRenderer.renderMap(this.map, null, null);
    }

    handleMouseMove(x, y) {
        this.mapRenderer.renderMap(this.map, x, y);
    }

    handleClick(x, y) {
        const clickedObjs = this.mapRenderer.getClickedObjects(x, y);
        const rerender = this.map.clicked(clickedObjs);
        if (rerender) {
            this.mapRenderer.renderMap(this.map, x, y);
        }
    }

    handleMouseLeave() {
        this.mapRenderer.renderMap(this.map, null, null);
    }
}

class MapRenderer {

    constructor(canvas) {
        this.canvas = canvas;
        this.boundingBoxes = [];
    }

    renderMap(map, mouseX, mouseY) {
        this.boundingBoxes = []
        const tiles = map.getTilesFlattened();
        this.renderTiles(tiles, mouseX, mouseY);
        const mapObjects = map.getMapObjects();
        this.renderMapObjects(mapObjects, mouseX, mouseY);
    }

    renderTiles(tiles, mouseX, mouseY) {
        const ctx = this.canvas.getContext("2d");
        ctx.strokeStyle = "#000000";
        tiles.forEach((tile) => {
            const tx = tile.getX();
            const ty = tile.getY();
            let hover = false;
            if (mouseX && mouseY) {
                if (mouseX > 100 * tx && mouseX < 100 * tx + 100 && mouseY > 100 * ty && mouseY < 100 * ty + 100) {
                    hover = true;
                }
            }
            if (tile instanceof PlainTile) {
                if (hover) {
                    ctx.fillStyle = "#FF8080";
                } else {
                    ctx.fillStyle = "#FF0000";
                }
                if (tile.isHighlighted()) {
                    ctx.fillStyle = "#0000FF"
                }
            } else if (tile instanceof EmptyTile) {
                ctx.fillStyle = "#808080";
            }
            ctx.fillRect(100 * tx, 100 * ty, 100, 100);
            ctx.strokeRect(100 * tx, 100 * ty, 100, 100);
            this.boundingBoxes.push({
                obj: tile,
                x1: 100 * tx,
                x2: 100 * tx + 100,
                y1: 100 * ty,
                y2: 100 * ty + 100,
            });
        });
    }

    renderMapObjects(mapObjects, mouseX, mouseY) {
        const ctx = this.canvas.getContext("2d");
        mapObjects.forEach((mapObject) => {
            ctx.fillStyle = "#0000FF";
            ctx.strokeStyle = "#000000";
            const mx = mapObject.getX();
            const my = mapObject.getY();
            ctx.fillRect(100 * mx + 15, 100 * my + 15, 70, 70);
            ctx.strokeRect(100 * mx + 15, 100 * my + 15, 70, 70);
            this.boundingBoxes.push({
                obj: mapObject,
                x1: 100 * mx,
                x2: 100 * mx + 100,
                y1: 100 * my,
                y2: 100 * my + 100,
            });
        });
    }

    getClickedObjects(x, y) {
        const clickedObjects = [];
        for (let i = 0; i < this.boundingBoxes.length; i++) {
            let boundingBox = this.boundingBoxes[i];
            if (x > boundingBox.x1 && x < boundingBox.x2 && y > boundingBox.y1 && y < boundingBox.y2) {
                clickedObjects.push(boundingBox.obj);
            }
        }
        return clickedObjects;
    }
}

export {Map, MapObject, MapSerializer, MapRenderer, MapScreen, Knight}