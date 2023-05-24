class Player {
	constructor(name, position, color, radius, tax, bus, udg) {
		this.name = name;
		this.position = position;
		this.color = color;
		this.radius = radius;
		this.tax = tax ? tax : 0;
		this.bus = bus ? bus : 0;
		this.udg = udg ? udg : 0;
	}
}

export default Player;