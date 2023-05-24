class Player {
	constructor(position, color, radius, tax, bus, udg) {
		this.position = position;
		this.color = color;
		this.radius = radius;
		this.tax = tax ? tax : 0;
		this.bus = bus ? bus : 0;
		this.udg = udg ? udg : 0;
	}
}

export default Player;