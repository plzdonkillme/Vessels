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
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = function () {
    function Point(x, y, z) {
        _classCallCheck(this, Point);

        this.x = x;
        this.y = y;
        this.z = z;
    }

    _createClass(Point, [{
        key: "midpoint",
        value: function midpoint(p, perc) {
            var x = (1 - perc) * this.x + perc * p.getX();
            var y = (1 - perc) * this.y + perc * p.getY();
            var z = (1 - perc) * this.z + perc * p.getZ();
            return new Point(x, y, z);
        }
    }, {
        key: "getX",
        value: function getX() {
            return this.x;
        }
    }, {
        key: "getY",
        value: function getY() {
            return this.y;
        }
    }, {
        key: "getZ",
        value: function getZ() {
            return this.z;
        }
    }, {
        key: "translate",
        value: function translate(x, y, z) {
            this.x += x;
            this.y += y;
            this.z += z;
        }
    }, {
        key: "rotate",
        value: function rotate(v, rad) {
            var cost = Math.cos(rad);
            var sint = Math.sin(rad);
            var mcost = 1 - cost;
            var vx = v.getX();
            var vy = v.getY();
            var vz = v.getZ();
            var dot = this.x * vx + this.y * vy + this.z * vz;
            var newx = this.x * cost + (vy * this.z - vz * this.y) * sint + vx * dot * mcost;
            var newy = this.y * cost + (vz * this.x - vx * this.z) * sint + vy * dot * mcost;
            var newz = this.z * cost + (vx * this.y - vy * this.x) * sint + vz * dot * mcost;
            this.x = newx;
            this.y = newy;
            this.z = newz;
        }
    }, {
        key: "scale",
        value: function scale(s) {
            this.x *= s;
            this.y *= s;
            this.z *= s;
        }
    }, {
        key: "dot",
        value: function dot(p) {
            return this.x * p.getX() + this.y * p.getY() + this.z * p.getZ();
        }
    }, {
        key: "copy",
        value: function copy() {
            return new Point(this.x, this.y, this.z);
        }
    }, {
        key: "equals",
        value: function equals(p) {
            return this.x === p.getX() && this.y === p.getY() && this.z === p.getZ();
        }
    }]);

    return Point;
}();

var Vector = function () {
    function Vector(x, y, z) {
        _classCallCheck(this, Vector);

        this.x = x;
        this.y = y;
        this.z = z;
        this.mag = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    _createClass(Vector, [{
        key: "getX",
        value: function getX() {
            return this.x;
        }
    }, {
        key: "getY",
        value: function getY() {
            return this.y;
        }
    }, {
        key: "getZ",
        value: function getZ() {
            return this.z;
        }
    }, {
        key: "getMag",
        value: function getMag() {
            return this.mag;
        }
    }, {
        key: "normalize",
        value: function normalize() {
            this.x = this.x / this.mag;
            this.y = this.y / this.mag;
            this.z = this.z / this.mag;
            this.mag = 1;
        }
    }, {
        key: "cross",
        value: function cross(v) {
            var vx = v.getX();
            var vy = v.getY();
            var vz = v.getZ();
            var x = this.y * vz - this.z * vy;
            var y = this.z * vx - this.x * vz;
            var z = this.x * vy - this.y * vx;
            return new Vector(x, y, z);
        }
    }, {
        key: "dot",
        value: function dot(v) {
            return this.x * v.getX() + this.y * v.getY() + this.z * v.getZ();
        }
    }, {
        key: "equals",
        value: function equals(v) {
            return this.x === v.getX() && this.y === v.getY() && this.z === v.getZ();
        }
    }], [{
        key: "createFromPoints",
        value: function createFromPoints(p1, p2) {
            return new Vector(p2.getX() - p1.getX(), p2.getY() - p1.getY(), p2.getZ() - p1.getZ());
        }
    }]);

    return Vector;
}();

exports.Point = Point;
exports.Vector = Vector;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deserialize = exports.serialize = undefined;

var _Tile = __webpack_require__(12);

var _MapObject = __webpack_require__(7);

var _Map = __webpack_require__(6);

var _Objective = __webpack_require__(9);

function serialize(map) {
    var mapString = '';
    var tiles = map.getTiles();
    for (var i = 0; i < tiles.length; i++) {
        var tileRow = tiles[i];
        for (var j = 0; j < tileRow.length; j++) {
            var tile = tileRow[j];
            var tileString = tile.serialize();
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
        var mapObjectString = mapObject.serialize();
        mapString += mapObjectString;
        mapString += '\n';
    }
    mapString += '===\n';
    mapString += map.getObjective().serialize();
    mapString += '\n';
    mapString += map.serializeTurnPlayers();
    mapString += '\n';
    mapString += map.serializeActions();
    return mapString;
}

function deserialize(mapString) {
    var splitString = mapString.split('\n===\n');
    var tileArrayString = splitString[0];
    var mapObjectArrayString = splitString[1];
    var settings = splitString[2].split('\n');

    var tiles = [];
    var tileRowStrings = tileArrayString.split('\n');
    for (var y = 0; y < tileRowStrings.length; y++) {
        var tileRow = [];
        var tileStrings = tileRowStrings[y].split(' ');
        for (var x = 0; x < tileStrings.length; x++) {
            var props = tileStrings[x].split('-');
            var tileClass = _Tile.Tile.getClass(props[0]);
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

    var mapObjectStrings = mapObjectArrayString.split('\n');
    for (var i = 0; i < mapObjectStrings.length; i++) {
        var mapObject = _MapObject.MapObject.deserialize(mapObjectStrings[i], tiles);
    }

    var objective = _Objective.Objective.deserialize(settings[0]);
    var turnPlayers = _Map.Map.deserializeTurnPlayers(settings[1]);
    var actions = _Map.Map.deserializeActions(settings[2]);
    return new _Map.Map(tiles, objective, turnPlayers, actions);
}

exports.serialize = serialize;
exports.deserialize = deserialize;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MapScreen = __webpack_require__(8);

var _DefaultMap = __webpack_require__(5);

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
            this.screen = new _MapScreen.MapScreen(this.canvas, _DefaultMap2.default);
            this.screen.start();
            window.dmap = _DefaultMap2.default;

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
                _this.screen.handleKeyDown(e.code);
            });

            document.addEventListener("keyup", function (e) {
                e.preventDefault();
                _this.screen.handleKeyUp(e.code);
            });

            /*this.loadAssets().then(() => {
                 this.canvas.addEventListener("click", (e) => {
                    console.log(e);
                });
                 this.loadDemo();
            });*/
        }

        /*loadAssets() {
            let loadingPromise = new Promise((resolve, reject) => {
                resolve();
            });
            return loadingPromise
        }*/

    }]);

    return Game;
}();

exports.default = Game;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(17);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(18)(content, options);
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BSPTree = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Vector = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BSPTree = function () {
    function BSPTree(faces) {
        _classCallCheck(this, BSPTree);

        this.nodes = [];
        this.front = null;
        this.back = null;
        if (faces.length == 0) {
            return;
        }

        this.nodes = [faces[0]];
        var p0 = faces[0].getPoints()[0];
        var n = faces[0].getNormal();
        var frontFaces = [];
        var backFaces = [];

        for (var i = 1; i < faces.length; i++) {
            var pos = void 0;
            var cut = false;
            var frontPoints = [];
            var backPoints = [];
            var points = faces[i].getPoints();

            //Get initial pos
            var lastD = _Vector.Vector.createFromPoints(p0, points[points.length - 1]).dot(n);
            if (lastD === 0) {
                pos = null;
            } else if (lastD > 0) {
                pos = 'front';
            } else {
                pos = 'back';
            }

            // Iterate over points
            for (var j = 0; j < points.length; j++) {
                var p = points[j];
                var d = _Vector.Vector.createFromPoints(p0, p).dot(n);
                if (d === 0) {
                    pos = null;
                    frontPoints.push(p);
                    backPoints.push(p);
                } else if (d > 0) {
                    if (pos === 'back') {
                        var prevP = j === 0 ? points[points.length - 1] : points[j - 1];
                        var prevD = _Vector.Vector.createFromPoints(p0, prevP).dot(n);
                        var mid = p.midpoint(prevP, d / (d - prevD));
                        frontPoints.push(mid);
                        backPoints.push(mid);
                        cut = true;
                    }
                    frontPoints.push(p);
                    pos = 'front';
                } else {
                    if (pos === 'front') {
                        var _prevP = j === 0 ? points[points.length - 1] : points[j - 1];
                        var _prevD = _Vector.Vector.createFromPoints(p0, _prevP).dot(n);
                        var _mid = p.midpoint(_prevP, d / (d - _prevD));
                        frontPoints.push(_mid);
                        backPoints.push(_mid);
                        cut = true;
                    }
                    backPoints.push(p);
                    pos = 'back';
                }
            }

            if (cut) {
                // Split a face...
                var _faces$i$getPolygon$s = faces[i].getPolygon().splitFace(faces[i], frontPoints, backPoints),
                    face1 = _faces$i$getPolygon$s.face1,
                    face2 = _faces$i$getPolygon$s.face2;

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

    _createClass(BSPTree, [{
        key: 'traverse',
        value: function traverse(fn, viewport) {
            if (this.nodes.length > 0) {
                var _n = this.nodes[0].getNormal();
                var p = this.nodes[0].getPoints()[0];
                var viewDir = viewport.getViewDir(p, _n);
                if (viewDir === 'towards') {
                    if (this.back !== null) {
                        this.back.traverse(fn, viewport);
                    }
                    for (var i = 0; i < this.nodes.length; i++) {
                        fn(this.nodes[i]);
                    }
                    if (this.front !== null) {
                        this.front.traverse(fn, viewport);
                    }
                } else {
                    if (this.front !== null) {
                        this.front.traverse(fn, viewport);
                    }
                    for (var _i = 0; _i < this.nodes.length; _i++) {
                        fn(this.nodes[_i]);
                    }
                    if (this.back !== null) {
                        this.back.traverse(fn, viewport);
                    }
                }
            }
        }
    }]);

    return BSPTree;
}();

exports.BSPTree = BSPTree;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MapSerializer = __webpack_require__(1);

var exampleMapString = "p-1 p-2 p-3\n===\nw-0-0-0\n===\n0\n0-1\n1-1-1";
/*
var exampleMapString = 
`p-1
p-3
===
k-0-0-0-20`;*/

var defaultMap = (0, _MapSerializer.deserialize)(exampleMapString);

exports.default = defaultMap;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Map = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MapSerializer = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Map = function () {
    function Map(tiles, objective, turnPlayers, actions) {
        _classCallCheck(this, Map);

        this.tiles = tiles;
        this.objective = objective;
        this.turnPlayers = turnPlayers;
        this.turnPlayer = turnPlayers[0];
        this.turnPlayerIdx = 0;
        this.actions = actions;
    }

    _createClass(Map, [{
        key: 'getTiles',
        value: function getTiles() {
            return this.tiles;
        }
    }, {
        key: 'getTilesFlattened',
        value: function getTilesFlattened() {
            var flattenedArray = [];
            this.tiles.forEach(function (row) {
                flattenedArray = flattenedArray.concat(row);
            });
            return flattenedArray;
        }
    }, {
        key: 'getMapObjects',
        value: function getMapObjects() {
            return this.getTilesFlattened().map(function (t) {
                return t.getMapObject();
            }).filter(function (m) {
                return m !== null;
            });
        }
    }, {
        key: 'getObjective',
        value: function getObjective() {
            return this.objective;
        }
    }, {
        key: 'serializeTurnPlayers',
        value: function serializeTurnPlayers() {
            var ret = '';
            var idx = this.turnPlayerIdx;
            for (var i = 0; i < this.turnPlayers.length; i++) {
                ret += this.turnPlayers[idx];
                if (i !== this.turnPlayers.length - 1) {
                    ret += '-';
                }
                idx = (idx + 1) % this.turnPlayers.length;
            }
            return ret;
        }
    }, {
        key: 'getTurnPlayer',
        value: function getTurnPlayer() {
            return this.turnPlayer;
        }
    }, {
        key: 'serializeActions',
        value: function serializeActions() {
            return this.actions.move + '-' + this.actions.transfer + '-' + this.actions.attack;
        }
    }, {
        key: 'isResolved',
        value: function isResolved() {
            return this.objective.check(this);
        }
    }, {
        key: 'serialize',
        value: function serialize() {
            return (0, _MapSerializer.serialize)(this);
        }

        /*
           Actions:
            move/attack
            transfer
        */

    }, {
        key: 'doAction',
        value: function doAction(name, sx, sy, dx, dy) {
            if (this.actions[name] > 0) {
                var srcTile = this.tiles[sy][sx];
                var obj = srcTile.getMapObject();
                var dstTile = this.tiles[dy][dx];
                obj[name](dstTile, this.turnPlayer);
                this.actions[name] -= 1;
            }
            if (name === 'end' || Object.values(this.actions).reduce(function (a, b) {
                return a + b;
            }, 0) === 0) {
                this.turnPlayerIdx = (this.turnPlayerIdx + 1) % this.turnPlayers.length;
                this.turnPlayer = this.turnPlayers[this.turnPlayerIdx];
                this.actions = {
                    move: 1,
                    transfer: 1,
                    attack: 1
                };
            }
        }
        /*
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
         /*nextTurn() {
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
        }*/

        /*getTurnActor() {
            return this.turnActor;
        }
         getPlayerOptions() {
            return this.playerOptions;
        }
         setPlayerOptions(options) {
            this.playerOptions = options;
        }*/

    }], [{
        key: 'deserializeTurnPlayers',
        value: function deserializeTurnPlayers(str) {
            return str.split('-');
        }
    }, {
        key: 'deserializeActions',
        value: function deserializeActions(str) {
            var s = str.split('-');
            return {
                move: parseInt(s[0]),
                transfer: parseInt(s[1]),
                attack: parseInt(s[2])
            };
        }
    }]);

    return Map;
}();

exports.Map = Map;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapObject = function () {
    function MapObject(props) {
        var tile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        _classCallCheck(this, MapObject);

        this.tile = tile;
        if (tile !== null) {
            tile.setMapObject(this);
        }
    }

    _createClass(MapObject, [{
        key: 'getTile',
        value: function getTile() {
            return this.tile;
        }
    }, {
        key: 'getX',
        value: function getX() {
            return this.tile.getX();
        }
    }, {
        key: 'getY',
        value: function getY() {
            return this.tile.getY();
        }
    }, {
        key: 'serialize',
        value: function serialize() {
            return this.constructor.name() + '-' + this.getX() + '-' + this.getY();
        }
    }, {
        key: 'setReferences',
        value: function setReferences(tiles, mapObjects) {
            this.tile = tiles[this.y][this.x];
            this.tile.setMapObject(this);
        }
    }, {
        key: 'getActions',
        value: function getActions() {
            return [];
        }
    }, {
        key: 'getPlayer',
        value: function getPlayer() {
            return null;
        }
    }], [{
        key: 'deserialize',
        value: function deserialize(props, tiles) {
            var p = props.split('-');
            var cls = NAME_MAP[p[0]];
            var x = parseInt(p[1]);
            var y = parseInt(p[2]);
            return new cls(p.slice(3, p.length), tiles[y][x]);
        }
    }]);

    return MapObject;
}();

var Shard = function (_MapObject) {
    _inherits(Shard, _MapObject);

    function Shard() {
        _classCallCheck(this, Shard);

        return _possibleConstructorReturn(this, (Shard.__proto__ || Object.getPrototypeOf(Shard)).apply(this, arguments));
    }

    _createClass(Shard, [{
        key: 'attackedBy',
        value: function attackedBy() {
            this.tile.unsetMapObject();
        }
    }]);

    return Shard;
}(MapObject);

var BlueShard = function (_Shard) {
    _inherits(BlueShard, _Shard);

    function BlueShard() {
        _classCallCheck(this, BlueShard);

        return _possibleConstructorReturn(this, (BlueShard.__proto__ || Object.getPrototypeOf(BlueShard)).apply(this, arguments));
    }

    _createClass(BlueShard, null, [{
        key: 'name',
        value: function name() {
            return 'bs';
        }
    }]);

    return BlueShard;
}(Shard);

var RedShard = function (_Shard2) {
    _inherits(RedShard, _Shard2);

    function RedShard() {
        _classCallCheck(this, RedShard);

        return _possibleConstructorReturn(this, (RedShard.__proto__ || Object.getPrototypeOf(RedShard)).apply(this, arguments));
    }

    _createClass(RedShard, null, [{
        key: 'name',
        value: function name() {
            return 'rs';
        }
    }]);

    return RedShard;
}(Shard);

var YellowShard = function (_Shard3) {
    _inherits(YellowShard, _Shard3);

    function YellowShard() {
        _classCallCheck(this, YellowShard);

        return _possibleConstructorReturn(this, (YellowShard.__proto__ || Object.getPrototypeOf(YellowShard)).apply(this, arguments));
    }

    _createClass(YellowShard, null, [{
        key: 'name',
        value: function name() {
            return 'ys';
        }
    }]);

    return YellowShard;
}(Shard);

var Vessel = function (_MapObject2) {
    _inherits(Vessel, _MapObject2);

    function Vessel(props, tile) {
        _classCallCheck(this, Vessel);

        var _this5 = _possibleConstructorReturn(this, (Vessel.__proto__ || Object.getPrototypeOf(Vessel)).apply(this, arguments));

        _this5.player = props[0];
        _this5.movement = 4;
        _this5.range = 1;
        return _this5;
    }

    _createClass(Vessel, [{
        key: 'serialize',
        value: function serialize() {
            return _get(Vessel.prototype.__proto__ || Object.getPrototypeOf(Vessel.prototype), 'serialize', this).call(this) + '-' + this.player;
        }
    }, {
        key: 'transfer',
        value: function transfer(tile, player) {
            if (player !== this.player) {
                throw Error('Invalid action: wrong player');
            }
            var mO = tile.getMapObject();
            if (mO !== null && mO.getPlayer() === this.player && this.getShard() !== null) {
                var cls = mO.consumeShard(this.getShard());
                new cls([mO.getPlayer()], tile);
                new WhiteVessel([this.player], this.tile);
            } else {
                throw Error('Invalid transfer tile');
            }
        }
    }, {
        key: 'attack',
        value: function attack(tile, player) {
            if (player !== this.player) {
                throw Error('Invalid action: wrong player');
            }
            if (!this.tile.getNeighbors(this.range).has(tile)) {
                throw Error('Invalid action: cannot reach tile');
            }

            var mO = tile.getMapObject();
            if (mO !== null) {
                mO.attackedBy(this);
            } else {
                throw Error('Invalid attack tile');
            }
        }
    }, {
        key: 'move',
        value: function move(tile, player) {
            if (player !== this.player) {
                throw Error('Invalid action: wrong player');
            }
            if (!this.tile.getNeighbors(this.movement).has(tile)) {
                throw Error('Invalid action: cannot reach tile');
            }

            var mO = tile.getMapObject();
            if (mO === null) {
                this.tile.unsetMapObject();
                tile.setMapObject(this);
                this.tile = tile;
            } else if (mO instanceof Shard) {
                var cls = this.consumeShard(mO);
                new cls([this.player], tile);
                this.tile.unsetMapObject();
            } else {
                throw Error('Invalid move tile');
            }
        }
    }, {
        key: 'getPlayer',
        value: function getPlayer() {
            return this.player;
        }
    }, {
        key: 'getShard',
        value: function getShard() {
            return null;
        }
    }, {
        key: 'attackedBy',
        value: function attackedBy() {
            this.tile.unsetMapObject();
        }
    }]);

    return Vessel;
}(MapObject);

var WhiteVessel = function (_Vessel) {
    _inherits(WhiteVessel, _Vessel);

    function WhiteVessel() {
        _classCallCheck(this, WhiteVessel);

        return _possibleConstructorReturn(this, (WhiteVessel.__proto__ || Object.getPrototypeOf(WhiteVessel)).apply(this, arguments));
    }

    _createClass(WhiteVessel, [{
        key: 'consumeShard',
        value: function consumeShard(shard) {
            if (shard instanceof BlueShard) {
                return BlueVessel;
            } else if (shard instanceof RedShard) {
                return RedVessel;
            } else if (shard instanceof YellowShard) {
                return YellowVessel;
            }
        }
    }], [{
        key: 'name',
        value: function name() {
            return 'w';
        }
    }]);

    return WhiteVessel;
}(Vessel);

var BlueVessel = function (_Vessel2) {
    _inherits(BlueVessel, _Vessel2);

    function BlueVessel() {
        _classCallCheck(this, BlueVessel);

        return _possibleConstructorReturn(this, (BlueVessel.__proto__ || Object.getPrototypeOf(BlueVessel)).apply(this, arguments));
    }

    _createClass(BlueVessel, [{
        key: 'getShard',
        value: function getShard() {
            return new BlueShard();
        }
    }], [{
        key: 'name',
        value: function name() {
            return 'b';
        }
    }]);

    return BlueVessel;
}(Vessel);

var RedVessel = function (_Vessel3) {
    _inherits(RedVessel, _Vessel3);

    function RedVessel() {
        _classCallCheck(this, RedVessel);

        return _possibleConstructorReturn(this, (RedVessel.__proto__ || Object.getPrototypeOf(RedVessel)).apply(this, arguments));
    }

    _createClass(RedVessel, [{
        key: 'getShard',
        value: function getShard() {
            return new RedShard();
        }
    }], [{
        key: 'name',
        value: function name() {
            return 'r';
        }
    }]);

    return RedVessel;
}(Vessel);

var YellowVessel = function (_Vessel4) {
    _inherits(YellowVessel, _Vessel4);

    function YellowVessel() {
        _classCallCheck(this, YellowVessel);

        var _this9 = _possibleConstructorReturn(this, (YellowVessel.__proto__ || Object.getPrototypeOf(YellowVessel)).apply(this, arguments));

        _this9.movement = 5;
        return _this9;
    }

    _createClass(YellowVessel, [{
        key: 'getShard',
        value: function getShard() {
            return new YellowShard();
        }
    }], [{
        key: 'name',
        value: function name() {
            return 'y';
        }
    }]);

    return YellowVessel;
}(Vessel);

var NAME_MAP = {
    bs: BlueShard,
    rs: RedShard,
    ys: YellowShard,
    w: WhiteVessel,
    b: BlueVessel,
    r: RedVessel,
    y: YellowVessel
};

exports.MapObject = MapObject;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MapScreen = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Vector = __webpack_require__(0);

var _Viewport = __webpack_require__(13);

var _Polygon = __webpack_require__(10);

var _PolygonRenderer = __webpack_require__(11);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapScreen = function () {
    function MapScreen(canvas, map) {
        _classCallCheck(this, MapScreen);

        this.canvas = canvas;
        this.map = map;
        this.viewport = new _Viewport.Viewport(new _Vector.Point(0, 0, 500), new _Vector.Point(this.canvas.width, 0, 500), new _Vector.Point(0, this.canvas.height, 500), new _Vector.Point(this.canvas.width, this.canvas.height, 500), 500);
        this.pressed = {};

        var TLEN = 100;
        var polygons = this.map.getTilesFlattened().map(function (t) {
            return _Polygon.Polygon.createBox(t.getX() * TLEN, t.getY() * TLEN, 0, TLEN, TLEN, t.getH() * TLEN);
        });
        polygons.push(_Polygon.Polygon.createIcosahedron(50, 50, 200, 20));

        this.renderer = new _PolygonRenderer.PolygonRenderer(this.canvas, polygons);
    }

    _createClass(MapScreen, [{
        key: "start",
        value: function start() {
            this.renderLoop();
        }
    }, {
        key: "renderLoop",
        value: function renderLoop() {
            var _this = this;

            this.viewport.updatePosition();
            this.renderer.render(this.viewport);
            window.requestAnimationFrame(function (step) {
                _this.renderLoop();
            });
        }

        /*turnLoop() {
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
        }*/

    }, {
        key: "animateNextTurn",
        value: function animateNextTurn(turnActor) {
            return this.mapRenderer.centerOn(turnActor);
            //return new Promise((resolve, reject) => {
            //    resolve();
            //return this.mapRenderer.centerOn(turnActor);
            //});
        }
    }, {
        key: "handleMouseDown",
        value: function handleMouseDown(x, y) {
            //this.startDragX = x;
            //this.startDragY = y;
        }
    }, {
        key: "handleMouseMove",
        value: function handleMouseMove(x, y) {
            this.viewport.setMouse(x, y);
            /*if (this.startDragX !== null && this.startDragY !== null) {
                const dx = this.startDragX - x;
                const dy = this.startDragY - y;
                this.viewport.translateAlongBasis(dx, dy);
                this.startDragX = x;
                this.startDragY = y;
            }*/
            //this.mapRenderer.renderMap();
        }
    }, {
        key: "handleMouseUp",
        value: function handleMouseUp(x, y) {
            //this.startDragX = null;
            //this.startDragY = null;
        }
    }, {
        key: "handleClick",
        value: function handleClick(x, y) {
            //this.viewport.mx = this.viewport.x1 + x;
            //this.viewport.my = this.viewport.y1 + y;
            /*const clickedObj = this.mapRenderer.getClickedObject();
            if (clickedObj instanceof Tile) {
                const action = this.map.getSelectedAction(clickedObj);
                if (action !== null && action.action === 'move') {
                    this.mapRenderer.animateMove(action.actor, action.receiver).then(() => {
                        this.map.applyAction(action.actor, action.action, action.receiver);
                    });
                }
            } else if (clickedObj instanceof ActorAction) {
                this.map.getTurnActor().handleAction(clickedObj);
            }*/
            //const clickedObjs = this.mapRenderer.getClickedObjects();

            //const rerender = this.map.clicked(clickedObjs);
            //if (rerender) {
            //this.mapRenderer.renderMap(this.map, this.viewport);
            //}
        }
    }, {
        key: "handleMouseLeave",
        value: function handleMouseLeave() {
            this.viewport.setMouse(null, null);
            //this.startDragX = null;
            //this.startDragY = null;
            //this.mapRenderer.renderMap(this.map, this.viewport);
        }
    }, {
        key: "handleKeyDown",
        value: function handleKeyDown(code) {
            if (!this.pressed[code]) {
                this.pressed[code] = true;
                var updateRates = {};
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
    }, {
        key: "handleKeyUp",
        value: function handleKeyUp(code) {
            if (this.pressed[code]) {
                this.pressed[code] = false;
                var updateRates = {};
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
    }]);

    return MapScreen;
}();

exports.MapScreen = MapScreen;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Objective = function () {
    function Objective(fn, num) {
        _classCallCheck(this, Objective);

        this.fn = fn;
        this.num = num;
    }

    _createClass(Objective, [{
        key: 'serialize',
        value: function serialize() {
            return this.num;
        }
    }, {
        key: 'check',
        value: function check(map) {
            return this.fn.check(map);
        }
    }, {
        key: 'success',
        value: function success(map) {
            return this.fn.success(map);
        }
    }], [{
        key: 'deserialize',
        value: function deserialize(num) {
            return new Objective(OBJECT_FNS[num], num);
        }
    }]);

    return Objective;
}();

var OBJECT_FNS = {
    0: {
        check: function check(map) {
            var players = map.getMapObjects().map(function (m) {
                return m.getPlayer();
            }).filter(function (p) {
                return p !== null;
            });
            var player = players.filter(function (p) {
                return p === '0';
            });
            var enemies = players.filter(function (p) {
                return p !== '0';
            });
            return player.length === 0 || enemies.length === 0;
        },
        success: function success(map) {
            var players = map.getMapObjects().map(function (m) {
                return m.getPlayer();
            });
            var enemies = players.filter(function (p) {
                return p !== '0' && p !== null;
            });
            return enemies.length === 0;
        }
    }
};

exports.Objective = Objective;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PolygonFace = exports.Polygon = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Vector = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Polygon = function () {
    function Polygon(faces, type) {
        var _this = this;

        _classCallCheck(this, Polygon);

        this.faces = faces;
        faces.forEach(function (face) {
            return face.setPolygon(_this);
        });
        this.type = type;
        this.clippedFace = null;
        this.hover = false;
    }

    _createClass(Polygon, [{
        key: 'getHover',
        value: function getHover() {
            return this.hover;
        }
    }, {
        key: 'toggleHover',
        value: function toggleHover() {
            this.hover = !this.hover;
        }
    }, {
        key: 'getFaces',
        value: function getFaces() {
            return this.faces;
        }
    }, {
        key: 'getClippedFace',
        value: function getClippedFace() {
            return this.clippedFace;
        }
    }, {
        key: 'calcClippedFace',
        value: function calcClippedFace() {
            var newFacePoints = null;
            this.faces.forEach(function (face) {
                var clippedPoints = face.getClippedPoints();
                if (clippedPoints.length > 0) {
                    if (newFacePoints === null) {
                        newFacePoints = clippedPoints.slice();
                    } else {
                        for (var i = 0; i < clippedPoints.length; i++) {
                            var c = clippedPoints[i];
                            var minDist = null;
                            var minDistIdx = null;
                            var match = false;
                            for (var j = 0; j < newFacePoints.length; j++) {
                                var cp = newFacePoints[j];
                                var nextcp = j == newFacePoints.length - 1 ? newFacePoints[0] : newFacePoints[j + 1];
                                var currDist = _Vector.Vector.createFromPoints(cp, nextcp).getMag();
                                var cDist1 = _Vector.Vector.createFromPoints(cp, c).getMag();
                                var cDist2 = _Vector.Vector.createFromPoints(nextcp, c).getMag();
                                var distInc = cDist1 + cDist2 - currDist;
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
                this.clippedFace = new PolygonFace();
                this.clippedFace.setVisiblePoints(newFacePoints, []);
                this.clippedFace.setPolygon(this);
            } else {
                this.clippedFace = null;
            }
        }
    }, {
        key: 'splitFace',
        value: function splitFace(face, points1, points2) {
            this.faces.splice(this.faces.indexOf(face), 1);
            var face1 = new PolygonFace(points1, face.getNormal());
            var face2 = new PolygonFace(points2, face.getNormal());
            face1.setPolygon(this);
            face2.setPolygon(this);

            var blacklist = face.getEdgeBlacklist();
            var sharedPoints = points1.filter(function (p) {
                return points2.indexOf(p) !== -1;
            });
            var face1Blacklist = [sharedPoints];
            var face2Blacklist = [sharedPoints];
            for (var i = 0; i < blacklist.length; i++) {
                var b = blacklist[i];
                var idx1 = points1.indexOf(b[0]);
                var idx2 = points1.indexOf(b[1]);
                if (idx1 !== -1 && idx2 !== -1) {
                    face1Blacklist.push(b);
                } else if (idx1 !== -1 && idx2 === -1) {
                    var nidx = idx1 === points1.length - 1 ? 0 : idx1 + 1;
                    var pidx = idx1 === 0 ? points1.length - 1 : idx1 - 1;
                    if (sharedPoints.indexOf(points1[nidx]) !== -1) {
                        face1Blacklist.push([b[0], points1[nidx]]);
                    } else {
                        face1Blacklist.push([b[0], points1[pidx]]);
                    }
                } else if (idx1 === -1 && idx2 !== -1) {
                    var _nidx = idx2 === points1.length - 1 ? 0 : idx2 + 1;
                    var _pidx = idx2 === 0 ? points1.length - 1 : idx2 - 1;
                    if (sharedPoints.indexOf(points1[_nidx]) !== -1) {
                        face1Blacklist.push([b[1], points1[_nidx]]);
                    } else {
                        face1Blacklist.push([b[1], points1[_pidx]]);
                    }
                }

                idx1 = points2.indexOf(b[0]);
                idx2 = points2.indexOf(b[1]);
                if (idx1 !== -1 && idx2 !== -1) {
                    face2Blacklist.push(b);
                } else if (idx1 !== -1 && idx2 === -1) {
                    var _nidx2 = idx1 === points2.length - 1 ? 0 : idx1 + 1;
                    var _pidx2 = idx1 === 0 ? points2.length - 1 : idx1 - 1;
                    if (sharedPoints.indexOf(points2[_nidx2]) !== -1) {
                        face2Blacklist.push([b[0], points2[_nidx2]]);
                    } else {
                        face2Blacklist.push([b[0], points2[_pidx2]]);
                    }
                } else if (idx1 === -1 && idx2 !== -1) {
                    var _nidx3 = idx2 === points2.length - 1 ? 0 : idx2 + 1;
                    var _pidx3 = idx2 === 0 ? points2.length - 1 : idx2 - 1;
                    if (sharedPoints.indexOf(points2[_nidx3]) !== -1) {
                        face2Blacklist.push([b[1], points2[_nidx3]]);
                    } else {
                        face2Blacklist.push([b[1], points2[_pidx3]]);
                    }
                }
            }

            face1.setEdgeBlacklist(face1Blacklist);
            face2.setEdgeBlacklist(face2Blacklist);
            this.faces.push(face1);
            this.faces.push(face2);
            return {
                face1: face1,
                face2: face2
            };
        }
    }], [{
        key: 'createBox',
        value: function createBox(x, y, z, w, l, h) {
            var v = [new _Vector.Point(x, y, z + h), new _Vector.Point(x + w, y, z + h), new _Vector.Point(x + w, y + l, z + h), new _Vector.Point(x, y + l, z + h), new _Vector.Point(x, y, z), new _Vector.Point(x + w, y, z), new _Vector.Point(x + w, y + l, z), new _Vector.Point(x, y + l, z)];
            var faces = [new PolygonFace([v[0], v[1], v[2], v[3]], new _Vector.Vector(0, 0, 1)), new PolygonFace([v[1], v[2], v[6], v[5]], new _Vector.Vector(1, 0, 0)), new PolygonFace([v[4], v[5], v[6], v[7]], new _Vector.Vector(0, 0, -1)), new PolygonFace([v[0], v[1], v[5], v[4]], new _Vector.Vector(0, -1, 0)), new PolygonFace([v[0], v[3], v[7], v[4]], new _Vector.Vector(-1, 0, 0)), new PolygonFace([v[2], v[3], v[7], v[6]], new _Vector.Vector(0, 1, 0))];

            return new Polygon(faces, 'box');
        }
    }, {
        key: 'createIcosahedron',
        value: function createIcosahedron(x, y, z, scale) {
            var t = (1 + Math.sqrt(5)) / 2;
            var v = [new _Vector.Point(-1, t, 0), new _Vector.Point(1, t, 0), new _Vector.Point(-1, -t, 0), new _Vector.Point(1, -t, 0), new _Vector.Point(0, -1, t), new _Vector.Point(0, 1, t), new _Vector.Point(0, -1, -t), new _Vector.Point(0, 1, -t), new _Vector.Point(t, 0, -1), new _Vector.Point(t, 0, 1), new _Vector.Point(-t, 0, -1), new _Vector.Point(-t, 0, 1)];

            var faces = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]].map(function (idx) {
                var p1 = v[idx[0]];
                var p2 = v[idx[1]];
                var p3 = v[idx[2]];
                var v1 = _Vector.Vector.createFromPoints(p1, p2);
                var v2 = _Vector.Vector.createFromPoints(p1, p3);
                var n = v1.cross(v2);
                n.normalize();
                return new PolygonFace([p1, p2, p3], n);
            });

            v.forEach(function (v) {
                v.scale(scale);
                v.translate(x, y, z);
            });

            return new Polygon(faces, 'icosahedron');
        }
    }]);

    return Polygon;
}();

var PolygonFace = function () {
    function PolygonFace(points, unitNormal) {
        _classCallCheck(this, PolygonFace);

        this.points = points;
        this.normal = unitNormal;
        this.polygon = null;
        this.visiblePoints = [];
        this.mapping = [];
        this.edgeBlacklist = [];
    }

    _createClass(PolygonFace, [{
        key: 'getPoints',
        value: function getPoints() {
            return this.points;
        }
    }, {
        key: 'getNormal',
        value: function getNormal() {
            return this.normal;
        }
    }, {
        key: 'getPolygon',
        value: function getPolygon() {
            return this.polygon;
        }
    }, {
        key: 'setPolygon',
        value: function setPolygon(polygon) {
            this.polygon = polygon;
        }
    }, {
        key: 'getClippedPoints',
        value: function getClippedPoints() {
            var clippedPoints = [];
            for (var i = 0; i < this.mapping.length; i++) {
                if (typeof this.mapping[i] !== 'number') {
                    clippedPoints.push(this.visiblePoints[i]);
                }
            }
            return clippedPoints;
        }
    }, {
        key: 'getVisiblePoints',
        value: function getVisiblePoints() {
            return this.visiblePoints;
        }
    }, {
        key: 'setVisiblePoints',
        value: function setVisiblePoints(points, mapping) {
            this.visiblePoints = points;
            this.mapping = mapping;
        }
    }, {
        key: 'getEdgeBlacklist',
        value: function getEdgeBlacklist() {
            return this.edgeBlacklist;
        }
    }, {
        key: 'setEdgeBlacklist',
        value: function setEdgeBlacklist(blacklist) {
            this.edgeBlacklist = blacklist;
        }
    }, {
        key: 'draw',
        value: function draw(ctx) {
            var fillColor = void 0;
            if (this.polygon.getHover()) {
                fillColor = "#E6E6E6";
            } else {
                fillColor = "#CCCCCC";
            }
            ctx.fillStyle = fillColor;
            ctx.beginPath();
            var k = void 0;
            for (k = 0; k < this.visiblePoints.length; k++) {
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

            var nextK = void 0;
            var edge = void 0;
            var blacklist = void 0;
            ctx.strokeStyle = "#000000";
            //Draw outline
            for (k = 0; k < this.visiblePoints.length; k++) {
                nextK = k === this.visiblePoints.length - 1 ? 0 : k + 1;
                edge = null;
                blacklist = false;
                if (typeof this.mapping[k] === 'number') {
                    if (typeof this.mapping[nextK] === 'number') {
                        edge = [this.points[this.mapping[k]], this.points[this.mapping[nextK]]];
                    } else {
                        if (this.points[this.mapping[k]] === this.points[this.mapping[nextK][0]]) {
                            edge = [this.points[this.mapping[k]], this.points[this.mapping[nextK][1]]];
                        } else {
                            edge = [this.points[this.mapping[k]], this.points[this.mapping[nextK][0]]];
                        }
                    }
                } else if (typeof this.mapping[nextK] === 'number') {
                    if (this.points[this.mapping[k][0]] === this.points[this.mapping[nextK]]) {
                        edge = [this.points[this.mapping[k][1]], this.points[this.mapping[nextK]]];
                    } else {
                        edge = [this.points[this.mapping[k][0]], this.points[this.mapping[nextK]]];
                    }
                }

                if (edge !== null) {
                    blacklist = this.edgeBlacklist.filter(function (b) {
                        return b.indexOf(edge[0]) !== -1 && b.indexOf(edge[1]) !== -1;
                    }).length > 0;
                }

                if (!blacklist) {
                    ctx.beginPath();
                    ctx.moveTo(this.visiblePoints[k].getX(), this.visiblePoints[k].getY());
                    ctx.lineTo(this.visiblePoints[nextK].getX(), this.visiblePoints[nextK].getY());
                    ctx.stroke();
                }
            }
        }
    }]);

    return PolygonFace;
}();

exports.Polygon = Polygon;
exports.PolygonFace = PolygonFace;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PolygonRenderer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BSPTree = __webpack_require__(4);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PolygonRenderer = function () {
    function PolygonRenderer(canvas, staticPolygons) {
        _classCallCheck(this, PolygonRenderer);

        this.canvas = canvas;
        this.bsp = new _BSPTree.BSPTree(staticPolygons.reduce(function (a, b) {
            return a.concat(b.getFaces());
        }, []));
        this.staticPolygons = staticPolygons;
        this.hoveredPolygon = null;
    }

    _createClass(PolygonRenderer, [{
        key: "render",
        value: function render(viewport) {
            var ctx = this.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            var facesToDraw = [];
            var hoveredFace = null;
            this.bsp.traverse(function (face) {
                var _viewport$projectFace = viewport.projectFace(face),
                    visiblePoints = _viewport$projectFace.visiblePoints,
                    mapping = _viewport$projectFace.mapping,
                    visible = _viewport$projectFace.visible;

                face.setVisiblePoints(visiblePoints, mapping);
                if (visible) {
                    if (viewport.mouseInside(visiblePoints)) {
                        hoveredFace = face;
                    }
                    facesToDraw.push(face);
                }
            }, viewport);

            this.staticPolygons.forEach(function (polygon) {
                polygon.calcClippedFace();
                var clippedFace = polygon.getClippedFace();
                if (clippedFace !== null) {
                    if (viewport.mouseInside(clippedFace.getVisiblePoints())) {
                        hoveredFace = clippedFace;
                    }
                    facesToDraw.push(clippedFace);
                }
            });

            if (this.hoveredPolygon !== null) {
                this.hoveredPolygon.toggleHover();
            }
            if (hoveredFace !== null) {
                this.hoveredPolygon = hoveredFace.getPolygon();
                this.hoveredPolygon.toggleHover();
            } else {
                this.hoveredPolygon = null;
            }

            facesToDraw.forEach(function (face) {
                return face.draw(ctx);
            });
        }
    }]);

    return PolygonRenderer;
}();

exports.PolygonRenderer = PolygonRenderer;

/***/ }),
/* 12 */
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
    function Tile(x, y, h) {
        _classCallCheck(this, Tile);

        this.x = x;
        this.y = y;
        this.h = h;
        this.left = null;
        this.right = null;
        this.top = null;
        this.down = null;
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
        key: 'setMapObject',
        value: function setMapObject(mapObject) {
            this.mapObject = mapObject;
        }
    }, {
        key: 'unsetMapObject',
        value: function unsetMapObject() {
            this.mapObject = null;
        }
    }, {
        key: 'getMapObject',
        value: function getMapObject() {
            return this.mapObject;
        }
    }, {
        key: 'getNeighbors',
        value: function getNeighbors(dist) {
            var _this = this;

            var dirs = ['left', 'right', 'top', 'down'];
            var queue = new Set([this]);
            var nextQueue = void 0;
            var results = new Set();
            for (var i = 0; i < dist; i++) {
                nextQueue = new Set();
                queue.forEach(function (tile) {
                    dirs.forEach(function (dir) {
                        if (tile[dir] !== null && tile[dir] !== _this && tile[dir].movable()) {
                            if (!results.has(tile[dir])) {
                                results.add(tile[dir]);
                                nextQueue.add(tile[dir]);
                            }
                        }
                    });
                });
                queue = nextQueue;
            }
            return results;
        }
    }, {
        key: 'movable',
        value: function movable() {
            return true;
        }
    }, {
        key: 'serialize',
        value: function serialize() {
            return this.constructor.name() + '-' + this.h;
        }
    }], [{
        key: 'getClass',
        value: function getClass(name) {
            return TILE_MAP[name];
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

    _createClass(PlainTile, null, [{
        key: 'name',
        value: function name() {
            return 'p';
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
        key: 'movable',
        value: function movable() {
            return false;
        }
    }, {
        key: 'getNeighbors',
        value: function getNeighbors() {
            return new Set();
        }
    }], [{
        key: 'name',
        value: function name() {
            return 'e';
        }
    }]);

    return EmptyTile;
}(Tile);

var TILE_MAP = {
    p: PlainTile,
    e: EmptyTile
};

exports.Tile = Tile;
exports.EmptyTile = EmptyTile;
exports.PlainTile = PlainTile;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Viewport = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Vector = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        this.calcVectors();

        this.rates = {
            r1: 0,
            r2: 0,
            t1: 0,
            t2: 0,
            t3: 0
        };
        this.mx = null;
        this.my = null;
        this.animation = null;
    }

    _createClass(Viewport, [{
        key: 'projectFace',
        value: function projectFace(face) {
            var points = face.getPoints();
            var n = face.getNormal();
            var visiblePoints = [];
            var clippedPoints = [];
            var mapping = [];
            var viewVector = void 0,
                pointVector = void 0,
                pz = void 0,
                li = void 0,
                lz = void 0,
                ri = void 0,
                rz = void 0,
                midpoint = void 0,
                projected = void 0;
            var threshold = this.d;
            var visible = null;
            if (this.d === -1) {
                threshold = 0;
                visible = this.unitNormal.dot(n) < 0;
            }

            for (var i = 0; i < points.length; i++) {
                if (this.d !== -1) {
                    viewVector = _Vector.Vector.createFromPoints(this.p5, points[i]);
                } else {
                    viewVector = _Vector.Vector.createFromPoints(this.midpoint, points[i]);
                }
                pz = viewVector.dot(this.unitNormal);
                if (pz >= threshold) {
                    if (visible === null) {
                        visible = viewVector.dot(n) < 0;
                    }
                    if (this.d === -1) {
                        pointVector = _Vector.Vector.createFromPoints(this.p1, points[i]);
                    } else {
                        midpoint = this.p5.midpoint(points[i], this.d / pz);
                        pointVector = _Vector.Vector.createFromPoints(this.p1, midpoint);
                    }
                    projected = new _Vector.Point(pointVector.dot(this.basis1), pointVector.dot(this.basis2), 0);
                    visiblePoints.push(projected);
                    mapping.push(i);
                } else {
                    li = i == 0 ? points.length - 1 : i - 1;
                    if (this.d !== -1) {
                        viewVector = _Vector.Vector.createFromPoints(this.p5, points[li]);
                    } else {
                        viewVector = _Vector.Vector.createFromPoints(this.midpoint, points[li]);
                    }
                    lz = viewVector.dot(this.unitNormal);
                    if (lz >= threshold) {
                        midpoint = points[i].midpoint(points[li], (threshold - pz) / (lz - pz));
                        pointVector = _Vector.Vector.createFromPoints(this.p1, midpoint);
                        projected = new _Vector.Point(pointVector.dot(this.basis1), pointVector.dot(this.basis2), 0);
                        visiblePoints.push(projected);
                        mapping.push([li, i]);
                    }
                    ri = i == points.length - 1 ? 0 : i + 1;
                    if (this.d !== -1) {
                        viewVector = _Vector.Vector.createFromPoints(this.p5, points[ri]);
                    } else {
                        viewVector = _Vector.Vector.createFromPoints(this.midpoint, points[ri]);
                    }
                    rz = viewVector.dot(this.unitNormal);
                    if (rz >= threshold) {
                        midpoint = points[i].midpoint(points[ri], (threshold - pz) / (rz - pz));
                        pointVector = _Vector.Vector.createFromPoints(this.p1, midpoint);
                        projected = new _Vector.Point(pointVector.dot(this.basis1), pointVector.dot(this.basis2), 0);
                        visiblePoints.push(projected);
                        mapping.push([i, ri]);
                    }
                }
            }
            return {
                visiblePoints: visiblePoints,
                mapping: mapping,
                visible: visible
            };
        }
    }, {
        key: 'projectPoint',
        value: function projectPoint(point) {
            var viewVector = void 0,
                pointVector = void 0,
                threshold = void 0;
            if (this.d !== -1) {
                viewVector = _Vector.Vector.createFromPoints(this.p5, point);
                threshold = this.d;
            } else {
                viewVector = _Vector.Vector.createFromPoints(this.midpoint, point);
                threshhold = 0;
            }

            var pz = viewVector.dot(this.unitNormal);
            if (pz >= threshold) {
                if (this.d !== -1) {
                    var midpoint = this.p5.midpoint(point, this.d / pz);
                    pointVector = _Vector.Vector.createFromPoints(this.p1, midpoint);
                } else {
                    pointVector = _Vector.Vector.createFromPoints(this.p1, point);
                }
                return new _Vector.Point(pointVector.dot(this.basis1), pointVector.dot(this.basis2), 0);
            }
            return null;
        }
    }, {
        key: 'calcViewAngle',
        value: function calcViewAngle(point, vector) {
            var viewVector = void 0;
            if (this.d !== -1) {
                viewVector = _Vector.Vector.createFromPoints(this.p5, point);
            } else {
                viewVector = this.unitNormal;
            }
            var cosTheta = viewVector.dot(vector) / viewVector.getMag();
            return Math.acos(cosTheta);
        }
    }, {
        key: 'calcVectors',
        value: function calcVectors() {
            this.basis1 = _Vector.Vector.createFromPoints(this.p1, this.p2);
            this.width = this.basis1.mag;
            this.basis1.normalize();
            this.basis2 = _Vector.Vector.createFromPoints(this.p1, this.p3);
            this.height = this.basis2.mag;
            this.basis2.normalize();
            this.unitNormal = this.basis2.cross(this.basis1);
            this.midpoint = this.p1.midpoint(this.p4, 0.5);
            if (this.d !== -1) {
                var xDist = this.unitNormal.x * this.d;
                var yDist = this.unitNormal.y * this.d;
                var zDist = this.unitNormal.z * this.d;
                this.p5 = this.midpoint.copy();
                this.p5.translate(-xDist, -yDist, -zDist);
            }
        }
    }, {
        key: 'translateAlongBasis',
        value: function translateAlongBasis(s1, s2, s3) {
            var xDist = this.basis1.x * s1 + this.basis2.x * s2 + this.unitNormal.x * s3;
            var yDist = this.basis1.y * s1 + this.basis2.y * s2 + this.unitNormal.y * s3;
            var zDist = this.basis1.z * s1 + this.basis2.z * s2 + this.unitNormal.z * s3;
            this.translate(xDist, yDist, zDist);
        }
    }, {
        key: 'translate',
        value: function translate(x, y, z) {
            var calc = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

            this.p1.translate(x, y, z);
            this.p2.translate(x, y, z);
            this.p3.translate(x, y, z);
            this.p4.translate(x, y, z);
            if (calc) {
                this.calcVectors();
            }
        }
    }, {
        key: 'rotateByBasis',
        value: function rotateByBasis(theta1, theta2, theta3) {
            var xDist = this.midpoint.getX();
            var yDist = this.midpoint.getY();
            var zDist = this.midpoint.getZ();
            var rad1 = theta1 / 360 * Math.PI;
            var rad2 = theta2 / 360 * Math.PI;
            var rad3 = theta3 / 360 * Math.PI;

            this.translate(-xDist, -yDist, -zDist, false);
            this.p1.rotate(this.basis1, rad1);
            this.p1.rotate(this.basis2, rad2);
            this.p1.rotate(this.unitNormal, rad3);
            this.p2.rotate(this.basis1, rad1);
            this.p2.rotate(this.basis2, rad2);
            this.p2.rotate(this.unitNormal, rad3);
            this.p3.rotate(this.basis1, rad1);
            this.p3.rotate(this.basis2, rad2);
            this.p3.rotate(this.unitNormal, rad3);
            this.p4.rotate(this.basis1, rad1);
            this.p4.rotate(this.basis2, rad2);
            this.p4.rotate(this.unitNormal, rad3);
            this.translate(xDist, yDist, zDist, true);
        }
    }, {
        key: 'animate',
        value: function animate(animation) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                animation.resolve = resolve;
                _this.animation = animation;
            });
        }
    }, {
        key: 'updatePosition',
        value: function updatePosition() {
            if (this.animation !== null) {
                if (this.animation.rate === null) {
                    this.animation.rate = {
                        x: (this.animation.endpoint.getX() - this.p1.getX()) / this.animation.frames,
                        y: (this.animation.endpoint.getY() - this.p1.getY()) / this.animation.frames,
                        z: (this.animation.endpoint.getZ() - this.p1.getZ()) / this.animation.frames
                    };
                }
                var dx = this.animation.rate.x;
                var dy = this.animation.rate.y;
                var dz = this.animation.rate.z;
                this.translate(dx, dy, dz);
                this.animation.frames -= 1;
                if (this.animation.frames === 0) {
                    this.animation.resolve();
                    this.animation = null;
                }
            } else {
                if (this.rates.r1 || this.rates.r2) {
                    this.rotateByBasis(this.rates.r1, this.rates.r2, 0);
                }
                if (this.rates.t1 || this.rates.t2 || this.rates.t3) {
                    this.translateAlongBasis(this.rates.t1, this.rates.t2, this.rates.t3);
                }
            }
        }
    }, {
        key: 'updateRates',
        value: function updateRates(rates) {
            this.rates.r1 += rates.r1 || 0;
            this.rates.r2 += rates.r2 || 0;
            this.rates.t1 += rates.t1 || 0;
            this.rates.t2 += rates.t2 || 0;
            this.rates.t3 += rates.t3 || 0;
        }
    }, {
        key: 'setMouse',
        value: function setMouse(x, y) {
            this.mx = x;
            this.my = y;
        }
    }, {
        key: 'mouseInside',
        value: function mouseInside(points) {
            if (this.mx === null && this.my === null) {
                return false;
            }
            var zPos = null;
            for (var i = 0; i < points.length; i++) {
                var p = points[i];
                var np = i === points.length - 1 ? points[0] : points[i + 1];
                var v1 = {
                    x: np.getX() - p.getX(),
                    y: np.getY() - p.getY()
                };
                var v2 = {
                    x: this.mx - p.getX(),
                    y: this.my - p.getY()
                };
                var cross = v1.x * v2.y - v1.y * v2.x;
                if (zPos === null) {
                    zPos = cross > 0;
                } else if (cross > 0 !== zPos) {
                    return false;
                }
            }
            return true;
        }
    }, {
        key: 'getViewDir',
        value: function getViewDir(point, n) {
            var dot = void 0;
            if (this.d === -1) {
                dot = n.dot(this.unitNormal);
            } else {
                dot = n.dot(_Vector.Vector.createFromPoints(this.p5, point));
            }
            return dot <= 0 ? 'towards' : 'away';
        }
    }, {
        key: 'getViewVector',
        value: function getViewVector(point) {
            if (this.d !== -1) {
                return new _Vector.Vector.createFromPoints(this.p5, point);
            } else {
                return this.unitNormal;
            }
        }
    }, {
        key: 'getCenteredP1',
        value: function getCenteredP1(point, dist) {
            var px = point.getX() - dist * this.unitNormal.getX();
            var py = point.getY() - dist * this.unitNormal.getY();
            var pz = point.getZ() - dist * this.unitNormal.getZ();
            var dx = px - this.midpoint.getX();
            var dy = py - this.midpoint.getY();
            var dz = pz - this.midpoint.getZ();
            return new _Vector.Point(this.p1.getX() + dx, this.p1.getY() + dy, this.p1.getZ() + dz);
        }
    }]);

    return Viewport;
}();

exports.Viewport = Viewport;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Game = __webpack_require__(2);

var _Game2 = _interopRequireDefault(_Game);

__webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var g = new _Game2.default(window.innerWidth - 16, window.innerHeight - 16);
g.start();

/***/ }),
/* 15 */
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
/* 16 */
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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(15)(undefined);
// imports


// module
exports.push([module.i, "canvas {\n\tborder: 1px solid black;\n}", ""]);

// exports


/***/ }),
/* 18 */
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

var	fixUrls = __webpack_require__(16);

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