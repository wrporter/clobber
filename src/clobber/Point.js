class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	distance(point) {
		return Math.hypot(point.x - this.x, point.y - this.y);
	}

	clone() {
		return new Point(this.x, this.y);
	}

	toString() {
		return `(${this.x}, ${this.y})`;
	}
}

export default Point;
