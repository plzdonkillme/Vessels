import { Point, Vector } from "./Vector";
import { Animation, TransitionNoop, TransitionLinear, TransitionQuadraticBezier } from "./Animation";
import { Viewport } from "./Viewport";
import { PolygonFactory, Overlay, HOVER_NONE, HOVER_MAIN, HOVER_SECONDARY } from "./Polygon";
import { PolygonRenderer} from "./PolygonRenderer";
import { Color } from "./Color";

const DEFAULT_COLOR = new Color(242, 242, 242, 1);
const NEXT_VALID_COLOR = new Color(0, 255, 255, 1);
const VALID_COLOR = new Color(0, 255, 204, 1);
const VALID_HOVER_COLOR = new Color(102, 255, 204, 1);
const SELECTED_COLOR = new Color(0, 204, 153, 1);
const OVERLAY_DEFAULT_COLOR = new Color(230, 230, 230, 1);
const OVERLAY_DISABLE_COLOR = new Color(153, 153, 153, 1);
const OVERLAY_HOVER_COLOR = new Color(242, 242, 242, 1);

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
        this.pressed = {};
        this.dynamicPolygons = {};
        this.animations = [];

        const staticPolygons = [];
        this.polygons = {};
        this.keyMap = {};

        const state = this.map.toJSON();
        state.tiles.forEach(tileRow => {
            tileRow.forEach(tile => {
                const { tilePolygon, mapObjectPolygon } = PolygonFactory.create(tile);
                if (tilePolygon !== null) {
                    staticPolygons.push(tilePolygon);
                    this.polygons[tilePolygon.getKey()] = tilePolygon;
                    this.keyMap[tilePolygon.getKey()] = tile.key;
                }
                if (mapObjectPolygon !== null) {
                    this.dynamicPolygons[mapObjectPolygon.getKey()] = mapObjectPolygon;
                    this.polygons[mapObjectPolygon.getKey()] = mapObjectPolygon;
                    this.keyMap[mapObjectPolygon.getKey()] = tile.key;
                }
            });
        });

        this.state = {
            mode: 'menu',
            hoverKey: null,
            hoverMainKeyMap: {},
            hoverSecondaryKeyMap: {},
            nextState: {},
        };

        this.overlays = {
            move: new Overlay(50, 50, 150, 50, 'move'),
            attack: new Overlay(50, 100, 150, 50, 'attack'),
            transfer: new Overlay(50, 150, 150, 50, 'transfer'), 
            end: new Overlay(50, 200, 150, 50, 'end'),
        };

        Object.values(this.overlays).forEach(o => this.polygons[o.getKey()] = o);

        const actions = this.map.getActions();
        actions.map(a => {
            const overlay = this.overlays[a.name];
            const key = overlay.getKey();
            this.state.hoverMainKeyMap[key] = [key];
            if (a.src !== undefined) {
                const srcList = this.state.hoverSecondaryKeyMap[key] || [];
                const src = Object.keys(this.keyMap).filter(k => this.keyMap[k] === a.src);
                this.state.hoverSecondaryKeyMap[key] = Array.from(new Set(srcList.concat(src)));
            }
            this.state.nextState[key] = {
                hoverKey: null,
                hoverMainKeyMap: this.state.hoverSecondaryKeyMap
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
        
        this.renderer = new PolygonRenderer(this.canvas, staticPolygons, (a,b) => a.getNormal().getZ() - b.getNormal().getZ());
        map.addListener(this);
    }

    constructStateTree(actions) {
        
    }

    start() {
        this.renderLoop();
    }

    renderLoop() {
        this.viewport.updatePosition();
        const overlays = this.getOverlays();
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

        window.requestAnimationFrame((step) => {
            this.renderLoop();
        });
    }

    getOverlays() {
        return Object.values(this.overlays);
    }

    /*
        Three hover states:
            None - no hover highlight
            Secondary - secondary hover highlight
            Main - main hover highlight
     */ 
    updateHover() {
        this.cancelHover();
        const obj = this.renderer.getHoveredObj();
        this.state.hoverKey = obj === null ? null : obj.getKey();
        this.setHover();
    }

    cancelHover() {
        const key = this.state.hoverKey;
        if (key !== null) {
            const hoverMainKeys = this.state.hoverMainKeyMap[key];
            const hoverSecondaryKeys = this.state.hoverSecondaryKeyMap[key];
            if (hoverMainKeys !== undefined) {
                hoverMainKeys.forEach(k => {
                    this.polygons[k].setHover(HOVER_NONE);
                });
            }
            if (hoverSecondaryKeys !== undefined) {
                hoverSecondaryKeys.forEach(k => {
                    this.polygons[k].setHover(HOVER_NONE);
                });
            }
        }
    }

    setHover() {
        const key = this.state.hoverKey;
        if (key !== null) {
            const hoverMainKeys = this.state.hoverMainKeyMap[key];
            const hoverSecondaryKeys = this.state.hoverSecondaryKeyMap[key];
            if (hoverMainKeys !== undefined) {
                hoverMainKeys.forEach(k => {
                    this.polygons[k].setHover(HOVER_MAIN);
                });
            }
            if (hoverSecondaryKeys !== undefined) {
                hoverSecondaryKeys.forEach(k => {
                    this.polygons[k].setHover(HOVER_SECONDARY);
                });
            }
        }
    }

    handleClick(x, y) {
        this.cancelHover();
        const key = this.state.hoverKey;
        this.state.hoverMainKeyMap = this.state.hoverSecondaryKeyMap;
        this.state.hoverSecondaryKeyMap = this.state.

        console.log(this.state);
    }

    trigger(e) {
        if (e.name === 'move') {
            const startCenter = this.staticPolygons[e.path[0]].getCenter();
            let x = startCenter.getX();
            let y = startCenter.getY();
            let z = (startCenter.getZ() * 2) + (TLEN / 2);

            for (let i = 1; i < e.path.length; i++) {
                const animation = {};
                const nextCenter = this.staticPolygons[e.path[i]].getCenter();
                const nextX = nextCenter.getX();
                const nextY = nextCenter.getY();
                const nextZ = (nextCenter.getZ() * 2) + (TLEN / 2);
                const transitions = {};
                if (z === nextZ) {
                    transitions.x = new TransitionLinear(x, nextX);
                    transitions.y = new TransitionLinear(y, nextY);
                    transitions.z = new TransitionLinear(z, nextZ);
                } else {
                    transitions.x = new TransitionQuadraticBezier(x, z > nextZ ? nextX : x, nextX);
                    transitions.y = new TransitionQuadraticBezier(y, z > nextZ ? nextY : y, nextY);
                    transitions.z = new TransitionQuadraticBezier(z, Math.max(z, nextZ), nextZ);
                }

                if (e.color !== undefined && i === e.path.length - 1) {
                    transitions.r = new TransitionLinear(null, e.color.getR());
                    transitions.g = new TransitionLinear(null, e.color.getG());
                    transitions.b = new TransitionLinear(null, e.color.getB());

                    const shardTransitions = {}
                    shardTransitions.a = new TransitionLinear(null, 0);
                    shardTransitions.sa = new TransitionLinear(null, 0);
                    const shardAnimation = new Animation(shardTransitions, 30, true);
                    animation[e.shardKey] = shardAnimation
                }

                animation[e.objKey] = new Animation(transitions, 30);

                this.animations.push(animation);

                x = nextX;
                y = nextY;
                z = nextZ;
            }
        } else if (e.name === 'transfer') {
            const animation = {};

            const srcTransitions = {}
            srcTransitions.r = new TransitionLinear(null, e.srcColor.getR());
            srcTransitions.g = new TransitionLinear(null, e.srcColor.getG());
            srcTransitions.b = new TransitionLinear(null, e.srcColor.getB());
            animation[e.srcKey] = new Animation(srcTransitions, 30);

            const dstTransitions = {}
            dstTransitions.r = new TransitionLinear(null, e.dstColor.getR());
            dstTransitions.g = new TransitionLinear(null, e.dstColor.getG());
            dstTransitions.b = new TransitionLinear(null, e.dstColor.getB());
            animation[e.dstKey] = new Animation(dstTransitions, 30);

            this.animations.push(animation);
        } else if (e.name === 'attack') {
            const animation = {};

            e.dst.forEach(target => {
                const transitions = {};
                if (target.color === null) {
                    transitions.a = new TransitionLinear(null, 0);
                    transitions.sa = new TransitionLinear(null, 0);
                    animation[target.key] = new Animation(transitions, 30, true);
                } else {
                    transitions.r = new TransitionLinear(null, target.color.getR());
                    transitions.g = new TransitionLinear(null, target.color.getG());
                    transitions.b = new TransitionLinear(null, target.color.getB());
                    animation[target.key] = new Animation(transitions, 30);
                }
            });

            this.animations.push(animation);
        }
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

export { MapScreen }