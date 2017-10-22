import { BSPTree } from "./BSPTree";

class PolygonRenderer {
    
    constructor(canvas, staticPolygons, faceSort = () => {}) {
        this.canvas = canvas;
        const staticFaces = staticPolygons.reduce((a, b) => a.concat(b.getFaces()), []);
        staticFaces.sort(faceSort);
        this.bsp = new BSPTree(staticFaces);
        this.staticPolygons = staticPolygons;
        this.hoveredPolygon = null;
    }

    render(viewport, polygons) {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const facesToDraw = [];
        let hoveredFace = null;

        this.bsp.addFaces(polygons.reduce((a, b) => a.concat(b.getFaces()), []));

        this.bsp.traverse((face) => {
            const { visiblePoints, mapping, visible} = viewport.projectFace(face);
            face.setVisiblePoints(visiblePoints, mapping);
            if (visible) {
                if (viewport.mouseInside(visiblePoints)) {
                    hoveredFace = face;
                }
                facesToDraw.push(face);
            }
        }, viewport);

        this.bsp.removeFaces(polygons.reduce((a, b) => a.concat(b.getFaces()), []));

        this.staticPolygons.concat(polygons).forEach(polygon => {
            polygon.calcClippedFace();
            const clippedFace = polygon.getClippedFace();
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

        facesToDraw.forEach(face => face.draw(ctx));

        polygons.forEach(polygon => polygon.restoreFaces());
    }
}

export { PolygonRenderer };