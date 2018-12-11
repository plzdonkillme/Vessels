import { Point } from './Vector';
import Viewport from './Viewport';
import FaceRasterizer from './FaceRasterizer';
import Face from './Face';

class GameMapScreen {
  constructor(canvas, map) {
    this.canvas = canvas;
    this.map = map;
    this.viewport = new Viewport(
      new Point(0, 0, 500),
      new Point(this.canvas.width, 0, 500),
      new Point(0, this.canvas.height, 500),
      new Point(this.canvas.width, this.canvas.height, 500),
      500,
    );

    const face = Face.createFromBuffer([
      0, 0, 0,
      100, 0, 0,
      100, 100, 0,
      0, 100, 0,
    ]);
    this.rasterizer = new FaceRasterizer([face]);

    this.pressed = {};
  }

  start() {
    this.renderLoop();
  }

  renderLoop() {
    this.viewport.updatePosition();
    const rasterFaces = this.rasterizer.rasterize(this.viewport, []);

    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = '#CCCCCC';
    ctx.strokeStyle = '#000000';
    for (let i = 0; i < rasterFaces.length; i += 1) {
      const rasterFace = rasterFaces[i];
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
      switch (code) { // eslint-disable-line default-case
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

export default GameMapScreen;
