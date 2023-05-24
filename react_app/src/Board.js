class Board {
	constructor(nodes, edges, players) {
		this.nodes = nodes ? nodes : [];
		this.edges = edges ? edges : [];
		this.players = players ? players : [];
		this.positions = [];
	};

	addNode = function (node) {
		this.nodes.push(node);
	};

	addEdge = function (edge) {
		this.edges.push(edge);
		edge.node1.addConnection(edge.node2, edge.type);
		edge.node2.addConnection(edge.node1, edge.type);
	};

	addPlayer = function (player) {
		this.players.push(player);
	};

	updatePositions = function () {
		this.positions = this.players.map((player) => { return player.position; } )
	};
}

export default Board;