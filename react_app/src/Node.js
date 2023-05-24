class Node {
	constructor(x, y, r, index, connections) {
		this.x = x;	
		this.y = y;
		this.r = r;
		this.index = index;
		this.connections = connections ? connections : [];
	};

	addConnection(node, type) {
		if (! this.connections.includes({node: node, type: type})) {
			this.connections.push({node: node, type: type});
		}
	}
}

export default Node;