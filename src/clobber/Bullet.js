class Bullet {
	constructor(ownerId, point, direction, world) {
		this.ownerId = ownerId;
		this.point = point;
		this.direction = direction;
		this.world = world;
	}

	render(context) {
		context.fillStyle = "#00FF00";
		context.beginPath();
		context.arc(this.point.x, this.point.y, this.world.bulletRadius, 0, 2 * Math.PI);
		context.fill();

		context.fillStyle = "#000";
	}
}

export default Bullet;
