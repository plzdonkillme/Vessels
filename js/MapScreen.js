import { Point, Vector } from "./Vector";
import { Animation, TransitionNoop, TransitionLinear, TransitionQuadraticBezier } from "./Animation";
import { Viewport } from "./Viewport";
import { Polygon, Overlay } from "./Polygon";
import { PolygonRenderer} from "./PolygonRenderer";

const TLEN = 100;

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

        this.staticPolygons = {};
        this.dynamicPolygons = {};
        this.animations = [];

        this.map.getTilesFlattened().filter(t => t.constructor.name() !== 'e').reduce((polygons, tile) => {
            const polygon = Polygon.createBox(tile.getX() * TLEN, tile.getY() * TLEN, 0, TLEN, TLEN, tile.getH() * TLEN);
            polygons[tile.getKey()] = polygon;
            return polygons;
        }, this.staticPolygons);

        this.map.getMapObjects().reduce((polygons, mapObject) => {
            let polygon;
            if (mapObject.getPolygon() === 'icosahedron') {
                polygon = Polygon.createIcosahedron(mapObject.getX() * TLEN + TLEN / 2, mapObject.getY() * TLEN + TLEN / 2, mapObject.getH() * TLEN + TLEN / 2, 20);
            } else if (mapObject.getPolygon() === 'tetrahedron') {
                polygon = Polygon.createTetrahedron(mapObject.getX() * TLEN + TLEN / 2, mapObject.getY() * TLEN + TLEN / 2, mapObject.getH() * TLEN + TLEN / 2, 20);
            }
            polygon.setColor(mapObject.getColor(), mapObject.getHoverColor());
            polygons[mapObject.getKey()] = polygon;
            return polygons;
        }, this.dynamicPolygons);

        this.overlays = {
            'move': new Overlay(50, 50, 150, 50, 'move'),
            'attack': new Overlay(50, 100, 150, 50, 'attack'),
            'transfer': new Overlay(50, 150, 150, 50, 'transfer'), 
            'end': new Overlay(50, 200, 150, 50, 'end'),
        };

        this.r = new Vector(0, 0, 1);

        this.renderer = new PolygonRenderer(this.canvas, Object.values(this.staticPolygons), (a,b) => a.getNormal().getZ() - b.getNormal().getZ());
        map.addListener(this);
    }

    start() {
        this.renderLoop();
    }

    renderLoop() {
        this.viewport.updatePosition();
        this.r.rotate(new Vector(1, 0, 0), 1 * Math.PI / 180);
        Object.values(this.dynamicPolygons).forEach(p => {
            p.rotate(this.r, 1 * Math.PI / 180);
        });


        const polygonsToDestroy = [];
        if (this.animations.length > 0) {
            const animation = this.animations[0];
            const finishedAnimations = [];
            for (let key in animation) {
                const a = animation[key];
                const p = this.dynamicPolygons[key];
                if (!a.isInitialized()) {
                    a.initialize(p.getState());
                }
                const state = a.getNextState()
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


        this.renderer.render(this.viewport, Object.values(this.dynamicPolygons), Object.values(this.overlays));

        polygonsToDestroy.forEach(key => delete this.dynamicPolygons[key]);


        window.requestAnimationFrame((step) => {
            this.renderLoop();
        });
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
                    transitions.hr = new TransitionLinear(null, e.hoverColor.getR());
                    transitions.hg = new TransitionLinear(null, e.hoverColor.getG());
                    transitions.hb = new TransitionLinear(null, e.hoverColor.getB());

                    const shardTransitions = {}
                    shardTransitions.a = new TransitionLinear(null, 0);
                    shardTransitions.ha = new TransitionLinear(null, 0);
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
            srcTransitions.hr = new TransitionLinear(null, e.srcHoverColor.getR());
            srcTransitions.hg = new TransitionLinear(null, e.srcHoverColor.getG());
            srcTransitions.hb = new TransitionLinear(null, e.srcHoverColor.getB());
            animation[e.srcKey] = new Animation(srcTransitions, 30);

            const dstTransitions = {}
            dstTransitions.r = new TransitionLinear(null, e.dstColor.getR());
            dstTransitions.g = new TransitionLinear(null, e.dstColor.getG());
            dstTransitions.b = new TransitionLinear(null, e.dstColor.getB());
            dstTransitions.hr = new TransitionLinear(null, e.dstHoverColor.getR());
            dstTransitions.hg = new TransitionLinear(null, e.dstHoverColor.getG());
            dstTransitions.hb = new TransitionLinear(null, e.dstHoverColor.getB());
            animation[e.dstKey] = new Animation(dstTransitions, 30);

            this.animations.push(animation);
        } else if (e.name === 'attack') {
            const animation = {};

            const dstTransitions = {}
            if (e.dstColor === null) {
                dstTransitions.a = new TransitionLinear(null, 0);
                dstTransitions.ha = new TransitionLinear(null, 0);
                dstTransitions.sa = new TransitionLinear(null, 0);
                animation[e.dstKey] = new Animation(dstTransitions, 30, true);
            } else {
                dstTransitions.r = new TransitionLinear(null, e.dstColor.getR());
                dstTransitions.g = new TransitionLinear(null, e.dstColor.getG());
                dstTransitions.b = new TransitionLinear(null, e.dstColor.getB());
                dstTransitions.hr = new TransitionLinear(null, e.dstHoverColor.getR());
                dstTransitions.hg = new TransitionLinear(null, e.dstHoverColor.getG());
                dstTransitions.hb = new TransitionLinear(null, e.dstHoverColor.getB());
                animation[e.dstKey] = new Animation(dstTransitions, 30);
            }

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

    handleClick(x, y) {
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