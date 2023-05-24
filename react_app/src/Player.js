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

class MrX extends Player {
	constructor(name, position, color, radius, tax, bus, udg, rvr, x2) {
		super(name, position, color, radius, tax, bus, udg);
		this.rvr = rvr ? rvr : 0;
		this.x2 = x2 ? x2 : 0;
	}
}

export default Player;
export { MrX };