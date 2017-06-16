class Tile {

    getClassName() {
        throw Error('Unimplemented');
    }

    constructor(x, y, h) {
        this.x = x;
        this.y = y;
        this.h = h;
        this.left = null;
        this.right = null;
        this.top = null;
        this.down = null;
        this.highlighted = false;
    }

    link(dir, tile) {
        this[dir] = tile;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getH() {
        return this.h;
    }

    changeNeighbors(steps, highlight) {
        if (steps === 0) {
            return;
        }
        const neighbors = [this.left, this.right, this.top, this.down];
        neighbors.forEach((tile) => {
            if (tile !== null) {
                if (highlight && !tile.isHighlighted()) {
                    tile.highlight();
                    tile.changeNeighbors(steps - 1, highlight);
                }
                if (!highlight && tile.isHighlighted()) {
                    tile.unhighlight();
                    tile.changeNeighbors(steps - 1, highlight);
                }
            }
        });
    }

    isHighlighted() {
        return this.highlighted;
    }

    highlight() {
        this.highlighted = true;
    }

    unhighlight() {
        this.highlighted = false;
    }

}

class PlainTile extends Tile {

    getClassName() {
        return 'Plain';
    }

    toString() {
        return `p-${this.h}` 
    }
}

class EmptyTile extends Tile {

    getClassName() {
        return 'Empty';
    }

    toString() {
        return `e-${this.h}`
    }

    changeNeighbors(steps, highlight) {
        return;
    }

    highlight() {
        return;
    }

    unhighlight() {
        return;
    }
}

export {Tile, EmptyTile, PlainTile};