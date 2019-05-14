class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	distance(point) {
		return Math.hypot(point.x - this.x, point.y - this.y);
	}
}

export default Point;
