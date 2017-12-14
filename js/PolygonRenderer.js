import { BSPTree } from "./BSPTree";

class PolygonRenderer {
    
    constructor(canvas, staticPolygons, faceSort = () => {}) {
        this.canvas = canvas;
        const staticFaces = staticPolygons.reduce((a, b) => a.concat(b.getFaces()), []);
        staticFaces.sort(faceSort);
        this.bsp = new BSPTree(staticFaces);
        this.staticPolygons = staticPolygons;
        this.hoveredObj = null;
    }

    render(viewport, polygons, overlays) {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const facesToDraw = [];
        let hoveredObj = null;

        this.bsp.addFaces(polygons.reduce((a, b) => a.concat(b.getFaces()), []));

        this.bsp.traverse((face) => {
            const { visiblePoints, mapping, visible} = viewport.projectFace(face);
            face.setVisiblePoints(visiblePoints, mapping);
            if (visible) {
                if (viewport.mouseInside(visiblePoints)) {
                    hoveredObj = face.getPolygon();
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
                    hoveredObj = polygon;
                }
                facesToDraw.push(clippedFace);
            }
        });

        overlays.forEach(overlay => {
            if (viewport.mouseInside(overlay.getVisiblePoints())) {
                hoveredObj = overlay;
            }
            facesToDraw.push(overlay);
        });

        if (this.hoveredObj !== null) {
            this.hoveredObj.toggleHover();
        }
        if (hoveredObj !== null) {
            this.hoveredObj = hoveredObj;
            this.hoveredObj.toggleHover();
        } else {
            this.hoveredObj = null;
        }

        facesToDraw.forEach(face => face.draw(ctx));

        polygons.forEach(polygon => polygon.restoreFaces());
    }
}

export { PolygonRenderer };