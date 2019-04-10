import FaceRasterizer from './render/FaceRasterizer';

class GameMapRenderer {
  constructor(canvas, staticEntities3D = []) {
    this.canvas = canvas;
    this.staticFaceToEntity = new Map();
    let staticFaces = [];
    for (let i = 0; i < staticEntities3D.length; i += 1) {
      const faces = staticEntities3D[i].getFaces();
      for (let k = 0; k < faces.length; k += 1) {
        this.staticFaceToEntity.set(faces[k], staticEntities3D[i]);
      }
      staticFaces = staticFaces.concat(faces);
    }
    this.rasterizer = new FaceRasterizer(staticFaces);
    this.mx = null;
    this.my = null;
    this.hoveredEntity = null;
  }

  setMouse(mx, my) {
    this.mx = mx;
    this.my = my;
  }

  mouseInside(points) {
    if (this.mx === null || this.my === null || points.length === 0) {
      return false;
    }
    let zPos = null;
    for (let i = 0; i < points.length; i += 1) {
      const p = points[i];
      const np = i === points.length - 1 ? points[0] : points[i + 1];
      const v1 = {
        x: np.getX() - p.getX(),
        y: np.getY() - p.getY(),
      };
      const v2 = {
        x: this.mx - p.getX(),
        y: this.my - p.getY(),
      };
      const cross = (v1.x * v2.y) - (v1.y * v2.x);
      if (zPos === null) {
        zPos = cross > 0;
      } else if ((cross > 0) !== zPos) {
        return false;
      }
    }
    return true;
  }

  getHoveredEntity() {
    return this.hoveredEntity;
  }

  rasterize(viewport, entities) {
    let entityFaces = [];
    const faceToEntity = new Map(this.staticFaceToEntity);
    for (let i = 0; i < entities.length; i += 1) {
      const faces = entities[i].getFaces();
      for (let k = 0; k < faces.length; k += 1) {
        faceToEntity.set(faces[k], entities[i]);
      }
      entityFaces = entityFaces.concat(faces);
    }

    const rasterFaces = this.rasterizer.rasterize(viewport, entityFaces);
    return {
      rasterFaces,
      faceToEntity,
    };
  }

  render(viewport, entities3D = [], entities2D = []) {
    this.clearCanvas();
    this.hoveredEntity = null;
    this.render3D(viewport, entities3D);
    this.render2D(entities2D);
  }

  clearCanvas() {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render3D(viewport, entities3D) {
    const { rasterFaces, faceToEntity } = this.rasterize(viewport, entities3D);
    const ctx = this.canvas.getContext('2d');

    for (let i = 0; i < rasterFaces.length; i += 1) {
      const rasterFace = rasterFaces[i];
      const origFace = rasterFace.getFace();
      const entity = faceToEntity.get(origFace);
      const points = rasterFace.getPoints();

      // Hovered Entity Check
      if (entity.isHoverable() && this.mouseInside(points)) {
        this.hoveredEntity = entity;
      }

      ctx.fillStyle = entity.getFillStyle(origFace);
      ctx.strokeStyle = entity.getStrokeStyle(origFace);
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

  render2D(entities2D) {
    const ctx = this.canvas.getContext('2d');
    for (let i = 0; i < entities2D.length; i += 1) {
      const entity = entities2D[i];
      const points = entity.getPoints();

      // Hovered Entity Check
      if (entity.isHoverable() && this.mouseInside(points)) {
        this.hoveredEntity = entity;
      }

      ctx.fillStyle = entity.getFillStyle();
      ctx.strokeStyle = entity.getStrokeStyle();
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
      ctx.stroke();

      const textInfos = entity.getTextInfos();
      for (let k = 0; k < textInfos.length; k += 1) {
        ctx.textBaseline = textInfos[k].textBaseline;
        ctx.fillStyle = textInfos[k].fillStyle;
        ctx.font = textInfos[k].font;
        ctx.fillText(textInfos[k].text, textInfos[k].x, textInfos[k].y);
      }
    }
  }
}

export default GameMapRenderer;
