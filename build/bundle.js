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
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Color = function () {
    function Color(r, g, b, a) {
        _classCallCheck(this, Color);

        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    _createClass(Color, [{
        key: "set",
        value: function set(r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
    }, {
        key: "getString",
        value: function getString() {
            return "rgba(" + Math.floor(this.r) + ", " + Math.floor(this.g) + ", " + Math.floor(this.b) + ", " + this.a + ")";
        }
    }, {
        key: "getR",
        value: function getR() {
            return this.r;
        }
    }, {
        key: "getG",
        value: function getG() {
            return this.g;
        }
    }, {
        key: "getB",
        value: function getB() {
            return this.b;
        }
    }, {
        key: "getA",
        value: function getA() {
            return this.a;
        }
    }, {
        key: "translate",
        value: function translate(r, g, b, a) {
            this.r += r;
            this.g += g;
            this.b += b;
            this.a += a;
        }
    }]);

    return Color;
}();

exports.Color = Color;

/***/ }),
/* 2 */
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
        key: 'getKey',
        value: function getKey() {
            return this.constructor.name() + '-' + this.x + '-' + this.y;
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            var json = {
                x: this.x,
                y: this.y,
                h: this.h,
                type: this.constructor.name(),
                key: this.getKey()
            };
            if (this.mapObject !== null) {
                json.mapObject = this.mapObject.toJSON();
            }
            return json;
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

    _createClass(EmptyTile, null, [{
        key: 'name',
        value: function name() {
            return 'e';
        }
    }]);

    return EmptyTile;
}(Tile);

var TileGroup = function () {
    function TileGroup(tiles) {
        _classCallCheck(this, TileGroup);

        this.tiles = tiles;
    }

    _createClass(TileGroup, [{
        key: 'getMapObjects',
        value: function getMapObjects() {
            return this.tiles.map(function (t) {
                return t.getMapObject();
            }).filter(function (m) {
                return m !== null;
            });
        }
    }, {
        key: 'getTiles',
        value: function getTiles() {
            return this.tiles;
        }
    }]);

    return TileGroup;
}();

var TileFactory = {
    map: {
        p: PlainTile,
        e: EmptyTile
    },
    create: function create(json) {
        var cls = this.map[json.type];
        return new cls(json.x, json.y, json.h);
    },
    getJSON: function getJSON(propString) {
        var props = propString.split('-');
        return {
            type: props[0],
            h: parseInt(props[1])
        };
    },
    getPropString: function getPropString(json) {
        return json.type + '-' + json.h;
    }
};

exports.Tile = Tile;
exports.EmptyTile = EmptyTile;
exports.PlainTile = PlainTile;
exports.TileGroup = TileGroup;
exports.TileFactory = TileFactory;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MapObjectFactory = exports.MapObject = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Color = __webpack_require__(1);

var _Tile = __webpack_require__(2);

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapObject = function () {
    function MapObject(props) {
        var tile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        _classCallCheck(this, MapObject);

        this.player = null;
        this.tile = tile;
        if (tile !== null) {
            tile.setMapObject(this);
        }
    }

    _createClass(MapObject, [{
        key: 'setTile',
        value: function setTile(tile) {
            this.tile = tile;
            tile.setMapObject(this);
        }
    }, {
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
        key: 'getH',
        value: function getH() {
            return this.tile.getH();
        }
    }, {
        key: 'getPlayer',
        value: function getPlayer() {
            return this.player;
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return {
                type: this.constructor.name(),
                x: this.tile.getX(),
                y: this.tile.getY()
            };
        }
    }], [{
        key: 'name',
        value: function name() {
            throw Error('Unimplemented');
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
        value: function attackedBy(vessel) {
            this.tile.unsetMapObject();
            return {
                key: this.getKey(),
                color: null
            };
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

    function Vessel(props) {
        var tile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        _classCallCheck(this, Vessel);

        var _this5 = _possibleConstructorReturn(this, (Vessel.__proto__ || Object.getPrototypeOf(Vessel)).apply(this, arguments));

        _this5.player = props.player;
        _this5.movement = 4;
        _this5.range = 1;
        return _this5;
    }

    _createClass(Vessel, [{
        key: 'toJSON',
        value: function toJSON() {
            var json = _get(Vessel.prototype.__proto__ || Object.getPrototypeOf(Vessel.prototype), 'toJSON', this).call(this);
            json.player = this.player;
            return json;
        }
    }, {
        key: 'getMoveActions',
        value: function getMoveActions() {
            var paths = this.getMoveablePaths();
            var srcKey = this.tile.getKey();
            var actions = [];
            for (var key in paths) {
                actions.push({
                    name: 'move',
                    src: srcKey,
                    dst: key,
                    path: paths[key]
                });
            }
            return actions;
        }
    }, {
        key: 'getTransferActions',
        value: function getTransferActions(objs) {
            var _this6 = this;

            if (this.getShard() === null) {
                return [];
            }
            return objs.filter(function (o) {
                return o !== _this6 && o.getShard() === null;
            }).map(function (o) {
                return {
                    name: 'transfer',
                    src: _this6.tile.getKey(),
                    dst: o.tile.getKey()
                };
            });
        }
    }, {
        key: 'getAttackActions',
        value: function getAttackActions() {
            var _this7 = this;

            var tileGroups = this.getAttackableTileGroups();
            tileGroups = tileGroups.filter(function (t) {
                return t.getMapObjects().length > 0;
            });
            return tileGroups.map(function (t) {
                return {
                    name: 'attack',
                    src: _this7.tile.getKey(),
                    dst: t.getTiles().map(function (tile) {
                        return tile.getKey();
                    })
                };
            });
        }
    }, {
        key: 'transfer',
        value: function transfer(tile) {
            var target = tile.getMapObject();
            var cls = target.consumeShard(this.getShard());
            var newObj = new cls(target.toJSON(), tile);
            var origObj = new WhiteVessel(this.toJSON(), this.tile);
        }
    }, {
        key: 'attack',
        value: function attack(tiles) {
            var _this8 = this;

            tiles.map(function (t) {
                return t.getMapObject();
            }).filter(function (m) {
                return m !== null;
            }).forEach(function (m) {
                return m.attackedBy(_this8);
            });
        }
    }, {
        key: 'move',
        value: function move(tile) {
            var mO = tile.getMapObject();
            if (mO === null) {
                this.tile.unsetMapObject();
                tile.setMapObject(this);
                this.tile = tile;
            } else if (mO instanceof Shard) {
                var cls = this.consumeShard(mO);
                var newObj = new cls(this.toJSON(), tile);
                this.tile.unsetMapObject();
            }
        }
    }, {
        key: 'getShard',
        value: function getShard() {
            return null;
        }
    }, {
        key: 'getAttackableTileGroups',
        value: function getAttackableTileGroups() {
            var _this9 = this;

            var dirs = ['left', 'right', 'top', 'down'];
            var queue = new Set([this.tile]);
            var nextQueue = void 0;
            var tileSet = new Set();
            for (var i = 0; i < this.range; i++) {
                nextQueue = new Set();
                queue.forEach(function (tile) {
                    dirs.forEach(function (dir) {
                        var t = tile[dir];
                        if (t !== null && t !== _this9.tile) {
                            nextQueue.add(t);
                            tileSet.add(t);
                        }
                    });
                });
                queue = nextQueue;
            }
            return Array.from(tileSet).map(function (t) {
                return new _Tile.TileGroup([t]);
            });
        }
    }, {
        key: 'getMoveablePaths',
        value: function getMoveablePaths() {
            var _this10 = this;

            var dirs = ['left', 'right', 'top', 'down'];
            var queue = new Set([this.tile]);
            var nextQueue = void 0;
            var paths = {};
            var startKey = this.tile.getKey();
            paths[startKey] = [startKey];
            var keysToDelete = [startKey];
            for (var i = 0; i < this.movement; i++) {
                nextQueue = new Set();
                queue.forEach(function (tile) {
                    var key = tile.getKey();
                    dirs.forEach(function (dir) {
                        var t = tile[dir];
                        if (t !== null && t !== _this10.tile) {
                            if (_this10.canMoveThrough(t) && Math.abs(t.getH() - tile.getH()) < 2) {
                                var tkey = t.getKey();
                                if (paths[tkey] === undefined) {
                                    nextQueue.add(t);
                                    paths[tkey] = paths[key].concat(tkey);
                                    if (!_this10.canMoveTo(t)) {
                                        keysToDelete.push(tkey);
                                    }
                                }
                            }
                        }
                    });
                });
                queue = nextQueue;
            }
            keysToDelete.forEach(function (key) {
                return delete paths[key];
            });
            return paths;
        }
    }, {
        key: 'canMoveThrough',
        value: function canMoveThrough(tile) {
            if (tile instanceof _Tile.EmptyTile) {
                return false;
            }
            var mO = tile.getMapObject();
            if (mO === null || mO instanceof Shard || mO.getPlayer() === this.player) {
                return true;
            }
            return false;
        }
    }, {
        key: 'canMoveTo',
        value: function canMoveTo(tile) {
            if (tile instanceof _Tile.EmptyTile) {
                return false;
            }
            var mO = tile.getMapObject();
            if (mO === null || mO instanceof Shard) {
                return true;
            }
            return false;
        }
    }, {
        key: 'attackedBy',
        value: function attackedBy(vessel) {
            this.tile.unsetMapObject();
            return {
                key: this.getKey(),
                color: null
            };
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

        var _this12 = _possibleConstructorReturn(this, (BlueVessel.__proto__ || Object.getPrototypeOf(BlueVessel)).apply(this, arguments));

        _this12.range = 2;
        return _this12;
    }

    _createClass(BlueVessel, [{
        key: 'getShard',
        value: function getShard() {
            return new BlueShard();
        }
    }, {
        key: 'attackedBy',
        value: function attackedBy(vessel) {
            if (vessel instanceof WhiteVessel) {
                var obj = new WhiteVessel(this.toJSON(), tile);
                return {
                    key: this.getKey(),
                    color: obj.getColor()
                };
            }
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
    }, {
        key: 'attackedBy',
        value: function attackedBy(vessel) {
            if (vessel instanceof WhiteVessel) {
                var obj = new WhiteVessel([this.player], this.tile, this.getKey());
                return {
                    key: this.getKey(),
                    color: obj.getColor()
                };
            }
        }
    }, {
        key: 'getAttackableTargets',
        value: function getAttackableTargets() {
            var _this14 = this;

            var dirs1 = ['left', 'right'];
            var dirs2 = ['top', 'down'];
            var tileSet = new Set();
            dirs1.forEach(function (dir) {
                var t = _this14.tile[dir];
                if (t !== null) {
                    if (t.getMapObject() !== null) {
                        tileSet.add(t);
                    }
                    dirs2.forEach(function (dir2) {
                        var t2 = t[dir2];
                        if (t2 !== null && t2.getMapObject() !== null) {
                            tileSet.add(t2);
                        }
                    });
                }
            });
            dirs2.forEach(function (dir) {
                var t = _this14.tile[dir];
                if (t !== null) {
                    if (t.getMapObject() !== null) {
                        tileSet.add(t);
                    }
                    dirs1.forEach(function (dir2) {
                        var t2 = t[dir2];
                        if (t2 !== null && t2.getMapObject() !== null) {
                            tileSet.add(t2);
                        }
                    });
                }
            });

            var tileArray = Array.from(tileSet);
            var tileKeys = tileArray.map(function (t) {
                return t.getKey();
            });
            var objKeys = tileArray.map(function (t) {
                return t.getMapObject().getKey();
            });
            var ret = [];
            ret.push(tileKeys.concat(objKeys));
            return ret;
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

        var _this15 = _possibleConstructorReturn(this, (YellowVessel.__proto__ || Object.getPrototypeOf(YellowVessel)).apply(this, arguments));

        _this15.movement = 5;
        return _this15;
    }

    _createClass(YellowVessel, [{
        key: 'getShard',
        value: function getShard() {
            return new YellowShard();
        }
    }, {
        key: 'attackedBy',
        value: function attackedBy(vessel) {
            if (vessel instanceof WhiteVessel) {
                var obj = new WhiteVessel([this.player], this.tile, this.getKey());
                return {
                    key: this.getKey(),
                    color: obj.getColor()
                };
            }
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

var POLYGON_MAP = {
    bs: 'tetrahedron',
    rs: 'tetrahedron',
    ys: 'tetrahedron',
    w: 'icosahedron',
    b: 'icosahedron',
    r: 'icosahedron',
    y: 'icosahedron'
};

var MapObjectFactory = {
    map: {
        bs: BlueShard,
        rs: RedShard,
        ys: YellowShard,
        w: WhiteVessel,
        b: BlueVessel,
        r: RedVessel,
        y: YellowVessel
    },
    create: function create(json) {
        var cls = this.map[json.type];
        return new cls(json);
    },
    getJSON: function getJSON(propString) {
        var props = propString.split('-');
        var json = {
            type: props[0]
        };
        if (props.length > 1) {
            json.player = props[1];
        }
        return json;
    },
    getPropString: function getPropString(json) {
        var propString = json.x + '-' + json.y + '-' + json.type;
        if (json.player !== undefined) {
            propString += '-' + json.player;
        }
        return propString;
    }
};

exports.MapObject = MapObject;
exports.MapObjectFactory = MapObjectFactory;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deserialize = exports.serialize = undefined;

var _Tile = __webpack_require__(2);

var _MapObject = __webpack_require__(3);

var _Objective = __webpack_require__(5);

var _Map = __webpack_require__(11);

function serialize(map) {
    var state = map.toJSON();
    var mapString = '';
    var tiles = state.tiles;
    var mapObjects = [];
    for (var i = 0; i < tiles.length; i++) {
        var tileRow = tiles[i];
        for (var j = 0; j < tileRow.length; j++) {
            var tile = tileRow[j];
            if (tile.mapObject !== undefined) {
                mapObjects.push(tile.mapObject);
            }
            var tileString = _Tile.TileFactory.getPropString(tile);
            mapString += tileString;
            if (j !== tileRow.length - 1) {
                mapString += ' ';
            }
        }
        mapString += '\n';
    }
    mapString += '===\n';
    for (var _i = 0; _i < mapObjects.length; _i++) {
        var mapObject = mapObjects[_i];
        var mapObjectString = _MapObject.MapObjectFactory.getPropString(mapObject);
        mapString += mapObjectString;
        mapString += '\n';
    }
    mapString += '===\n';
    mapString += _Objective.ObjectiveFactory.getPropString(state.objective);
    mapString += '\n';
    mapString += state.turnPlayers.join('-');
    mapString += '\n';
    mapString += state.actions.move + "-" + state.actions.transfer + "-" + state.actions.attack;
    return mapString;
}

function deserialize(mapString) {
    var state = {};
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
            var json = _Tile.TileFactory.getJSON(tileStrings[x]);
            json.x = x;
            json.y = y;
            tileRow.push(json);
        }
        tiles.push(tileRow);
    }

    var mapObjectStrings = mapObjectArrayString.split('\n');
    for (var i = 0; i < mapObjectStrings.length; i++) {
        var props = mapObjectStrings[i].split('-');
        var _x = parseInt(props[0]);
        var _y = parseInt(props[1]);
        var _json = _MapObject.MapObjectFactory.getJSON(props.slice(2, props.length).join('-'));
        _json.x = _x;
        _json.y = _y;
        tiles[_y][_x].mapObject = _json;
    }

    state.objective = _Objective.ObjectiveFactory.getJSON(settings[0]);
    state.turnPlayers = settings[1].split('-');
    var s = settings[2].split('-');
    state.actions = {
        move: parseInt(s[0]),
        transfer: parseInt(s[1]),
        attack: parseInt(s[2])
    };
    state.tiles = tiles;
    return new _Map.Map(state);
}

exports.serialize = serialize;
exports.deserialize = deserialize;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Objective = function () {
    function Objective() {
        _classCallCheck(this, Objective);
    }

    _createClass(Objective, [{
        key: 'serialize',
        value: function serialize() {
            return this.constructor.name();
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return this.constructor.name();
        }
    }, {
        key: 'check',
        value: function check(map) {
            throw Error('Unimplemented');
        }
    }, {
        key: 'success',
        value: function success(map) {
            throw Error('Unimplemented');
        }
    }]);

    return Objective;
}();

var Objective1 = function (_Objective) {
    _inherits(Objective1, _Objective);

    function Objective1() {
        _classCallCheck(this, Objective1);

        return _possibleConstructorReturn(this, (Objective1.__proto__ || Object.getPrototypeOf(Objective1)).apply(this, arguments));
    }

    _createClass(Objective1, [{
        key: 'check',
        value: function check(map) {
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
        }
    }, {
        key: 'success',
        value: function success(map) {
            var players = map.getMapObjects().map(function (m) {
                return m.getPlayer();
            });
            var enemies = players.filter(function (p) {
                return p !== '0' && p !== null;
            });
            return enemies.length === 0;
        }
    }], [{
        key: 'name',
        value: function name() {
            return 0;
        }
    }]);

    return Objective1;
}(Objective);

var ObjectiveFactory = {
    map: {
        0: Objective1
    },
    create: function create(json) {
        var cls = this.map[json];
        return new cls();
    },
    getJSON: function getJSON(propString) {
        return parseInt(propString);
    },
    getPropString: function getPropString(json) {
        return '' + json;
    }
};

exports.ObjectiveFactory = ObjectiveFactory;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MapScreen = __webpack_require__(12);

var _DefaultMap = __webpack_require__(10);

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

            window.dmap = _DefaultMap2.default;
            document.body.appendChild(this.canvas);
            this.screen = new _MapScreen.MapScreen(this.canvas, _DefaultMap2.default);
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
                _this.screen.handleKeyDown(e.code);
            });

            document.addEventListener("keyup", function (e) {
                e.preventDefault();
                _this.screen.handleKeyUp(e.code);
            });
        }
    }]);

    return Game;
}();

exports.default = Game;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(19);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(20)(content, options);
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Animation = function () {
    function Animation(transitions, frames) {
        var destroy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        _classCallCheck(this, Animation);

        this.frame = 0;
        this.frames = frames;
        this.destroy = destroy;
        this.transitions = transitions;
    }

    _createClass(Animation, [{
        key: "initialize",
        value: function initialize(state) {
            for (var key in state) {
                if (this.transitions[key] === undefined) {
                    this.transitions[key] = new TransitionNoop(state[key]);
                } else if (!this.transitions[key].isInitialized()) {
                    this.transitions[key].initialize(state[key]);
                }
            }
        }
    }, {
        key: "isInitialized",
        value: function isInitialized() {
            return this.frame !== 0;
        }
    }, {
        key: "finished",
        value: function finished() {
            return this.frame === this.frames;
        }
    }, {
        key: "destroyAfter",
        value: function destroyAfter() {
            return this.destroy;
        }
    }, {
        key: "getNextState",
        value: function getNextState() {
            this.frame += 1;
            var nextState = {};
            for (var key in this.transitions) {
                nextState[key] = this.transitions[key].evaluate(this.frame / this.frames);
            }
            return nextState;
        }
    }]);

    return Animation;
}();

var TransitionNoop = function () {
    function TransitionNoop(start) {
        _classCallCheck(this, TransitionNoop);

        this.start = start;
    }

    _createClass(TransitionNoop, [{
        key: "evaluate",
        value: function evaluate(t) {
            return this.start;
        }
    }]);

    return TransitionNoop;
}();

var TransitionLinear = function () {
    function TransitionLinear(start, end) {
        _classCallCheck(this, TransitionLinear);

        this.start = start;
        this.end = end;
    }

    _createClass(TransitionLinear, [{
        key: "isInitialized",
        value: function isInitialized() {
            return this.start !== null;
        }
    }, {
        key: "initialize",
        value: function initialize(start) {
            this.start = start;
        }
    }, {
        key: "evaluate",
        value: function evaluate(t) {
            return this.start + (this.end - this.start) * t;
        }
    }]);

    return TransitionLinear;
}();

var TransitionQuadraticBezier = function () {
    function TransitionQuadraticBezier(p0, p1, p2) {
        _classCallCheck(this, TransitionQuadraticBezier);

        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
    }

    _createClass(TransitionQuadraticBezier, [{
        key: "isInitialized",
        value: function isInitialized() {
            return true;
        }
    }, {
        key: "evaluate",
        value: function evaluate(t) {
            return (1 - t) * (1 - t) * this.p0 + 2 * (1 - t) * t * this.p1 + t * t * this.p2;
        }
    }]);

    return TransitionQuadraticBezier;
}();

exports.Animation = Animation;
exports.TransitionNoop = TransitionNoop;
exports.TransitionLinear = TransitionLinear;
exports.TransitionQuadraticBezier = TransitionQuadraticBezier;

/***/ }),
/* 9 */
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
            if (Math.abs(lastD) < 0.001) {
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
                if (Math.abs(d) < 0.001) {
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
        key: 'addFace',
        value: function addFace(face) {
            if (this.nodes.length === 0) {
                this.nodes = [face];
                return;
            }
            var p0 = this.nodes[0].getPoints()[0];
            var n = this.nodes[0].getNormal();
            var pos = void 0;
            var cut = false;
            var frontPoints = [];
            var backPoints = [];
            var points = face.getPoints();

            //Get initial pos
            var lastD = _Vector.Vector.createFromPoints(p0, points[points.length - 1]).dot(n);
            if (Math.abs(lastD) < 0.001) {
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
                if (Math.abs(d) < 0.001) {
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
                        var _prevP2 = j === 0 ? points[points.length - 1] : points[j - 1];
                        var _prevD2 = _Vector.Vector.createFromPoints(p0, _prevP2).dot(n);
                        var _mid2 = p.midpoint(_prevP2, d / (d - _prevD2));
                        frontPoints.push(_mid2);
                        backPoints.push(_mid2);
                        cut = true;
                    }
                    backPoints.push(p);
                    pos = 'back';
                }
            }

            if (cut) {
                // Split a face...
                var _face$getPolygon$spli = face.getPolygon().splitFace(face, frontPoints, backPoints),
                    face1 = _face$getPolygon$spli.face1,
                    face2 = _face$getPolygon$spli.face2;

                if (this.front !== null) {
                    this.front.addFace(face1);
                } else {
                    this.front = new BSPTree([face1]);
                }
                if (this.back !== null) {
                    this.back.addFace(face2);
                } else {
                    this.back = new BSPTree([face2]);
                }
            } else {
                if (frontPoints.length === points.length && backPoints.length === points.length) {
                    this.nodes.push(face);
                } else if (frontPoints.length === points.length) {
                    if (this.front !== null) {
                        this.front.addFace(face);
                    } else {
                        this.front = new BSPTree([face]);
                    }
                } else {
                    if (this.back !== null) {
                        this.back.addFace(face);
                    } else {
                        this.back = new BSPTree([face]);
                    }
                }
            }
        }
    }, {
        key: 'addFaces',
        value: function addFaces(faces) {
            var _this = this;

            faces.forEach(function (face) {
                return _this.addFace(face);
            });
        }
    }, {
        key: 'removeFace',
        value: function removeFace(face) {
            var idx = this.nodes.indexOf(face);
            if (idx !== -1) {
                this.nodes.splice(idx, 1);
                return;
            }
            if (this.front !== null) {
                this.front.removeFace(face);
            }
            if (this.back !== null) {
                this.back.removeFace(face);
            }
        }
    }, {
        key: 'removeFaces',
        value: function removeFaces(faces) {
            var _this2 = this;

            faces.forEach(function (face) {
                return _this2.removeFace(face);
            });
        }
    }, {
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MapSerializer = __webpack_require__(4);

var exampleMapString = "p-1 p-2 p-3\np-2 p-3 p-2\np-3 p-1 p-1\np-1 e-1 p-1\np-1 p-1 p-1\n===\n0-0-w-0\n1-0-w-0\n2-0-w-1\n0-1-bs\n2-1-w-1\n0-2-rs\n0-3-ys\n===\n0\n0-1\n1-1-1";

var defaultMap = (0, _MapSerializer.deserialize)(exampleMapString);

exports.default = defaultMap;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Map = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MapSerializer = __webpack_require__(4);

var _Tile = __webpack_require__(2);

var _Objective = __webpack_require__(5);

var _MapObject = __webpack_require__(3);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Map = function () {
    function Map(state) {
        _classCallCheck(this, Map);

        this.tiles = [];
        this.tileMap = {};
        for (var y = 0; y < state.tiles.length; y++) {
            var tileRow = [];
            for (var x = 0; x < state.tiles[y].length; x++) {
                var tile = _Tile.TileFactory.create(state.tiles[y][x]);
                this.tileMap[tile.getKey()] = tile;
                if (state.tiles[y][x].mapObject !== undefined) {
                    var m = _MapObject.MapObjectFactory.create(state.tiles[y][x].mapObject);
                    m.setTile(tile);
                }
                if (y > 0) {
                    this.tiles[y - 1][x].link('down', tile);
                    tile.link('top', this.tiles[y - 1][x]);
                }
                if (x > 0) {
                    tileRow[x - 1].link('right', tile);
                    tile.link('left', tileRow[x - 1]);
                }
                tileRow.push(tile);
            }
            this.tiles.push(tileRow);
        }
        this.objective = _Objective.ObjectiveFactory.create(state.objective);
        this.turnPlayers = state.turnPlayers;
        this.actions = state.actions;
        this.listeners = [];
        this.cachedActions = null;
    }

    _createClass(Map, [{
        key: "toJSON",
        value: function toJSON() {
            var state = {};
            state.tiles = this.tiles.map(function (tileRow) {
                return tileRow.map(function (tile) {
                    return tile.toJSON();
                });
            });
            state.objective = this.objective.toJSON();
            state.turnPlayers = this.turnPlayers;
            state.actions = this.actions;
            return state;
        }
    }, {
        key: "doAction",
        value: function doAction(action) {
            var _this = this;

            //TODO: Validate actions is in available actions
            var validActions = this.getActions();
            if (validActions.indexOf(action) === -1) {
                throw Error('Invalid Action');
            }
            var name = action.name;
            if (this.actions[name] > 0) {
                var src = this.tileMap[action.src].getMapObject();
                var dst = void 0;
                if (name === 'attack') {
                    dst = action.dst.map(function (d) {
                        return _this.tileMap[d];
                    });
                } else {
                    dst = this.tileMap[action.dst];
                }
                src[name](dst);
                this.actions[name] -= 1;

                this.listeners.forEach(function (l) {
                    return l.trigger(action);
                });
            } else if (name !== 'end') {
                throw Error('Invalid action');
            }
            if (name === 'end' || Object.values(this.actions).reduce(function (a, b) {
                return a + b;
            }, 0) === 0) {
                this.turnPlayers.push(this.turnPlayers.shift());
                this.actions = {
                    move: 1,
                    transfer: 1,
                    attack: 1
                };
            }
        }
    }, {
        key: "getActions",
        value: function getActions() {
            var _this2 = this;

            if (this.cachedActions !== null) {
                return this.cachedActions;
            }
            var actions = [{ name: 'end' }];
            var objs = this.getMapObjects().filter(function (m) {
                return m.getPlayer() === _this2.turnPlayers[0];
            });
            if (this.actions.move > 0) {
                actions = objs.reduce(function (a, b) {
                    return a.concat(b.getMoveActions());
                }, actions);
            }
            if (this.actions.transfer > 0) {
                actions = objs.reduce(function (a, b) {
                    return a.concat(b.getTransferActions(objs));
                }, actions);
            }
            if (this.actions.attack > 0) {
                actions = objs.reduce(function (a, b) {
                    return a.concat(b.getAttackActions());
                }, actions);
            }
            this.cachedActions = actions;
            return actions;
        }
    }, {
        key: "addListener",
        value: function addListener(l) {
            this.listeners.push(l);
        }
    }, {
        key: "getMapObjects",
        value: function getMapObjects() {
            var mapObjects = [];
            this.tiles.forEach(function (tileRow) {
                tileRow.forEach(function (tile) {
                    var mapObject = tile.getMapObject();
                    if (mapObject !== null) {
                        mapObjects.push(mapObject);
                    }
                });
            });
            return mapObjects;
        }
    }, {
        key: "getObjective",
        value: function getObjective() {
            return this.objective;
        }
    }, {
        key: "getTurnPlayer",
        value: function getTurnPlayer() {
            return this.turnPlayer;
        }
    }, {
        key: "isResolved",
        value: function isResolved() {
            return this.objective.check(this);
        }
    }, {
        key: "serialize",
        value: function serialize() {
            return (0, _MapSerializer.serialize)(this);
        }
    }], [{
        key: "transition",
        value: function transition(state, action) {
            var map = new Map(state);
            map.doAction(action);
            return map.toJSON();
        }
    }]);

    return Map;
}();

exports.Map = Map;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MapScreen = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Vector = __webpack_require__(0);

var _Animation = __webpack_require__(8);

var _Viewport = __webpack_require__(15);

var _Polygon = __webpack_require__(13);

var _PolygonRenderer = __webpack_require__(14);

var _Color = __webpack_require__(1);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_COLOR = new _Color.Color(242, 242, 242, 1);
var NEXT_VALID_COLOR = new _Color.Color(0, 255, 255, 1);
var VALID_COLOR = new _Color.Color(0, 255, 204, 1);
var VALID_HOVER_COLOR = new _Color.Color(102, 255, 204, 1);
var SELECTED_COLOR = new _Color.Color(0, 204, 153, 1);
var OVERLAY_DEFAULT_COLOR = new _Color.Color(230, 230, 230, 1);
var OVERLAY_DISABLE_COLOR = new _Color.Color(153, 153, 153, 1);
var OVERLAY_HOVER_COLOR = new _Color.Color(242, 242, 242, 1);

var MapScreen = function () {
    function MapScreen(canvas, map) {
        var _this = this;

        _classCallCheck(this, MapScreen);

        this.canvas = canvas;
        this.map = map;
        this.viewport = new _Viewport.Viewport(new _Vector.Point(0, 0, 500), new _Vector.Point(this.canvas.width, 0, 500), new _Vector.Point(0, this.canvas.height, 500), new _Vector.Point(this.canvas.width, this.canvas.height, 500), 500);
        this.pressed = {};
        this.dynamicPolygons = {};
        this.animations = [];

        var staticPolygons = [];
        this.polygons = {};
        this.keyMap = {};

        var state = this.map.toJSON();
        state.tiles.forEach(function (tileRow) {
            tileRow.forEach(function (tile) {
                var _PolygonFactory$creat = _Polygon.PolygonFactory.create(tile),
                    tilePolygon = _PolygonFactory$creat.tilePolygon,
                    mapObjectPolygon = _PolygonFactory$creat.mapObjectPolygon;

                if (tilePolygon !== null) {
                    staticPolygons.push(tilePolygon);
                    _this.polygons[tilePolygon.getKey()] = tilePolygon;
                    _this.keyMap[tilePolygon.getKey()] = tile.key;
                }
                if (mapObjectPolygon !== null) {
                    _this.dynamicPolygons[mapObjectPolygon.getKey()] = mapObjectPolygon;
                    _this.polygons[mapObjectPolygon.getKey()] = mapObjectPolygon;
                    _this.keyMap[mapObjectPolygon.getKey()] = tile.key;
                }
            });
        });

        this.state = {
            mode: 'menu',
            hoverKey: null,
            hoverMainKeyMap: {},
            hoverSecondaryKeyMap: {}
        };

        this.overlays = {
            move: new _Polygon.Overlay(50, 50, 150, 50, 'move'),
            attack: new _Polygon.Overlay(50, 100, 150, 50, 'attack'),
            transfer: new _Polygon.Overlay(50, 150, 150, 50, 'transfer'),
            end: new _Polygon.Overlay(50, 200, 150, 50, 'end')
        };

        Object.values(this.overlays).forEach(function (o) {
            return _this.polygons[o.getKey()] = o;
        });

        var actions = this.map.getActions();
        actions.map(function (a) {
            var overlay = _this.overlays[a.name];
            var key = overlay.getKey();
            _this.state.hoverMainKeyMap[key] = [key];
            if (a.src !== undefined) {
                var srcList = _this.state.hoverSecondaryKeyMap[key] || [];
                var src = Object.keys(_this.keyMap).filter(function (k) {
                    return _this.keyMap[k] === a.src;
                });
                _this.state.hoverSecondaryKeyMap[key] = Array.from(new Set(srcList.concat(src)));
            }
        });

        /*this.state = {
            action: 'menu',
            validKeyGroups: this.map.getActions(),
            selectedKeyGroup: [],
            prevKeyGroup: [],
        };*/

        //this.postStateUpdate();

        //this.r = new Vector(0, 0, 1);

        this.renderer = new _PolygonRenderer.PolygonRenderer(this.canvas, staticPolygons, function (a, b) {
            return a.getNormal().getZ() - b.getNormal().getZ();
        });
        map.addListener(this);
    }

    _createClass(MapScreen, [{
        key: "start",
        value: function start() {
            this.renderLoop();
        }
    }, {
        key: "renderLoop",
        value: function renderLoop() {
            var _this2 = this;

            this.viewport.updatePosition();
            var overlays = this.getOverlays();
            this.renderer.render(this.viewport, Object.values(this.dynamicPolygons), overlays);
            this.updateHover();
            /*this.r.rotate(new Vector(1, 0, 0), 1 * Math.PI / 180);
            Object.values(this.dynamicPolygons).forEach(p => {
                p.rotate(this.r, 1 * Math.PI / 180);
            });*/

            /*const polygonsToDestroy = [];
            if (this.animations.length > 0) {
                const animation = this.animations[0];
                const finishedAnimations = [];
                for (let key in animation) {
                    const a = animation[key];
                    const p = this.dynamicPolygons[key];
                    if (!a.isInitialized()) {
                        a.initialize(p.getState());
                    }
                    const state = a.getNextState();
                    p.applyState(state);
                    if (a.finished()) {
                        finishedAnimations.push(key);
                        if (a.destroyAfter()) {
                            polygonsToDestroy.push(key);
                        }
                    }
                }
                finishedAnimations.forEach(key => delete animation[key]);
                if (Object.keys(animation).length === 0) {
                    this.animations.splice(0, 1);
                }
            }
             const overlays = this.state.action === 'menu' ? Object.values(this.overlays) : [];
             const nextValidKeyGroups = this.getNextValidKeyGroups();
            this.state.selectedKeyGroup.forEach(key => {
                if (this.staticPolygons[key] !== undefined) {
                    this.staticPolygons[key].setColor(VALID_HOVER_COLOR);
                }
                if (this.overlays[key] !== undefined) {
                    this.overlays[key].setColor(OVERLAY_HOVER_COLOR);
                }
            });
            nextValidKeyGroups.forEach(keyGroup => {
                keyGroup.forEach(key => {
                    if (this.staticPolygons[key] !== undefined) {
                        this.staticPolygons[key].setColor(NEXT_VALID_COLOR);
                    }
                });
            });     
             this.renderer.render(this.viewport, Object.values(this.dynamicPolygons), overlays);
             nextValidKeyGroups.forEach(keyGroup => {
                keyGroup.forEach(key => {
                    if (this.staticPolygons[key] !== undefined) {
                        if (this.getKeyGroup(key).length > 0) {
                            this.staticPolygons[key].setColor(VALID_COLOR);
                        } else {
                            this.staticPolygons[key].setColor(DEFAULT_COLOR);
                        }
                    }
                });
            });
            this.state.selectedKeyGroup.forEach(key => {
                if (this.staticPolygons[key] !== undefined) {
                    this.staticPolygons[key].setColor(VALID_COLOR);
                }
                if (this.overlays[key] !== undefined) {
                    this.overlays[key].setColor(OVERLAY_DEFAULT_COLOR);
                }
            });
             this.state.selectedKeyGroup = this.getKeyGroup(this.getKey(this.renderer.getHoveredObj()));
             polygonsToDestroy.forEach(key => delete this.dynamicPolygons[key]);
            */

            window.requestAnimationFrame(function (step) {
                _this2.renderLoop();
            });
        }
    }, {
        key: "getOverlays",
        value: function getOverlays() {
            return Object.values(this.overlays);
        }

        /*
            Three hover states:
                None - no hover highlight
                Secondary - secondary hover highlight
                Main - main hover highlight
         */

    }, {
        key: "updateHover",
        value: function updateHover() {
            this.cancelHover();
            var obj = this.renderer.getHoveredObj();
            this.state.hoverKey = obj === null ? null : obj.getKey();
            this.setHover();
        }
    }, {
        key: "cancelHover",
        value: function cancelHover() {
            var _this3 = this;

            var key = this.state.hoverKey;
            if (key !== null) {
                var hoverMainKeys = this.state.hoverMainKeyMap[key];
                var hoverSecondaryKeys = this.state.hoverSecondaryKeyMap[key];
                if (hoverMainKeys !== undefined) {
                    hoverMainKeys.forEach(function (k) {
                        _this3.polygons[k].setHover(_Polygon.HOVER_NONE);
                    });
                }
                if (hoverSecondaryKeys !== undefined) {
                    hoverSecondaryKeys.forEach(function (k) {
                        _this3.polygons[k].setHover(_Polygon.HOVER_NONE);
                    });
                }
            }
        }
    }, {
        key: "setHover",
        value: function setHover() {
            var _this4 = this;

            var key = this.state.hoverKey;
            if (key !== null) {
                var hoverMainKeys = this.state.hoverMainKeyMap[key];
                var hoverSecondaryKeys = this.state.hoverSecondaryKeyMap[key];
                if (hoverMainKeys !== undefined) {
                    hoverMainKeys.forEach(function (k) {
                        _this4.polygons[k].setHover(_Polygon.HOVER_MAIN);
                    });
                }
                if (hoverSecondaryKeys !== undefined) {
                    hoverSecondaryKeys.forEach(function (k) {
                        _this4.polygons[k].setHover(_Polygon.HOVER_SECONDARY);
                    });
                }
            }
        }
    }, {
        key: "trigger",
        value: function trigger(e) {
            if (e.name === 'move') {
                var startCenter = this.staticPolygons[e.path[0]].getCenter();
                var x = startCenter.getX();
                var y = startCenter.getY();
                var z = startCenter.getZ() * 2 + TLEN / 2;

                for (var i = 1; i < e.path.length; i++) {
                    var animation = {};
                    var nextCenter = this.staticPolygons[e.path[i]].getCenter();
                    var nextX = nextCenter.getX();
                    var nextY = nextCenter.getY();
                    var nextZ = nextCenter.getZ() * 2 + TLEN / 2;
                    var transitions = {};
                    if (z === nextZ) {
                        transitions.x = new _Animation.TransitionLinear(x, nextX);
                        transitions.y = new _Animation.TransitionLinear(y, nextY);
                        transitions.z = new _Animation.TransitionLinear(z, nextZ);
                    } else {
                        transitions.x = new _Animation.TransitionQuadraticBezier(x, z > nextZ ? nextX : x, nextX);
                        transitions.y = new _Animation.TransitionQuadraticBezier(y, z > nextZ ? nextY : y, nextY);
                        transitions.z = new _Animation.TransitionQuadraticBezier(z, Math.max(z, nextZ), nextZ);
                    }

                    if (e.color !== undefined && i === e.path.length - 1) {
                        transitions.r = new _Animation.TransitionLinear(null, e.color.getR());
                        transitions.g = new _Animation.TransitionLinear(null, e.color.getG());
                        transitions.b = new _Animation.TransitionLinear(null, e.color.getB());

                        var shardTransitions = {};
                        shardTransitions.a = new _Animation.TransitionLinear(null, 0);
                        shardTransitions.sa = new _Animation.TransitionLinear(null, 0);
                        var shardAnimation = new _Animation.Animation(shardTransitions, 30, true);
                        animation[e.shardKey] = shardAnimation;
                    }

                    animation[e.objKey] = new _Animation.Animation(transitions, 30);

                    this.animations.push(animation);

                    x = nextX;
                    y = nextY;
                    z = nextZ;
                }
            } else if (e.name === 'transfer') {
                var _animation = {};

                var srcTransitions = {};
                srcTransitions.r = new _Animation.TransitionLinear(null, e.srcColor.getR());
                srcTransitions.g = new _Animation.TransitionLinear(null, e.srcColor.getG());
                srcTransitions.b = new _Animation.TransitionLinear(null, e.srcColor.getB());
                _animation[e.srcKey] = new _Animation.Animation(srcTransitions, 30);

                var dstTransitions = {};
                dstTransitions.r = new _Animation.TransitionLinear(null, e.dstColor.getR());
                dstTransitions.g = new _Animation.TransitionLinear(null, e.dstColor.getG());
                dstTransitions.b = new _Animation.TransitionLinear(null, e.dstColor.getB());
                _animation[e.dstKey] = new _Animation.Animation(dstTransitions, 30);

                this.animations.push(_animation);
            } else if (e.name === 'attack') {
                var _animation2 = {};

                e.dst.forEach(function (target) {
                    var transitions = {};
                    if (target.color === null) {
                        transitions.a = new _Animation.TransitionLinear(null, 0);
                        transitions.sa = new _Animation.TransitionLinear(null, 0);
                        _animation2[target.key] = new _Animation.Animation(transitions, 30, true);
                    } else {
                        transitions.r = new _Animation.TransitionLinear(null, target.color.getR());
                        transitions.g = new _Animation.TransitionLinear(null, target.color.getG());
                        transitions.b = new _Animation.TransitionLinear(null, target.color.getB());
                        _animation2[target.key] = new _Animation.Animation(transitions, 30);
                    }
                });

                this.animations.push(_animation2);
            }
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
        key: "preStateUpdate",
        value: function preStateUpdate() {
            var _this5 = this;

            this.state.prevKeyGroup.forEach(function (k) {
                if (_this5.state.action.indexOf('choose') !== -1) {
                    if (_this5.staticPolygons[k] !== undefined) {
                        _this5.staticPolygons[k].setColor(DEFAULT_COLOR);
                    }
                }
            });
            this.state.validKeyGroups.forEach(function (keyGroup) {
                keyGroup.forEach(function (k) {
                    if (_this5.state.action.indexOf('choose') !== -1) {
                        if (_this5.staticPolygons[k] !== undefined) {
                            _this5.staticPolygons[k].setColor(DEFAULT_COLOR);
                        }
                    }
                    if (_this5.state.action === 'menu') {
                        _this5.overlays[k].setColor(OVERLAY_DISABLE_COLOR);
                    }
                });
            });
        }
    }, {
        key: "postStateUpdate",
        value: function postStateUpdate() {
            var _this6 = this;

            this.state.prevKeyGroup.forEach(function (k) {
                if (_this6.state.action.indexOf('choose') !== -1) {
                    if (_this6.staticPolygons[k] !== undefined) {
                        _this6.staticPolygons[k].setColor(SELECTED_COLOR);
                    }
                }
            });
            this.state.validKeyGroups.forEach(function (keyGroup) {
                keyGroup.forEach(function (k) {
                    if (_this6.state.action.indexOf('choose') !== -1) {
                        if (_this6.staticPolygons[k] !== undefined) {
                            _this6.staticPolygons[k].setColor(VALID_COLOR);
                        }
                    }
                    if (_this6.state.action === 'menu') {
                        _this6.overlays[k].setColor(OVERLAY_DEFAULT_COLOR);
                    }
                });
            });
        }
    }, {
        key: "doMapAction",
        value: function doMapAction() {
            var mapArgs = {
                'choose-move-dst': function chooseMoveDst(key, prevKey) {
                    return ['move', prevKey, key];
                },
                'choose-attack-dst': function chooseAttackDst(key, prevKey) {
                    return ['attack', prevKey, key];
                },
                'choose-transfer-dst': function chooseTransferDst(key, prevKey) {
                    return ['transfer', prevKey, key];
                },
                'menu': function menu(key, prevKey) {
                    return key === 'end' ? ['end'] : null;
                }
            };

            if (mapArgs[this.state.action] !== undefined) {
                var args = mapArgs[this.state.action](this.state.selectedKeyGroup[0], this.state.prevKeyGroup[0]);
                if (args !== null) {
                    var _map;

                    (_map = this.map).doAction.apply(_map, _toConsumableArray(args));
                }
            }
        }
    }, {
        key: "getKeyGroup",
        value: function getKeyGroup(key) {
            for (var i = 0; i < this.state.validKeyGroups.length; i++) {
                if (this.state.validKeyGroups[i].indexOf(key) !== -1) {
                    return this.state.validKeyGroups[i];
                }
            }
            return [];
        }
    }, {
        key: "getNextValidKeyGroups",
        value: function getNextValidKeyGroups() {
            var _this7 = this;

            if (this.state.selectedKeyGroup.length === 0) {
                return [];
            }

            var nextValidKeyGroups = {
                'menu': function menu(key) {
                    if (key === 'move') {
                        return _this7.map.getMoveableKeys();
                    } else if (key === 'transfer') {
                        return _this7.map.getTransferableKeys();
                    } else if (key === 'attack') {
                        return _this7.map.getAttackableKeys();
                    } else if (key === 'end') {
                        return _this7.map.getActions();
                    }
                },
                'choose-move-src': function chooseMoveSrc(key) {
                    return _this7.map.getMoveableTargets(key);
                },
                'choose-move-dst': function chooseMoveDst(key) {
                    return _this7.map.getActions();
                },
                'choose-transfer-src': function chooseTransferSrc(key) {
                    return _this7.map.getTransferableTargets(key);
                },
                'choose-transfer-dst': function chooseTransferDst(key) {
                    return _this7.map.getActions();
                },
                'choose-attack-src': function chooseAttackSrc(key) {
                    return _this7.map.getAttackableTargets(key);
                },
                'choose-attack-dst': function chooseAttackDst(key) {
                    return _this7.map.getActions();
                }
            };

            return nextValidKeyGroups[this.state.action](this.state.selectedKeyGroup[0]);
        }
    }, {
        key: "getNextAction",
        value: function getNextAction() {
            var nextAction = {
                'menu': function menu(key) {
                    if (key === 'move') {
                        return 'choose-move-src';
                    } else if (key === 'transfer') {
                        return 'choose-transfer-src';
                    } else if (key === 'attack') {
                        return 'choose-attack-src';
                    } else if (key === 'end') {
                        return 'menu';
                    }
                },
                'choose-move-src': function chooseMoveSrc(key) {
                    return 'choose-move-dst';
                },
                'choose-move-dst': function chooseMoveDst(key) {
                    return 'menu';
                },
                'choose-attack-src': function chooseAttackSrc(key) {
                    return 'choose-attack-dst';
                },
                'choose-attack-dst': function chooseAttackDst(key) {
                    return 'menu';
                },
                'choose-transfer-src': function chooseTransferSrc(key) {
                    return 'choose-transfer-dst';
                },
                'choose-transfer-dst': function chooseTransferDst(key) {
                    return 'menu';
                }
            };

            return nextAction[this.state.action](this.state.selectedKeyGroup[0]);
        }
    }, {
        key: "handleClick",
        value: function handleClick(x, y) {
            this.cancelHover();
            var key = this.state.hoverKey;

            /*if (this.state.selectedKeyGroup.length > 0) {
                this.doMapAction();
                this.preStateUpdate();
                this.state.prevKeyGroup = this.state.selectedKeyGroup;
                this.state.validKeyGroups = this.getNextValidKeyGroups();
                this.state.action = this.getNextAction();
                this.state.selectedKeyGroup = [];
                this.postStateUpdate();
            }*/

            console.log(this.state);
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HOVER_SECONDARY = exports.HOVER_MAIN = exports.HOVER_NONE = exports.PolygonFactory = exports.Overlay = exports.PolygonFace = exports.Polygon = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Vector = __webpack_require__(0);

var _Color = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var COUNTER = 0;
var HOVER_NONE = 1;
var HOVER_MAIN = 2;
var HOVER_SECONDARY = 3;

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
        this.originalFaces = faces.slice();
        this.color = new _Color.Color(204, 204, 204, 1);
        this.stroke = new _Color.Color(0, 0, 0, 1);
        this.key = "polygon-" + COUNTER;
        this.hover = HOVER_NONE;
        COUNTER += 1;
    }

    _createClass(Polygon, [{
        key: "getKey",
        value: function getKey() {
            return this.key;
        }
    }, {
        key: "setHover",
        value: function setHover(hoverState) {
            this.hover = hoverState;
        }
    }, {
        key: "translate",
        value: function translate(x, y, z) {
            this.getPoints().forEach(function (point) {
                return point.translate(x, y, z);
            });
        }
    }, {
        key: "rotate",
        value: function rotate(v, rad) {
            var c = this.getCenter();
            this.getPoints().forEach(function (point) {
                point.translate(-c.getX(), -c.getY(), -c.getZ());
                point.rotate(v, rad);
                point.translate(c.getX(), c.getY(), c.getZ());
            });
            this.faces.forEach(function (face) {
                face.getNormal().rotate(v, rad);
            });
        }
    }, {
        key: "getColor",
        value: function getColor() {
            return this.color;
        }
    }, {
        key: "setColor",
        value: function setColor(color) {
            this.color = color;
        }
    }, {
        key: "getStroke",
        value: function getStroke() {
            return this.stroke;
        }
    }, {
        key: "setStroke",
        value: function setStroke(stroke) {
            this.stroke = stroke;
        }
    }, {
        key: "getDrawColor",
        value: function getDrawColor() {
            if (this.hover === HOVER_NONE) {
                return this.color;
            } else if (this.hover === HOVER_MAIN) {
                return new _Color.Color(204, 204, 204, 1);
            } else if (this.hover === HOVER_SECONDARY) {
                return new _Color.Color(0, 255, 255, 1);
            }
        }
    }, {
        key: "getFaces",
        value: function getFaces() {
            return this.faces;
        }
    }, {
        key: "getPoints",
        value: function getPoints() {
            return Array.from(new Set(this.faces.reduce(function (a, b) {
                return a.concat(b.getPoints());
            }, [])));
        }
    }, {
        key: "getCenter",
        value: function getCenter() {
            var points = this.getPoints();
            var x = points.reduce(function (a, b) {
                return a + b.getX();
            }, 0) / points.length;
            var y = points.reduce(function (a, b) {
                return a + b.getY();
            }, 0) / points.length;
            var z = points.reduce(function (a, b) {
                return a + b.getZ();
            }, 0) / points.length;
            return new _Vector.Point(x, y, z);
        }
    }, {
        key: "getState",
        value: function getState() {
            return {
                x: this.getCenter().getX(),
                y: this.getCenter().getY(),
                z: this.getCenter().getZ(),
                r: this.color.getR(),
                g: this.color.getG(),
                b: this.color.getB(),
                a: this.color.getA(),
                sr: this.stroke.getR(),
                sg: this.stroke.getG(),
                sb: this.stroke.getB(),
                sa: this.stroke.getA()
            };
        }
    }, {
        key: "applyState",
        value: function applyState(_ref) {
            var x = _ref.x,
                y = _ref.y,
                z = _ref.z,
                r = _ref.r,
                g = _ref.g,
                b = _ref.b,
                a = _ref.a,
                sr = _ref.sr,
                sg = _ref.sg,
                sb = _ref.sb,
                sa = _ref.sa;

            var currentState = this.getState();
            this.translate(x - currentState.x, y - currentState.y, z - currentState.z);
            this.color.set(r, g, b, a);
            this.stroke.set(sr, sg, sb, sa);
        }
    }, {
        key: "restoreFaces",
        value: function restoreFaces() {
            this.faces = this.originalFaces.slice();
        }
    }, {
        key: "getClippedFace",
        value: function getClippedFace() {
            return this.clippedFace;
        }
    }, {
        key: "calcClippedFace",
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
        key: "splitFace",
        value: function splitFace(face, points1, points2) {
            var _this2 = this;

            this.faces.splice(this.faces.indexOf(face), 1);
            var blacklist = face.getEdgeBlacklist();
            var sharedPoints = points1.filter(function (p) {
                return points2.indexOf(p) !== -1;
            });
            var n = face.getNormal();

            var _map = [points1, points2].map(function (points) {
                var f = new PolygonFace(points, n);
                f.setPolygon(_this2);
                var newBlacklist = [sharedPoints];
                blacklist.forEach(function (b) {
                    var idx1 = points.indexOf(b[0]);
                    var idx2 = points.indexOf(b[1]);
                    if (idx1 !== -1 && idx2 !== -1) {
                        newBlacklist.push(b);
                    } else if (idx1 !== -1 || idx2 !== -1) {
                        var idx = idx1 !== -1 ? idx1 : idx2;
                        var nidx = idx === points.length - 1 ? 0 : idx + 1;
                        var pidx = idx === 0 ? points.length - 1 : idx - 1;
                        var p = points[idx];
                        var np = points[nidx];
                        var pp = points[pidx];
                        if (sharedPoints.indexOf(np) === -1) {
                            newBlacklist.push([p, pp]);
                        } else if (sharedPoints.indexOf(pp) === -1) {
                            newBlacklist.push([p, np]);
                        } else {
                            // You've got a triangle
                            var v1 = _Vector.Vector.createFromPoints(b[0], b[1]);
                            v1.normalize();
                            var v2 = _Vector.Vector.createFromPoints(p, np);
                            v2.normalize();
                            if (Math.abs(Math.abs(v1.dot(v2)) - 1) < 0.001) {
                                newBlacklist.push([p, np]);
                            } else {
                                newBlacklist.push([p, pp]);
                            }
                        }
                    }
                });
                f.setEdgeBlacklist(newBlacklist);
                _this2.faces.push(f);
                return f;
            }),
                _map2 = _slicedToArray(_map, 2),
                face1 = _map2[0],
                face2 = _map2[1];

            return {
                face1: face1,
                face2: face2
            };
        }
    }], [{
        key: "createBox",
        value: function createBox(x, y, z, w, l, h) {
            var v = [new _Vector.Point(x, y, z + h), new _Vector.Point(x + w, y, z + h), new _Vector.Point(x + w, y + l, z + h), new _Vector.Point(x, y + l, z + h), new _Vector.Point(x, y, z), new _Vector.Point(x + w, y, z), new _Vector.Point(x + w, y + l, z), new _Vector.Point(x, y + l, z)];
            var faces = [new PolygonFace([v[0], v[1], v[2], v[3]], new _Vector.Vector(0, 0, 1)), new PolygonFace([v[1], v[2], v[6], v[5]], new _Vector.Vector(1, 0, 0)), new PolygonFace([v[4], v[5], v[6], v[7]], new _Vector.Vector(0, 0, -1)), new PolygonFace([v[0], v[1], v[5], v[4]], new _Vector.Vector(0, -1, 0)), new PolygonFace([v[0], v[3], v[7], v[4]], new _Vector.Vector(-1, 0, 0)), new PolygonFace([v[2], v[3], v[7], v[6]], new _Vector.Vector(0, 1, 0))];

            return new Polygon(faces, 'box');
        }
    }, {
        key: "createIcosahedron",
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
    }, {
        key: "createTetrahedron",
        value: function createTetrahedron(x, y, z, scale) {
            var t = 1 / Math.sqrt(2);
            var v = [new _Vector.Point(1, 0, -t), new _Vector.Point(-1, 0, -t), new _Vector.Point(0, 1, t), new _Vector.Point(0, -1, t)];

            var faces = [[0, 2, 3], [1, 3, 2], [2, 0, 1], [3, 1, 0]].map(function (idx) {
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

            return new Polygon(faces, 'tetrahedron');
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
        key: "translate",
        value: function translate(x, y, z) {
            this.points.forEach(function (p) {
                return p.translate(x, y, z);
            });
        }
    }, {
        key: "rotate",
        value: function rotate(v, rad) {
            this.points.forEach(function (p) {
                return p.rotate(v, rad);
            });
            this.normal.rotate(v, rad);
        }
    }, {
        key: "getPoints",
        value: function getPoints() {
            return this.points;
        }
    }, {
        key: "getNormal",
        value: function getNormal() {
            return this.normal;
        }
    }, {
        key: "getPolygon",
        value: function getPolygon() {
            return this.polygon;
        }
    }, {
        key: "setPolygon",
        value: function setPolygon(polygon) {
            this.polygon = polygon;
        }
    }, {
        key: "getClippedPoints",
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
        key: "getVisiblePoints",
        value: function getVisiblePoints() {
            return this.visiblePoints;
        }
    }, {
        key: "setVisiblePoints",
        value: function setVisiblePoints(points, mapping) {
            this.visiblePoints = points;
            this.mapping = mapping;
        }
    }, {
        key: "getEdgeBlacklist",
        value: function getEdgeBlacklist() {
            return this.edgeBlacklist;
        }
    }, {
        key: "setEdgeBlacklist",
        value: function setEdgeBlacklist(blacklist) {
            this.edgeBlacklist = blacklist;
        }
    }, {
        key: "draw",
        value: function draw(ctx) {
            ctx.fillStyle = this.polygon.getDrawColor().getString();
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
            ctx.strokeStyle = this.polygon.getStroke().getString();
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

var Overlay = function () {
    function Overlay(x, y, w, h, text) {
        _classCallCheck(this, Overlay);

        this.color = new _Color.Color(153, 153, 153, 1);
        this.stroke = new _Color.Color(0, 0, 0, 1);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.text = text;
        this.key = "polygon-" + COUNTER;
        this.hover = HOVER_NONE;
        COUNTER += 1;
    }

    _createClass(Overlay, [{
        key: "setHover",
        value: function setHover(hoverState) {
            this.hover = hoverState;
        }
    }, {
        key: "getKey",
        value: function getKey() {
            return this.key;
        }
    }, {
        key: "getVisiblePoints",
        value: function getVisiblePoints() {
            return [new _Vector.Point(this.x, this.y, 0), new _Vector.Point(this.x + this.w, this.y, 0), new _Vector.Point(this.x + this.w, this.y + this.h, 0), new _Vector.Point(this.x, this.y + this.h, 0)];
        }
    }, {
        key: "setColor",
        value: function setColor(color) {
            this.color = color;
        }
    }, {
        key: "draw",
        value: function draw(ctx) {
            if (this.hover === HOVER_MAIN) {
                ctx.fillStyle = new _Color.Color(204, 204, 204, 1).getString();
            } else {
                ctx.fillStyle = this.color.getString();
            }
            ctx.strokeStyle = this.stroke.getString();
            ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.strokeRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '30px Arial';
            ctx.fillText(this.text, this.x + this.w / 2, this.y + this.h / 2);
        }
    }]);

    return Overlay;
}();

var PolygonFactory = {
    map: {
        bs: 'tetrahedron',
        rs: 'tetrahedron',
        ys: 'tetrahedron',
        w: 'icosahedron',
        b: 'icosahedron',
        r: 'icosahedron',
        y: 'icosahedron'
    },
    settings: {
        tlen: 100
    },
    create: function create(json) {
        var retVal = {
            tilePolygon: null,
            mapObjectPolygon: null
        };
        if (json.type === 'e') {
            return retVal;
        }
        var tlen = this.settings.tlen;
        retVal.tilePolygon = Polygon.createBox(json.x * tlen, json.y * tlen, 0, tlen, tlen, json.h * tlen);
        if (json.mapObject !== undefined) {
            var shape = this.map[json.mapObject.type];
            if (shape === 'tetrahedron') {
                retVal.mapObjectPolygon = Polygon.createTetrahedron(json.x * tlen + tlen / 2, json.y * tlen + tlen / 2, json.h * tlen + tlen / 2, 20);
            } else if (shape === 'icosahedron') {
                retVal.mapObjectPolygon = Polygon.createIcosahedron(json.x * tlen + tlen / 2, json.y * tlen + tlen / 2, json.h * tlen + tlen / 2, 20);
            }
        }
        return retVal;
    }
};

exports.Polygon = Polygon;
exports.PolygonFace = PolygonFace;
exports.Overlay = Overlay;
exports.PolygonFactory = PolygonFactory;
exports.HOVER_NONE = HOVER_NONE;
exports.HOVER_MAIN = HOVER_MAIN;
exports.HOVER_SECONDARY = HOVER_SECONDARY;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PolygonRenderer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BSPTree = __webpack_require__(9);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PolygonRenderer = function () {
    function PolygonRenderer(canvas, staticPolygons) {
        var faceSort = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

        _classCallCheck(this, PolygonRenderer);

        this.canvas = canvas;
        var staticFaces = staticPolygons.reduce(function (a, b) {
            return a.concat(b.getFaces());
        }, []);
        staticFaces.sort(faceSort);
        this.bsp = new _BSPTree.BSPTree(staticFaces);
        this.staticPolygons = staticPolygons;
        this.hoveredObj = null;
    }

    _createClass(PolygonRenderer, [{
        key: "render",
        value: function render(viewport, polygons, overlays) {
            var _this = this;

            var ctx = this.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.hoveredObj = null;

            var facesToDraw = [];

            this.bsp.addFaces(polygons.reduce(function (a, b) {
                return a.concat(b.getFaces());
            }, []));

            this.bsp.traverse(function (face) {
                var _viewport$projectFace = viewport.projectFace(face),
                    visiblePoints = _viewport$projectFace.visiblePoints,
                    mapping = _viewport$projectFace.mapping,
                    visible = _viewport$projectFace.visible;

                face.setVisiblePoints(visiblePoints, mapping);
                if (visible) {
                    if (viewport.mouseInside(visiblePoints)) {
                        _this.hoveredObj = face.getPolygon();
                    }
                    facesToDraw.push(face);
                }
            }, viewport);

            this.bsp.removeFaces(polygons.reduce(function (a, b) {
                return a.concat(b.getFaces());
            }, []));

            this.staticPolygons.concat(polygons).forEach(function (polygon) {
                polygon.calcClippedFace();
                var clippedFace = polygon.getClippedFace();
                if (clippedFace !== null) {
                    if (viewport.mouseInside(clippedFace.getVisiblePoints())) {
                        _this.hoveredObj = polygon;
                    }
                    facesToDraw.push(clippedFace);
                }
            });

            overlays.forEach(function (overlay) {
                if (viewport.mouseInside(overlay.getVisiblePoints())) {
                    _this.hoveredObj = overlay;
                }
                facesToDraw.push(overlay);
            });

            facesToDraw.forEach(function (face) {
                return face.draw(ctx);
            });

            polygons.forEach(function (polygon) {
                return polygon.restoreFaces();
            });
        }
    }, {
        key: "getHoveredObj",
        value: function getHoveredObj() {
            return this.hoveredObj;
        }
    }]);

    return PolygonRenderer;
}();

exports.PolygonRenderer = PolygonRenderer;

/***/ }),
/* 15 */
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Game = __webpack_require__(6);

var _Game2 = _interopRequireDefault(_Game);

__webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var g = new _Game2.default(window.innerWidth - 16, window.innerHeight - 16);
g.start();

/***/ }),
/* 17 */
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
/* 18 */
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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)(undefined);
// imports


// module
exports.push([module.i, "canvas {\n\tborder: 1px solid black;\n}", ""]);

// exports


/***/ }),
/* 20 */
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

var	fixUrls = __webpack_require__(18);

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