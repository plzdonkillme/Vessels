import { Point, Vector } from "./Vector";
import { Viewport } from "./Viewport";
import { Polygon } from "./Polygon";
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

        this.r = new Vector(0, 0, 1);
        const tilePolygons = this.map.getTilesFlattened().filter(t => t.constructor.name() !== 'e').map(t => Polygon.createBox(t.getX() * TLEN, t.getY() * TLEN, 0, TLEN, TLEN, t.getH() *TLEN));
        this.objPolygons = this.map.getMapObjects().reduce((a, m) => {
            const p = Polygon.createIcosahedron(m.getX() * TLEN + TLEN / 2, m.getY() * TLEN + TLEN / 2, m.getH() * TLEN + TLEN / 2, 20);
            m.getPlayer() === '0' ? p.setColor('#FFFFFF', '#E6E6E6') : p.setColor('#e6e6e6', '#ffffff');
            a[`${m.getX()}-${m.getY()}`] = p;
            return a;
        }, {});

        this.renderer = new PolygonRenderer(this.canvas, tilePolygons, (a,b) => a.getNormal().getZ() - b.getNormal().getZ());
        map.addListener(this);
    }

    start() {
        this.renderLoop();
    }

    renderLoop() {
        this.viewport.updatePosition();
        this.r.rotate(new Vector(1, 0, 0), 1 * Math.PI / 180);
        const objs = Object.values(this.objPolygons);
        objs.forEach(obj => {
            obj.rotate(this.r, 1 * Math.PI / 180);
            obj.updatePosition();
        });
        this.renderer.render(this.viewport, objs);
        window.requestAnimationFrame((step) => {
            this.renderLoop();
        });
    }

    trigger(e) {
        if (e.name === 'move') {
            const obj = this.objPolygons[e.path[0]];
            const tiles = this.map.getTiles();
            const animations = e.path.slice(1, e.path.length).map(p => {
                const x = parseInt(p.split('-')[0]);
                const y = parseInt(p.split('-')[1]);
                const t = tiles[y][x];
                return {
                    rate: null,
                    dx: t.getX() * TLEN + TLEN / 2,
                    dy: t.getY() * TLEN + TLEN / 2,
                    dz: t.getH() * TLEN + TLEN / 2,
                    frames: 30,
                };
            });
            obj.queueAnimations(animations);
        }
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

    animateNextTurn(turnActor) {
        return this.mapRenderer.centerOn(turnActor);
        //return new Promise((resolve, reject) => {
        //    resolve();
            //return this.mapRenderer.centerOn(turnActor);
        //});
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