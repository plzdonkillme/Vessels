/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Knight = exports.MapScreen = exports.MapRenderer = exports.MapSerializer = exports.MapObject = exports.Map = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Tile = __webpack_require__(4);

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Map = function () {
    function Map(tiles, mapObjects) {
        _classCallCheck(this, Map);

        this.tiles = tiles;
        this.mapObjects = mapObjects;
        this.actors = mapObjects.filter(function (m) {
            return m.isActor();
        });

        this.TICK_THRESHOLD = 100;

        // Priority Queue of actors. Format is [[actor, ticks]]
        this.turnQueue = [];

        for (var i = 0; i < this.actors.length; i++) {
            var ticks = this.actors[i].getTicks();
            if (ticks > this.TICK_THRESHOLD) {
                var idx = this.turnQueue.length;
                for (var j = 0; j < this.turnQueue.length; j++) {
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

    _createClass(Map, [{
        key: 'getTilesFlattened',
        value: function getTilesFlattened() {
            var flattenedArray = [];
            this.tiles.forEach(function (row) {
                flattenedArray = flattenedArray.concat(row);
            });
            return flattenedArray;
        }
    }, {
        key: 'getTiles',
        value: function getTiles() {
            return this.tiles;
        }
    }, {
        key: 'getMapObjects',
        value: function getMapObjects() {
            return this.mapObjects;
        }

        //TODO: Implement Map Objective Functions

    }, {
        key: 'isResolved',
        value: function isResolved() {
            return false;
        }
    }, {
        key: 'clicked',
        value: function clicked(objs) {
            var rerender = false;
            for (var i = 0; i < objs.length; i++) {
                var obj = objs[i];
                if (obj instanceof MapObject) {
                    //this.setSelection(obj);
                    //rerender = true;
                } else if (obj instanceof _Tile.Tile) {
                    if (obj.isHighlighted()) {
                        this.turnActor.moveTo(obj);
                        rerender = true;
                    }
                }
            }
            return rerender;
        }
    }, {
        key: 'serialize',
        value: function serialize() {
            var serializer = new MapSerializer();
            return serializer.serialize(this);
        }
    }, {
        key: 'nextTurn',
        value: function nextTurn() {
            if (this.turnActor !== null) {
                this.turnQueue.pop();
                this.turnActor.subtractTicks(this.TICK_THRESHOLD);
            }
            while (this.turnQueue.length === 0) {
                for (var i = 0; i < this.actors.length; i++) {
                    this.actors[i].tickForward();
                    var ticks = this.actors[i].getTicks();
                    if (ticks > this.TICK_THRESHOLD) {
                        var idx = this.turnQueue.length;
                        for (var j = 0; j < this.turnQueue.length; j++) {
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
    }]);

    return Map;
}();

var MapSerializer = function () {
    function MapSerializer() {
        _classCallCheck(this, MapSerializer);

        this.classNameToString = {
            'Plain': 'p',
            'Empty': 'e',
            'Knight': 'k'
        };
        this.stringToClass = {
            'p': _Tile.PlainTile,
            'e': _Tile.EmptyTile,
            'k': Knight
        };
    }

    _createClass(MapSerializer, [{
        key: 'serialize',
        value: function serialize(map) {
            var mapString = '';
            var tiles = map.getTiles();
            for (var i = 0; i < tiles.length; i++) {
                var tileRow = tiles[i];
                for (var j = 0; j < tileRow.length; j++) {
                    var tile = tileRow[j];
                    var tileString = this.classNameToString[tile.getClassName()] + '-' + tile.getH();
                    mapString += tileString;
                    if (j !== tileRow.length - 1) {
                        mapString += ' ';
                    }
                }
                mapString += '\n';
            }
            mapString += '===\n';
            var mapObjects = map.getMapObjects();
            for (var _i = 0; _i < mapObjects.length; _i++) {
                var mapObject = mapObjects[_i];
                var mapObjectString = this.classNameToString[mapObject.getClassName()] + '-' + mapObject.serialize();
                mapString += mapObjectString;
                if (_i !== mapObjects.length - 1) {
                    mapString += '\n';
                }
            }
            return mapString;
        }
    }, {
        key: 'deserialize',
        value: function deserialize(mapString) {
            var splitString = mapString.split('\n===\n');
            var tileArrayString = splitString[0];
            var mapObjectArrayString = splitString[1];
            var tiles = [];
            var tileRowStrings = tileArrayString.split('\n');
            for (var y = 0; y < tileRowStrings.length; y++) {
                var tileRow = [];
                var tileStrings = tileRowStrings[y].split(' ');
                for (var x = 0; x < tileStrings.length; x++) {
                    var props = tileStrings[x].split('-');
                    var tileClass = this.stringToClass[props[0]];
                    var tile = new tileClass(x, y, props[1]);

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
            var mapObjects = [];
            var mapObjectStrings = mapObjectArrayString.split('\n');
            for (var i = 0; i < mapObjectStrings.length; i++) {
                var _props = mapObjectStrings[i].split('-');
                var classString = _props[0];
                var attrString = _props.slice(1, _props.length).join('-');
                var mapObjectClass = this.stringToClass[_props[0]];
                var mapObject = mapObjectClass.deserialize(attrString);
                mapObjects.push(mapObject);
            }
            for (var _i2 = 0; _i2 < mapObjects.length; _i2++) {
                mapObjects[_i2].setReferences(tiles, mapObjects);
            }
            return new Map(tiles, mapObjects);
        }
    }]);

    return MapSerializer;
}();

var MapObject = function () {
    _createClass(MapObject, [{
        key: 'getClassName',
        value: function getClassName() {
            return 'MapObject';
        }
    }]);

    function MapObject(attributes) {
        _classCallCheck(this, MapObject);

        this.tile = null;
        this.x = attributes.x;
        this.y = attributes.y;
        this.highlighted = false;
    }

    _createClass(MapObject, [{
        key: 'getTile',
        value: function getTile() {
            return this.tile;
        }
    }, {
        key: 'getX',
        value: function getX() {
            return this.x;
        }
    }, {
        key: 'getY',
        value: function getY() {
            return this.y;
        }
    }, {
        key: 'isHighlighted',
        value: function isHighlighted() {
            return this.highlighted;
        }
    }, {
        key: 'setHighlight',
        value: function setHighlight(h) {
            this.highlighted = h;
        }
    }, {
        key: 'moveTo',
        value: function moveTo(tile) {
            this.tile.unsetMapObject(this);
            tile.setMapObject(this);
            this.tile = tile;
            this.x = tile.getX();
            this.y = tile.getY();
        }
    }, {
        key: 'isActor',
        value: function isActor() {
            return false;
        }
    }, {
        key: 'serialize',
        value: function serialize() {
            return this.x + '-' + this.getY();
        }
    }, {
        key: 'setReferences',
        value: function setReferences(tiles, mapObjects) {
            this.tile = tiles[this.y][this.x];
            this.tile.setMapObject(this);
        }
    }], [{
        key: 'parseAttributes',
        value: function parseAttributes(attrString) {
            var attrSplit = attrString.split('-');
            var attr = {
                x: parseInt(attrSplit[0]),
                y: parseInt(attrSplit[1])
            };
            return attr;
        }
    }, {
        key: 'deserialize',
        value: function deserialize(attrString) {
            return new this(this.parseAttributes(attrString));
        }
    }]);

    return MapObject;
}();

var Actor = function (_MapObject) {
    _inherits(Actor, _MapObject);

    function Actor(attributes) {
        _classCallCheck(this, Actor);

        var _this = _possibleConstructorReturn(this, (Actor.__proto__ || Object.getPrototypeOf(Actor)).call(this, attributes));

        _this.ticks = attributes.ticks;
        _this.tickAmount = attributes.tickAmount;
        return _this;
    }

    _createClass(Actor, [{
        key: 'getTicks',
        value: function getTicks() {
            return this.ticks;
        }
    }, {
        key: 'getTickAmount',
        value: function getTickAmount() {
            return this.tickAmount;
        }
    }, {
        key: 'tickForward',
        value: function tickForward() {
            this.ticks += this.tickAmount;
        }
    }, {
        key: 'subtractTicks',
        value: function subtractTicks(amt) {
            this.ticks -= amt;
        }
    }, {
        key: 'isActor',
        value: function isActor() {
            return true;
        }
    }, {
        key: 'takeTurn',
        value: function takeTurn() {
            return new Promise(function (resolve, reject) {
                resolve();
            });
        }
    }, {
        key: 'serialize',
        value: function serialize() {
            return _get(Actor.prototype.__proto__ || Object.getPrototypeOf(Actor.prototype), 'serialize', this).call(this) + '-' + this.ticks + '-' + this.tickAmount;
        }
    }], [{
        key: 'parseAttributes',
        value: function parseAttributes(attrString) {
            var attrSplit = attrString.split('-');
            var parAttrString = attrSplit.slice(0, attrSplit.length - 2).join('-');
            var attr = _get(Actor.__proto__ || Object.getPrototypeOf(Actor), 'parseAttributes', this).call(this, parAttrString);
            attr.ticks = parseInt(attrSplit[attrSplit.length - 2]);
            attr.tickAmount = parseInt(attrSplit[attrSplit.length - 1]);
            return attr;
        }
    }]);

    return Actor;
}(MapObject);

var Knight = function (_Actor) {
    _inherits(Knight, _Actor);

    _createClass(Knight, [{
        key: 'getClassName',
        value: function getClassName() {
            return 'Knight';
        }
    }]);

    function Knight(attributes) {
        _classCallCheck(this, Knight);

        //attributes
        // HP
        // MP
        // Speed
        // Skill Points
        // Attack
        // Defense
        // 
        var _this2 = _possibleConstructorReturn(this, (Knight.__proto__ || Object.getPrototypeOf(Knight)).call(this, attributes));

        _this2.turnResolve = function () {
            throw Error('Called turnResolve() before it was set');
        };
        return _this2;
    }

    _createClass(Knight, [{
        key: 'takeTurn',
        value: function takeTurn() {
            var _this3 = this;

            this.setHighlight(true);
            this.tile.changeNeighbors(2, true, function (tile) {
                return tile.getMapObject() == null;
            });
            return new Promise(function (resolve, reject) {
                _this3.turnResolve = resolve;
            });
        }
    }, {
        key: 'moveTo',
        value: function moveTo(tile) {
            this.setHighlight(false);
            this.tile.changeNeighbors(2, false);
            _get(Knight.prototype.__proto__ || Object.getPrototypeOf(Knight.prototype), 'moveTo', this).call(this, tile);
            this.turnResolve();
        }
    }]);

    return Knight;
}(Actor);

var MapScreen = function () {
    function MapScreen(canvas, map) {
        _classCallCheck(this, MapScreen);

        this.canvas = canvas;
        this.map = map;
        this.viewport = new Viewport({
            x: 0,
            y: 0,
            z: 500
        }, {
            x: this.canvas.width,
            y: 0,
            z: 500
        }, {
            x: 0,
            y: this.canvas.height,
            z: 500
        }, {
            x: this.canvas.width,
            y: this.canvas.height,
            z: 500
        }, 500);
        this.startDragX = null;
        this.startDragY = null;
        this.pressed = {
            a: false,
            w: false,
            s: false,
            d: false
        };
        this.mapRenderer = new MapRenderer(this.canvas, this.map, this.viewport);
    }

    _createClass(MapScreen, [{
        key: 'start',
        value: function start() {
            this.mapRenderer.renderMap();
            //this.turnLoop();
        }
    }, {
        key: 'turnLoop',
        value: function turnLoop() {
            var _this4 = this;

            if (this.map.isResolved()) {
                // End
            } else {
                var turnActor = this.map.nextTurn();
                this.animateNextTurn(turnActor).then(function () {
                    turnActor.takeTurn().then(function () {
                        _this4.turnLoop();
                    });
                    //this.mapRenderer.renderMap(this.map, this.viewport);
                });
            }
        }
    }, {
        key: 'animateNextTurn',
        value: function animateNextTurn(turnActor) {
            return new Promise(function (resolve, reject) {
                resolve();
                //return this.mapRenderer.centerOn(turnActor);
            });
        }
    }, {
        key: 'handleMouseDown',
        value: function handleMouseDown(x, y) {
            this.startDragX = x;
            this.startDragY = y;
        }
    }, {
        key: 'handleMouseMove',
        value: function handleMouseMove(x, y) {
            if (this.startDragX !== null && this.startDragY !== null) {
                var dx = this.startDragX - x;
                var dy = this.startDragY - y;
                this.viewport.translateAlongBasis(dx, dy);
                this.startDragX = x;
                this.startDragY = y;
            }
            //this.mapRenderer.renderMap();
        }
    }, {
        key: 'handleMouseUp',
        value: function handleMouseUp(x, y) {
            this.startDragX = null;
            this.startDragY = null;
        }
    }, {
        key: 'handleClick',
        value: function handleClick(x, y) {
            //this.viewport.mx = this.viewport.x1 + x;
            //this.viewport.my = this.viewport.y1 + y;
            //const clickedObjs = this.mapRenderer.getClickedObjects(this.viewport);
            //const rerender = this.map.clicked(clickedObjs);
            //if (rerender) {
            //this.mapRenderer.renderMap(this.map, this.viewport);
            //}
        }
    }, {
        key: 'handleMouseLeave',
        value: function handleMouseLeave() {
            this.viewport.mx = null;
            this.viewport.my = null;
            this.startDragX = null;
            this.startDragY = null;
            //this.mapRenderer.renderMap(this.map, this.viewport);
        }
    }, {
        key: 'handleKeyDown',
        value: function handleKeyDown(key) {
            if (key === 'a') {
                if (!this.pressed[key]) {
                    this.viewport.updateRotateRate2(2);
                    this.pressed[key] = true;
                }
            } else if (key === 'w') {
                if (!this.pressed[key]) {
                    this.viewport.updateRotateRate1(2);
                    this.pressed[key] = true;
                }
            } else if (key === 'd') {
                if (!this.pressed[key]) {
                    this.viewport.updateRotateRate2(-2);
                    this.pressed[key] = true;
                }
            } else if (key === 's') {
                if (!this.pressed[key]) {
                    this.viewport.updateRotateRate1(-2);
                    this.pressed[key] = true;
                }
            }
        }
    }, {
        key: 'handleKeyUp',
        value: function handleKeyUp(key) {
            if (key === 'a') {
                if (this.pressed[key]) {
                    this.viewport.updateRotateRate2(-2);
                    this.pressed[key] = false;
                }
            } else if (key === 'w') {
                if (this.pressed[key]) {
                    this.viewport.updateRotateRate1(-2);
                    this.pressed[key] = false;
                }
            } else if (key === 'd') {
                if (this.pressed[key]) {
                    this.viewport.updateRotateRate2(2);
                    this.pressed[key] = false;
                }
            } else if (key === 's') {
                if (this.pressed[key]) {
                    this.viewport.updateRotateRate1(2);
                    this.pressed[key] = false;
                }
            }
        }
    }]);

    return MapScreen;
}();

var Viewport = function () {

    /*
        p1 (origin)       p2
        --------------------
        |                  |
        |                  |
        |                  |
        --------------------
        p3                p4
     */
    function Viewport(p1, p2, p3, p4) {
        var d = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -1;

        _classCallCheck(this, Viewport);

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
        var wx = p2.x - p1.x;
        var wy = p2.y - p1.y;
        var wz = p2.z - p2.z;
        this.width = Math.sqrt(wx * wx + wy * wy + wz * wz);
        var hx = p3.x - p1.x;
        var hy = p3.y - p1.y;
        var hz = p3.z - p1.z;
        this.height = Math.sqrt(hx * hx + hy * hy + hz * hz);
        this.rotateRate1 = 0;
        this.rotateRate2 = 0;
    }

    _createClass(Viewport, [{
        key: 'projectOntoPlane',
        value: function projectOntoPlane(_ref) {
            var x = _ref.x,
                y = _ref.y,
                z = _ref.z;

            if (this.d == -1) {
                return {
                    x: x * this.basis1.x + y * this.basis1.y + z * this.basis1.z - this.p1.x * this.basis1.x - this.p1.y * this.basis1.y - this.p1.z * this.basis1.z,
                    y: x * this.basis2.x + y * this.basis2.y + z * this.basis2.z - this.p1.x * this.basis2.x - this.p1.y * this.basis2.y - this.p1.z * this.basis2.z,
                    z: x * this.unitNormal.x + y * this.unitNormal.y + z * this.unitNormal.z - this.p1.x * this.unitNormal.x - this.p1.y * this.unitNormal.y - this.p1.z * this.unitNormal.z
                };
            } else {
                var pz = x * this.unitNormal.x + y * this.unitNormal.y + z * this.unitNormal.z - this.p1.x * this.unitNormal.x - this.p1.y * this.unitNormal.y - this.p1.z * this.unitNormal.z;
                var px = x * this.basis1.x + y * this.basis1.y + z * this.basis1.z - this.p1.x * this.basis1.x - this.p1.y * this.basis1.y - this.p1.z * this.basis1.z;
                var py = x * this.basis2.x + y * this.basis2.y + z * this.basis2.z - this.p1.x * this.basis2.x - this.p1.y * this.basis2.y - this.p1.z * this.basis2.z;
                return {
                    x: (this.width / 2 - px) / (1 + this.d / pz) + px,
                    y: (this.height / 2 - py) / (1 + this.d / pz) + py,
                    z: pz
                };
            }
        }
    }, {
        key: 'calcFocalPoint',
        value: function calcFocalPoint() {
            if (this.d !== -1) {
                var cx = (this.p1.x + this.p4.x) / 2;
                var cy = (this.p1.y + this.p4.y) / 2;
                var cz = (this.p1.z + this.p4.z) / 2;
                this.p5 = {
                    x: cx - this.d * this.unitNormal.x,
                    y: cy - this.d * this.unitNormal.y,
                    z: cz - this.d * this.unitNormal.z
                };
            }
        }
    }, {
        key: 'calcBasis1',
        value: function calcBasis1() {
            var bx = this.p2.x - this.p1.x;
            var by = this.p2.y - this.p1.y;
            var bz = this.p2.z - this.p1.z;
            var mag = Math.sqrt(bx * bx + by * by + bz * bz);
            this.basis1 = {
                x: bx / mag,
                y: by / mag,
                z: bz / mag
            };
        }
    }, {
        key: 'calcBasis2',
        value: function calcBasis2() {
            var bx = this.p3.x - this.p1.x;
            var by = this.p3.y - this.p1.y;
            var bz = this.p3.z - this.p1.z;
            var mag = Math.sqrt(bx * bx + by * by + bz * bz);
            this.basis2 = {
                x: bx / mag,
                y: by / mag,
                z: bz / mag
            };
        }

        // Basis 

    }, {
        key: 'calcUnitNormal',
        value: function calcUnitNormal() {
            this.unitNormal = {
                x: this.basis2.y * this.basis1.z - this.basis2.z * this.basis1.y,
                y: this.basis2.z * this.basis1.x - this.basis2.x * this.basis1.z,
                z: this.basis2.x * this.basis1.y - this.basis2.y * this.basis1.x
            };
        }
    }, {
        key: 'translateAlongBasis',
        value: function translateAlongBasis(scalar1, scalar2) {
            this.translate({
                x: this.basis1.x * scalar1 + this.basis2.x * scalar2,
                y: this.basis1.y * scalar1 + this.basis2.y * scalar2,
                z: this.basis1.z * scalar1 + this.basis2.z * scalar2
            });
        }
    }, {
        key: 'translate',
        value: function translate(a) {
            this.p1 = this.translatePoint(this.p1, a);
            this.p2 = this.translatePoint(this.p2, a);
            this.p3 = this.translatePoint(this.p3, a);
            this.p4 = this.translatePoint(this.p4, a);
            this.calcBasis1();
            this.calcBasis2();
            this.calcUnitNormal();
            this.calcFocalPoint();
        }
    }, {
        key: 'translatePoint',
        value: function translatePoint(p, a) {
            return {
                x: p.x + a.x,
                y: p.y + a.y,
                z: p.z + a.z
            };
        }
    }, {
        key: 'rotateByBasis1',
        value: function rotateByBasis1(theta) {
            var mx = (this.p1.x + this.p4.x) / 2;
            var my = (this.p1.y + this.p4.y) / 2;
            var mz = (this.p1.z + this.p4.z) / 2;
            this.translate({
                x: -mx,
                y: -my,
                z: -mz
            });
            this.rotate(this.basis1, theta);
            this.translate({
                x: mx,
                y: my,
                z: mz
            });
        }
    }, {
        key: 'rotateByBasis2',
        value: function rotateByBasis2(theta) {
            var mx = (this.p1.x + this.p4.x) / 2;
            var my = (this.p1.y + this.p4.y) / 2;
            var mz = (this.p1.z + this.p4.z) / 2;
            this.translate({
                x: -mx,
                y: -my,
                z: -mz
            });
            this.rotate(this.basis2, theta);
            this.translate({
                x: mx,
                y: my,
                z: mz
            });
        }
    }, {
        key: 'rotate',
        value: function rotate(axis, theta) {
            var mag = Math.sqrt(axis.x * axis.x + axis.y * axis.y + axis.z * axis.z);
            var normAxis = {
                x: axis.x / mag,
                y: axis.y / mag,
                z: axis.z / mag
            };
            var rad = theta / 360 * Math.PI;
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

    }, {
        key: 'rotatePoint',
        value: function rotatePoint(p, ax, rad) {
            var cost = Math.cos(rad);
            var sint = Math.sin(rad);
            var mcost = 1 - cost;
            var dot = ax.x * p.x + ax.y * p.y + ax.z * p.z;
            return {
                x: p.x * cost + (ax.y * p.z - ax.z * p.y) * sint + ax.x * dot * mcost,
                y: p.y * cost + (ax.z * p.x - ax.x * p.z) * sint + ax.y * dot * mcost,
                z: p.z * cost + (ax.x * p.y - ax.y * p.x) * sint + ax.z * dot * mcost
            };
        }
    }, {
        key: 'updateRotation',
        value: function updateRotation() {
            if (this.rotateRate1 !== 0) {
                this.rotateByBasis1(this.rotateRate1);
            }
            if (this.rotateRate2 !== 0) {
                this.rotateByBasis2(this.rotateRate2);
            }
        }
    }, {
        key: 'updateRotateRate1',
        value: function updateRotateRate1(rate) {
            this.rotateRate1 += rate;
        }
    }, {
        key: 'updateRotateRate2',
        value: function updateRotateRate2(rate) {
            this.rotateRate2 += rate;
        }
    }]);

    return Viewport;
}();

var MapRenderer = function () {
    function MapRenderer(canvas, map, viewport) {
        _classCallCheck(this, MapRenderer);

        this.canvas = canvas;
        this.boundingBoxes = [];
        /*this.viewport = {
            x1: 0,
            x2: canvas.width,
            y1: 0,
            y2: canvas.height,
        };*/
        this.map = map;
        this.viewport = viewport;
    }

    _createClass(MapRenderer, [{
        key: 'renderMap',
        value: function renderMap() {
            var _this5 = this;

            var ctx = this.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.boundingBoxes = [];

            /*const drawables = this.map.getDrawables();
            drawables.forEach((drawable) => {
                 //Check to see if visible given current viewport
                th
                   //If yes, draw and add bounding box
                 drawable.getBoundingShape();
                drawable.getBoundingBox();
                const dx = drawable.getPixelX();
                const dy = 
                if (drawable instanceof PlainTile) {
                 } else if (drawable instanceof Knight) {
                 }
            });*/

            this.viewport.updateRotation();

            //
            var tiles = this.map.getTilesFlattened();
            var tlen = 100;
            for (var i = 0; i < tiles.length; i++) {
                var tx = tiles[i].getX() * tlen;
                var ty = tiles[i].getY() * tlen;
                var tz = tiles[i].getH() * tlen;
                var points = [{
                    x: tx,
                    y: ty,
                    z: tz
                }, {
                    x: tx + 100,
                    y: ty,
                    z: tz
                }, {
                    x: tx + 100,
                    y: ty + 100,
                    z: tz
                }, {
                    x: tx,
                    y: ty + 100,
                    z: tz
                }, {
                    x: tx,
                    y: ty,
                    z: 0
                }, {
                    x: tx + 100,
                    y: ty,
                    z: 0
                }, {
                    x: tx + 100,
                    y: ty + 100,
                    z: 0
                }, {
                    x: tx,
                    y: ty + 100,
                    z: 0
                }];
                var projectedPoints = [];
                for (var j = 0; j < points.length; j++) {
                    projectedPoints.push(this.viewport.projectOntoPlane(points[j]));
                    //console.log(projectedPoints[j]);
                }
                ctx.strokeStyle = "#000000";
                ctx.beginPath();
                ctx.moveTo(projectedPoints[0].x, projectedPoints[0].y);
                if (projectedPoints[0].z < projectedPoints[1].z) {
                    ctx.setLineDash([5, 5]);
                } else {
                    ctx.setLineDash([]);
                }
                ctx.lineTo(projectedPoints[1].x, projectedPoints[1].y);
                if (projectedPoints[1].z < projectedPoints[2].z) {
                    ctx.setLineDash([5, 5]);
                } else {
                    ctx.setLineDash([]);
                }
                ctx.lineTo(projectedPoints[2].x, projectedPoints[2].y);
                if (projectedPoints[2].z < projectedPoints[3].z) {
                    ctx.setLineDash([5, 5]);
                } else {
                    ctx.setLineDash([]);
                }
                ctx.lineTo(projectedPoints[3].x, projectedPoints[3].y);
                if (projectedPoints[3].z < projectedPoints[0].z) {
                    ctx.setLineDash([5, 5]);
                } else {
                    ctx.setLineDash([]);
                }
                ctx.lineTo(projectedPoints[0].x, projectedPoints[0].y);
                if (projectedPoints[0].z < projectedPoints[4].z) {
                    ctx.setLineDash([5, 5]);
                } else {
                    ctx.setLineDash([]);
                }
                ctx.lineTo(projectedPoints[4].x, projectedPoints[4].y);
                if (projectedPoints[4].z < projectedPoints[5].z) {
                    ctx.setLineDash([5, 5]);
                } else {
                    ctx.setLineDash([]);
                }
                ctx.lineTo(projectedPoints[5].x, projectedPoints[5].y);
                if (projectedPoints[5].z < projectedPoints[1].z) {
                    ctx.setLineDash([5, 5]);
                } else {
                    ctx.setLineDash([]);
                }
                ctx.lineTo(projectedPoints[1].x, projectedPoints[1].y);
                ctx.moveTo(projectedPoints[5].x, projectedPoints[5].y);
                if (projectedPoints[5].z < projectedPoints[6].z) {
                    ctx.setLineDash([5, 5]);
                } else {
                    ctx.setLineDash([]);
                }
                ctx.lineTo(projectedPoints[6].x, projectedPoints[6].y);
                if (projectedPoints[6].z < projectedPoints[2].z) {
                    ctx.setLineDash([5, 5]);
                } else {
                    ctx.setLineDash([]);
                }
                ctx.lineTo(projectedPoints[2].x, projectedPoints[2].y);
                ctx.moveTo(projectedPoints[6].x, projectedPoints[6].y);
                if (projectedPoints[6].z < projectedPoints[7].z) {
                    ctx.setLineDash([5, 5]);
                } else {
                    ctx.setLineDash([]);
                }
                ctx.lineTo(projectedPoints[7].x, projectedPoints[7].y);
                if (projectedPoints[7].z < projectedPoints[3].z) {
                    ctx.setLineDash([5, 5]);
                } else {
                    ctx.setLineDash([]);
                }
                ctx.lineTo(projectedPoints[3].x, projectedPoints[3].y);
                ctx.moveTo(projectedPoints[7].x, projectedPoints[7].y);
                if (projectedPoints[7].z < projectedPoints[4].z) {
                    ctx.setLineDash([5, 5]);
                } else {
                    ctx.setLineDash([]);
                }
                ctx.lineTo(projectedPoints[4].x, projectedPoints[4].y);
                ctx.stroke();
                //ctx.moveTo(projectedPoints[4].x, projectedPoints[4].y);
                //ctx.lineTo(projectedPoints[5].x, projectedPoints[5].y);
            }

            //this.renderTiles(tiles, this.viewport);
            //const mapObjects = map.getMapObjects();
            //this.renderMapObjects(mapObjects, this.viewport);


            window.requestAnimationFrame(function (step) {
                _this5.renderMap();
            });
        }
    }, {
        key: 'renderTiles',
        value: function renderTiles(tiles, viewport) {
            var _this6 = this;

            var ctx = this.canvas.getContext("2d");
            tiles.forEach(function (tile) {
                var tx = tile.getX();
                var ty = tile.getY();

                //map tx and ty into screen x and y (sx & sy) 
                var sx1 = tx * 100;
                var sx2 = tx * 100 + 100;
                var sy1 = ty * 100;
                var sy2 = ty * 100 + 100;

                if (sx2 >= viewport.x1 && sx1 <= viewport.x2 && sy2 >= viewport.y1 && sy1 <= viewport.y2) {

                    var hover = false;
                    if (viewport.mx !== null && viewport.my !== null) {
                        if (viewport.mx > sx1 && viewport.mx < sx2 && viewport.my > sy1 && viewport.my < sy2) {
                            hover = true;
                        }
                    }
                    if (tile instanceof _Tile.PlainTile) {
                        ctx.strokeStyle = "#000000";
                        if (tile.isHighlighted()) {
                            if (hover) {
                                ctx.fillStyle = "#0066FF";
                            } else {
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
                        _this6.boundingBoxes.push({
                            obj: tile,
                            x1: sx1,
                            x2: sx2,
                            y1: sy1,
                            y2: sy2
                        });
                    }
                }
            });
        }
    }, {
        key: 'renderMapObjects',
        value: function renderMapObjects(mapObjects, viewport) {
            var _this7 = this;

            var ctx = this.canvas.getContext("2d");
            ctx.fillStyle = "#0000FF";
            ctx.strokeStyle = "#000000";
            var counter = 0;
            mapObjects.forEach(function (mapObject) {
                var mx = mapObject.getX();
                var my = mapObject.getY();

                //map tx and ty into screen x and y (sx & sy) 
                var sx1 = mx * 100;
                var sx2 = mx * 100 + 100;
                var sy1 = my * 100;
                var sy2 = my * 100 + 100;

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
                    ctx.fillText('' + counter, sx1 + 40 - viewport.x1, sy1 + 60 - viewport.y1);
                    counter += 1;
                    _this7.boundingBoxes.push({
                        obj: mapObject,
                        x1: sx1,
                        x2: sx2,
                        y1: sy1,
                        y2: sy2
                    });
                }
            });
        }
    }, {
        key: 'getClickedObjects',
        value: function getClickedObjects(viewport) {
            var clickedObjects = [];
            var mx = viewport.mx;
            var my = viewport.my;
            for (var i = 0; i < this.boundingBoxes.length; i++) {
                var boundingBox = this.boundingBoxes[i];
                if (mx > boundingBox.x1 && mx < boundingBox.x2 && my > boundingBox.y1 && my < boundingBox.y2) {
                    clickedObjects.push(boundingBox.obj);
                }
            }
            return clickedObjects;
        }
    }, {
        key: 'getCenteredViewport',
        value: function getCenteredViewport(mapObject) {}
    }]);

    return MapRenderer;
}();

exports.Map = Map;
exports.MapObject = MapObject;
exports.MapSerializer = MapSerializer;
exports.MapRenderer = MapRenderer;
exports.MapScreen = MapScreen;
exports.Knight = Knight;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Map = __webpack_require__(0);

var _DefaultMap = __webpack_require__(3);

var _DefaultMap2 = _interopRequireDefault(_DefaultMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
    function Game(width, height) {
        _classCallCheck(this, Game);

        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
    }

    _createClass(Game, [{
        key: "start",
        value: function start() {
            var _this = this;

            document.body.appendChild(this.canvas);
            this.screen = new _Map.MapScreen(this.canvas, _DefaultMap2.default);
            window.screen = this.screen;
            this.screen.start();

            this.canvas.addEventListener("click", function (e) {
                var rect = _this.canvas.getBoundingClientRect();
                _this.screen.handleClick(e.clientX - rect.left, e.clientY - rect.top);
            });

            this.canvas.addEventListener("mousedown", function (e) {
                var rect = _this.canvas.getBoundingClientRect();
                _this.screen.handleMouseDown(e.clientX - rect.left, e.clientY - rect.top);
            });

            this.canvas.addEventListener("mousemove", function (e) {
                var rect = _this.canvas.getBoundingClientRect();
                _this.screen.handleMouseMove(e.clientX - rect.left, e.clientY - rect.top);
            });

            this.canvas.addEventListener("mouseup", function (e) {
                var rect = _this.canvas.getBoundingClientRect();
                _this.screen.handleMouseUp(e.clientX - rect.left, e.clientY - rect.top);
            });

            this.canvas.addEventListener("mouseleave", function (e) {
                _this.screen.handleMouseLeave();
            });

            document.addEventListener("keydown", function (e) {
                e.preventDefault();
                _this.screen.handleKeyDown(e.key);
            });

            document.addEventListener("keyup", function (e) {
                e.preventDefault();
                _this.screen.handleKeyUp(e.key);
            });

            /*this.loadAssets().then(() => {
                 this.canvas.addEventListener("click", (e) => {
                    console.log(e);
                });
                 this.loadDemo();
            });*/
        }
    }, {
        key: "loadAssets",
        value: function loadAssets() {
            var loadingPromise = new Promise(function (resolve, reject) {
                resolve();
            });
            return loadingPromise;
        }
    }]);

    return Game;
}();

exports.default = Game;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(8);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(9)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./main.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./main.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Map = __webpack_require__(0);

var exampleMapString = "p-2 p-1 p-1 p-1\np-1 e-3 p-1 p-1\np-1 p-1 p-1 e-1\np-2 p-2 p-3 p-1\ne-1 e-2 e-1 p-1\np-1 p-2 e-1 p-1\np-1 p-1 p-1 p-1\n===\nk-0-0-0-20\nk-2-1-0-30";

/*var exampleMapString = 
`p-2 p-1 p-1 p-1
p-1 p-1 p-2 p-1
p-1 p-1 p-2 p-1
===
k-0-0-0-20`;*/

var serializer = new _Map.MapSerializer();
var defaultMap = serializer.deserialize(exampleMapString);

exports.default = defaultMap;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tile = function () {
    _createClass(Tile, [{
        key: 'getClassName',
        value: function getClassName() {
            throw Error('Unimplemented');
        }
    }]);

    function Tile(x, y, h) {
        _classCallCheck(this, Tile);

        this.x = x;
        this.y = y;
        this.h = h;
        this.left = null;
        this.right = null;
        this.top = null;
        this.down = null;
        this.highlighted = false;
        this.mapObject = null;
    }

    _createClass(Tile, [{
        key: 'link',
        value: function link(dir, tile) {
            this[dir] = tile;
        }
    }, {
        key: 'getX',
        value: function getX() {
            return this.x;
        }
    }, {
        key: 'getY',
        value: function getY() {
            return this.y;
        }
    }, {
        key: 'getH',
        value: function getH() {
            return this.h;
        }
    }, {
        key: 'changeNeighbors',
        value: function changeNeighbors(steps, highlight) {
            var filter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
                return true;
            };

            if (steps === 0) {
                return;
            }
            var neighbors = [this.left, this.right, this.top, this.down];
            neighbors.forEach(function (tile) {
                if (tile !== null && filter(tile)) {
                    if (highlight && !tile.isHighlighted()) {
                        tile.highlight();
                        tile.changeNeighbors(steps - 1, highlight, filter);
                    }
                    if (!highlight && tile.isHighlighted()) {
                        tile.unhighlight();
                        tile.changeNeighbors(steps - 1, highlight, filter);
                    }
                }
            });
        }
    }, {
        key: 'isHighlighted',
        value: function isHighlighted() {
            return this.highlighted;
        }
    }, {
        key: 'highlight',
        value: function highlight() {
            this.highlighted = true;
        }
    }, {
        key: 'unhighlight',
        value: function unhighlight() {
            this.highlighted = false;
        }
    }, {
        key: 'setMapObject',
        value: function setMapObject(mapObject) {
            this.mapObject = mapObject;
        }
    }, {
        key: 'unsetMapObject',
        value: function unsetMapObject(mapObject) {
            this.mapObject = null;
        }
    }, {
        key: 'getMapObject',
        value: function getMapObject() {
            return this.mapObject;
        }
    }]);

    return Tile;
}();

var PlainTile = function (_Tile) {
    _inherits(PlainTile, _Tile);

    function PlainTile() {
        _classCallCheck(this, PlainTile);

        return _possibleConstructorReturn(this, (PlainTile.__proto__ || Object.getPrototypeOf(PlainTile)).apply(this, arguments));
    }

    _createClass(PlainTile, [{
        key: 'getClassName',
        value: function getClassName() {
            return 'Plain';
        }
    }]);

    return PlainTile;
}(Tile);

var EmptyTile = function (_Tile2) {
    _inherits(EmptyTile, _Tile2);

    function EmptyTile() {
        _classCallCheck(this, EmptyTile);

        return _possibleConstructorReturn(this, (EmptyTile.__proto__ || Object.getPrototypeOf(EmptyTile)).apply(this, arguments));
    }

    _createClass(EmptyTile, [{
        key: 'getClassName',
        value: function getClassName() {
            return 'Empty';
        }
    }, {
        key: 'changeNeighbors',
        value: function changeNeighbors(steps, highlight) {
            return;
        }
    }, {
        key: 'highlight',
        value: function highlight() {
            return;
        }
    }, {
        key: 'unhighlight',
        value: function unhighlight() {
            return;
        }
    }]);

    return EmptyTile;
}(Tile);

exports.Tile = Tile;
exports.EmptyTile = EmptyTile;
exports.PlainTile = PlainTile;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Game = __webpack_require__(1);

var _Game2 = _interopRequireDefault(_Game);

__webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var g = new _Game2.default(window.innerWidth - 16, window.innerHeight - 16);
g.start();

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
	// get current location
	var location = typeof window !== "undefined" && window.location;

	if (!location) {
		throw new Error("fixUrls requires window.location");
	}

	// blank or null?
	if (!css || typeof css !== "string") {
		return css;
	}

	var baseUrl = location.protocol + "//" + location.host;
	var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
 This regular expression is just a way to recursively match brackets within
 a string.
 	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
    (  = Start a capturing group
      (?:  = Start a non-capturing group
          [^)(]  = Match anything that isn't a parentheses
          |  = OR
          \(  = Match a start parentheses
              (?:  = Start another non-capturing groups
                  [^)(]+  = Match anything that isn't a parentheses
                  |  = OR
                  \(  = Match a start parentheses
                      [^)(]*  = Match anything that isn't a parentheses
                  \)  = Match a end parentheses
              )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
  \)  = Match a close parens
 	 /gi  = Get all matches, not the first.  Be case insensitive.
  */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function (o, $1) {
			return $1;
		}).replace(/^'(.*)'$/, function (o, $1) {
			return $1;
		});

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
			//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(undefined);
// imports


// module
exports.push([module.i, "canvas {\n\tborder: 1px solid black;\n}", ""]);

// exports


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(7);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map