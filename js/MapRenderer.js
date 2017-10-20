class MapRenderer {

    constructor(canvas, map, viewport) {
        this.canvas = canvas;
        this.boundingBoxes = [];
        this.map = map;
        this.viewport = viewport;

        this.hoveredRenderObject = null;
        this.tileRenderObjects = this.map.getTilesFlattened()
            .filter(tile => !(tile instanceof EmptyTile))
            .map(tile => new TileRenderObject(tile));
        this.mapObjectFaces = this.tileRenderObjects
            .filter(t => t.getMapObjectFace() !== null)
            .map(t => t.getMapObjectFace());
        this.buildBSP();
    }

    buildBSP() {
        const flattened = this.tileRenderObjects.reduce(function(a, b) {
            return a.concat(b.getFaces());
        }, []);
        this.bsp = new BSPTree(flattened);
    }
    
    renderMap() {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.boundingBoxes = [];

        this.viewport.updatePosition();
        this.mapObjectFaces.forEach(m => m.updatePosition());

        let selectedFace = null;
        const facesToDraw = [];
        this.bsp.traverse((face) => {
            const { visiblePoints, clippedPoints, visible} = this.viewport.projectPlane(face.getPoints(), face.getNormal());
            face.setVisiblePoints(visiblePoints);
            face.setClippedPoints(clippedPoints);
            if (visible) {
                if (this.viewport.mouseInside(visiblePoints)) {
                    selectedFace = face;
                }
                facesToDraw.push(face);
            }
            const mapObjectFace = face.getMapObjectFace();
            if (mapObjectFace !== null) {
                const projectedBottom = this.viewport.projectPoint(mapObjectFace.getBottomPoint());
                const projectedTop = this.viewport.projectPoint(mapObjectFace.getTopPoint());

                if (projectedBottom !== null && projectedTop !== null) {
                    const viewDir = this.viewport.getViewDir(mapObjectFace.getBottomPoint(), mapObjectFace.getTopVector());
                    const viewVector = this.viewport.getViewVector(mapObjectFace.getBottomPoint());
                    
                    const x = viewVector.getX();
                    const y = viewVector.getY();
                    let angle = Math.atan(y / x);
                    if (x > 0) {
                        angle += Math.PI;
                    }
                    if (angle < 0) {
                        angle += 2 * Math.PI;
                    }

                    mapObjectFace.setViewAngle(angle);
                    mapObjectFace.setProjectedTop(projectedTop);
                    mapObjectFace.setProjectedBottom(projectedBottom);
                    mapObjectFace.setViewDir(viewDir);
                    facesToDraw.push(mapObjectFace);
                }
            }
        }, this.viewport);

        this.tileRenderObjects.forEach(obj => {
            obj.calcClippedFace();
            const clippedFace = obj.getClippedFace();
            if (clippedFace !== null) {
                if (this.viewport.mouseInside(clippedFace.getVisiblePoints())) {
                    selectedFace = clippedFace;
                }
                facesToDraw.push(clippedFace);
            }
        });

        this.map.getPlayerOptions().forEach((option, index) => {
            let menuFace = new MenuFace(option, index);
            if (this.viewport.mouseInside(menuFace.getVisiblePoints())) {
                selectedFace = menuFace;
            }
            facesToDraw.push(menuFace);
        });

        if (this.hoveredRenderObject !== null) {
            this.hoveredRenderObject.toggleHover();
        }
        if (selectedFace !== null) {
            this.hoveredRenderObject = selectedFace.getRenderObject();
            this.hoveredRenderObject.toggleHover();
        } else {
            this.hoveredRenderObject = null;
        }

        facesToDraw.forEach((face) => {
            face.draw(ctx);
        });

        window.requestAnimationFrame((step) => {
            this.renderMap();
        });
    }

    centerOn(mapObject) {
        const mapObjectFace = this.mapObjectFaces.filter(m => m.getMapObject() === mapObject)[0];
        return this.viewport.animate({
            endpoint: this.viewport.getCenteredP1(mapObjectFace.getBottomPoint(), 500),
            rate: null,
            frames: 30,
        });
    }

    animateMove(mapObject, destTile) {
        return new Promise((resolve, reject) => {
            const mapObjectFace = this.mapObjectFaces.filter(m => m.getMapObject() === mapObject)[0];
            const tileRenderObject = this.tileRenderObjects.filter(t => t.getObject() === destTile)[0];
            const endpoint = tileRenderObject.getMapObjectPoint();
            mapObjectFace.setTileRenderObject(tileRenderObject);
            mapObjectFace.animate({
                endpoint: endpoint,
                rate: null,
                frames: 30,
            }).then(() => {
                resolve();
            });
            /*const midpoint = mapObjectFace.getBottomPoint().midpoint(endpoint, 0.5);
            mapObjectFace.animate({
                endpoint: midpoint,
                rate: null,
                frames: 30, 
            }).then(() => {
                mapObjectFace.setTileRenderObject(tileRenderObject);
                mapObjectFace.animate({
                    endpoint: endpoint,
                    rate: null,
                    frames: 30,
                }).then(() => {
                    resolve();
                });
            });*/
        });

    }

    getClickedObject() {
        if (this.hoveredRenderObject !== null) {
            return this.hoveredRenderObject.getObject();
        }
        return null;
    }

    getClickedObjects(viewport) {
        const clickedObjects = [];
        const mx = viewport.mx;
        const my = viewport.my;
        for (let i = 0; i < this.boundingBoxes.length; i++) {
            let boundingBox = this.boundingBoxes[i];
            if (mx > boundingBox.x1 && mx < boundingBox.x2 && my > boundingBox.y1 && my < boundingBox.y2) {
                clickedObjects.push(boundingBox.obj);
            }
        }
        return clickedObjects;
    }

    getCenteredViewport(mapObject) {

    }
}