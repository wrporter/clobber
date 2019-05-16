class Bullet {
	constructor(owner, point, direction) {
		this.owner = owner;
		this.point = point;
		this.direction = direction;
	}

	render(context) {
		context.fillStyle = "#00FF00";
		context.beginPath();
		context.arc(this.point.x, this.point.y, 2, 0, 2 * Math.PI);
		context.fill();

		context.fillStyle = "#000";
	}
}

export default Bullet;
