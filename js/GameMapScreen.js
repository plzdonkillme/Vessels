import { Point } from './Vector';
import Viewport from './Viewport';
import FaceRasterizer from './FaceRasterizer';
import Face from './Face';

let face1;
let face2;
let face3;

const R_RATE = 3;
const T_RATE = 5;

class GameMapScreen {
  constructor(canvas, map) {
    this.canvas = canvas;
    this.map = map;
    this.viewport = new Viewport(
      new Point(0, 0, 200),
      new Point(this.canvas.width, 0, 200),
      new Point(0, this.canvas.height, 200),
      new Point(this.canvas.width, this.canvas.height, 200),
      500,
    );

    const w = this.canvas.width / 2;
    const h = this.canvas.height / 2;
    face1 = Face.createFromBuffer([
      w, h - 50, 50,
      w, h + 50, 50,
      w, h + 50, -50,
      w, h - 50, -50,
    ]);
    face2 = Face.createFromBuffer([
      w - 50, h - 50, 0,
      w + 50, h - 50, 0,
      w + 50, h + 50, 0,
      w - 50, h + 50, 0,
    ]);
    face3 = Face.createFromBuffer([
      w - 50, h - 50, -100,
      w + 50, h - 50, -100,
      w + 50, h + 50, -100,
      w - 50, h + 50, -100,
    ]);

    this.rasterizer = new FaceRasterizer([face1]);

    this.pressed = {};
  }

  start() {
    this.renderLoop();
  }

  renderLoop() {
    this.viewport.updatePosition();
    const rasterFaces = this.rasterizer.rasterize(this.viewport, [face2, face3]);

    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = '#CCCCCC';
    ctx.strokeStyle = '#000000';
    for (let i = 0; i < rasterFaces.length; i += 1) {
      const rasterFace = rasterFaces[i];
      if (rasterFace.getFace() === face1) {
        ctx.fillStyle = '#66ccff';
      } else {
        ctx.fillStyle = '#CCCCCC';
      }
      const points = rasterFace.getPoints();
      ctx.beginPath();
      for (let k = 0; k < points.length; k += 1) {
        if (k === 0) {
          ctx.moveTo(points[k].getX(), points[k].getY());
        }
        if (k === points.length - 1) {
          ctx.lineTo(points[0].getX(), points[0].getY());
        } else {
          ctx.lineTo(points[k + 1].getX(), points[k + 1].getY());
        }
      }
      ctx.fill();

      const edges = rasterFace.getEdges();
      ctx.beginPath();
      for (let k = 0; k < edges.length; k += 1) {
        ctx.moveTo(points[edges[k][0]].getX(), points[edges[k][0]].getY());
        ctx.lineTo(points[edges[k][1]].getX(), points[edges[k][1]].getY());
      }
      ctx.stroke();
    }

    window.requestAnimationFrame(() => {
      this.renderLoop();
    });
  }

  handleClick(x, y) {
  }

  handleMouseDown(x, y) {
  }

  handleMouseMove(x, y) {
  }

  handleMouseUp(x, y) {
  }

  handleMouseLeave() {
  }

  handleKeyDown(code) {
    if (!this.pressed[code]) {
      this.pressed[code] = true;
      const updateRates = {};
      switch (code) { // eslint-disable-line default-case
        case 'KeyA':
          updateRates.t1 = -T_RATE;
          break;
        case 'KeyW':
          updateRates.t3 = T_RATE;
          break;
        case 'KeyD':
          updateRates.t1 = T_RATE;
          break;
        case 'KeyS':
          updateRates.t3 = -T_RATE;
          break;
        case 'Space':
          updateRates.t2 = -T_RATE;
          break;
        case 'ShiftLeft':
          updateRates.t2 = T_RATE;
          break;
        case 'ArrowUp':
          updateRates.r1 = -R_RATE;
          break;
        case 'ArrowDown':
          updateRates.r1 = R_RATE;
          break;
        case 'ArrowLeft':
          updateRates.r2 = R_RATE;
          break;
        case 'ArrowRight':
          updateRates.r2 = -R_RATE;
          break;
      }
      this.viewport.updateRates(updateRates);
    }
  }

  handleKeyUp(code) {
    if (this.pressed[code]) {
      this.pressed[code] = false;
      const updateRates = {};
      switch (code) { // eslint-disable-line default-case
        case 'KeyA':
          updateRates.t1 = T_RATE;
          break;
        case 'KeyW':
          updateRates.t3 = -T_RATE;
          break;
        case 'KeyD':
          updateRates.t1 = -T_RATE;
          break;
        case 'KeyS':
          updateRates.t3 = T_RATE;
          break;
        case 'Space':
          updateRates.t2 = T_RATE;
          break;
        case 'ShiftLeft':
          updateRates.t2 = -T_RATE;
          break;
        case 'ArrowUp':
          updateRates.r1 = R_RATE;
          break;
        case 'ArrowDown':
          updateRates.r1 = -R_RATE;
          break;
        case 'ArrowLeft':
          updateRates.r2 = -R_RATE;
          break;
        case 'ArrowRight':
          updateRates.r2 = R_RATE;
          break;
      }
      this.viewport.updateRates(updateRates);
    }
  }
}

export default GameMapScreen;
