var canvas = document.createElement("canvas");
//var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

/*var start = 0;
function main(timestamp) {
	var dt = timestamp - start;
	console.log(dt);
	start = timestamp;
    window.requestAnimationFrame(main);
}

window.requestAnimationFrame(main);*/

//Game object that holds all the state
//  scene
//
class Map {

	constructor(tile_group, map_objects, canvas) {
		this.tile_group = tile_group;
		this.map_objects = map_objects;
		this.canvas = canvas;
	}

	draw() {
		var ctx = this.canvas.getContext("2d");
		this.tile_group.draw(ctx);
		this.map_objects.forEach((m) => {
			m.draw(ctx);
		});
	}


}

class TileParser {

	constructor(tile_mapping) {
		this.tile_mapping = tile_mapping;
	}

	parse(tile_group_string) {
		let tile_array = [];
		let rows = tile_group_string.split('\n');
		for (let y = 0; y < rows.length; y++) {
			let tile_row = [];
			let cols = rows[y].split(' ');
			for (let x = 0; x < cols.length; x++) {
				let props = cols[x].split('-');
				let tile = new this.tile_mapping[props[0]](x, y, props[1]);

				if (x > 0) {
					tile.link('left', tile_row[x - 1]);
					tile_row[x - 1].link('right', tile);
				}
				if (y > 0) {
					tile.link('top', tile_array[y - 1][x]);
					tile_array[y - 1][x].link('down', tile);
				}
				tile_row.push(tile);
			}
			tile_array.push(tile_row);
		}

		return new TileGroup(tile_array);
	}
}

class Tile {

	constructor(x, y, h) {
		this.x = x;
		this.y = y;
		this.h = h;
		this.left = null;
		this.right = null;
		this.top = null;
		this.down = null;
	}

	link(dir, tile) {
		this[dir] = tile;
	}

}

class PlainTile extends Tile {

	toString() {
		return `p-${this.h}` 
	}

	draw(ctx) {
		ctx.fillStyle = "#FF0000";
		ctx.strokeStyle = "#000000";
		ctx.fillRect(100 * this.x, 100 * this.y, 100, 100);
		ctx.strokeRect(100 * this.x, 100 * this.y, 100, 100);
	}
}

class EmptyTile extends Tile {

	toString() {
		return `e-${this.h}`
	}

	draw(ctx) {
		ctx.fillStyle = "#00FF00";
		ctx.strokeStyle = "#000000";
		ctx.fillRect(100 * this.x, 100 * this.y, 100, 100);
		ctx.strokeRect(100 * this.x, 100 * this.y, 100, 100);
	}
}

class TileGroup {

	constructor(tiles) {
		this.tiles = tiles;
	}

	getTile(x, y) {
		return this.tiles[y][x];
	}

	toString() {
		console.log(this.tiles.map((tile_row) => {
			return tile_row.map((tile) => tile.toString()).join(' ');
		}).join('\n'));
	}

	draw(ctx) {
		this.tiles.forEach((tile_row) => {
			tile_row.forEach((tile) => {
				tile.draw(ctx);
			});
		});
	}

}

class MapObjectParser {

	constructor(object_mapping, tile_group) {
		this.object_mapping = object_mapping;
		this.tile_group = tile_group;
	}

	parse(map_object_string) {
		return map_object_string.split('\n').map((obj) => {
			let props = obj.split('-');
			let cls = this.object_mapping[props[0]];
			let x = parseInt(props[1]);
			let y = parseInt(props[2]);
			return new cls(this.tile_group.getTile(x, y));
		});
	}

}

class MapObject {

	constructor(tile) {
		this.tile = tile;
	}
}

class Knight extends MapObject {

	draw(ctx) {
		ctx.fillStyle = "#0000FF";
		ctx.fillRect(this.tile.x * 100 + 20, this.tile.y * 100 + 20, 60, 60);
	}
}

var example_string = 
`p-1 p-1 p-1 p-1
p-1 e-1 p-1 p-1
p-1 p-1 p-1 e-1
p-1 p-1 e-1 p-1`;

var example_string2 = 
`k-0-0
k-2-1`;

var a = new TileParser({
	p: PlainTile,
	e: EmptyTile
});

var b = a.parse(example_string);

var c = new MapObjectParser({
	k: Knight
}, b);

var d = c.parse(example_string2);

var e = new Map(b, d, canvas);