import { Point } from './Vector';
import getCube from './FaceGroup';
import Viewport from './Viewport';
import FaceRasterizer from './FaceRasterizer';

const TLEN = 100;

class GameMapRenderer {
  constructor(canvas, map) {
    this.canvas = canvas;
    this.map = map;
    this.viewport = new Viewport(
      new Point(0, 0, 0),
      new Point(this.canvas.width, 0, 0),
      new Point(0, this.canvas.height, 0),
      new Point(this.canvas.width, this.canvas.height, 0),
      Math.max(this.canvas.width, this.canvas.height) / 2,
    );
    // convert map into faces;
    const { tiles } = map.toJSON();
    let faces = [];
    for (let i = 0; i < tiles.length; i += 1) {
      for (let j = 0; j < tiles[i].length; j += 1) {
        if (tiles[i][j].type === 'p') {
          faces = faces.concat(getCube(
            tiles[i][j].x * TLEN,
            tiles[i][j].y * TLEN,
            0,
            TLEN,
            TLEN,
            tiles[i][j].h * TLEN,
          ));
        }
      }
    }

    this.rasterizer = new FaceRasterizer(faces);
  }

  render() {
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
  }
}

export default GameMapRenderer;
