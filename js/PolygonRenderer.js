import { BSPTree } from "./BSPTree";

class PolygonRenderer {
    
    constructor(canvas, staticPolygons) {
        this.canvas = canvas;
        this.bsp = new BSPTree(staticPolygons.reduce((a, b) => a.concat(b.getFaces()), []));
        this.staticPolygons = staticPolygons;
        this.hoveredPolygon = null;
    }

    render(viewport) {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const facesToDraw = [];
        let hoveredFace = null;
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

        this.staticPolygons.forEach(polygon => {
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
    }
}

export { PolygonRenderer };