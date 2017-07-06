class BSPTree {
	
	constructor(planes) {
		this.nodes = [];
		this.frontnodes = null;
		this.backnodes = null;
		if (planes.length == 0) {
			return;
		}

		let i = 0;
		for (let j = 0; j < planes.length; j++) {
			if (planes[j].n.z === 0) {
				i = j;
				break;
			}
		}
		if (i === planes.length) {
			i = 0;
		}

		this.nodes = [planes[i]];

		const p0 = planes[i].points[0];
		const n = planes[i].n;
		const frontnodes = [];
		const backnodes = [];
		for (let j = 0; j < planes.length; j++) {
			if (j !== i) {
				let p = planes[j];
				let p1 = p.points[0];
				let p2 = p.points[2];
				let p1d = (p1.x - p0.x) * n.x + (p1.y - p0.y) * n.y + (p1.z - p0.z) * n.z;
				let p2d = (p2.x - p0.x) * n.x + (p2.y - p0.y) * n.y + (p2.z - p0.z) * n.z;
				if (p1d === 0 && p2d === 0) {
					this.nodes.push(planes[j]);
				} else if (p1d <= 0 && p2d <= 0) {
					backnodes.push(planes[j]);
				} else if (p1d >= 0 && p2d >= 0) {
					frontnodes.push(planes[j]);
				}
			}
		}

		if (frontnodes.length > 0) {
			this.frontnodes = new BSPTree(frontnodes);
		}
		if (backnodes.length > 0) {
			this.backnodes = new BSPTree(backnodes);
		}
	}

	traverse(fn) {
		if (this.backnodes !== null) {
			this.backnodes.traverse(fn);
		}
		for (let i = 0; i < this.nodes.length; i++) {
			fn(this.nodes[i]);
		}
		if (this.frontnodes !== null) {
			this.frontnodes.traverse(fn);
		}
	}
}

export { BSPTree };