export class Circle {
	/**
	 * @param {Number} radius - radius of circle
	 * @param {Number} x - x coordinate of center of circle
	 * @param {Number} y - y coordinate of center of circle
	 */
	constructor(radius, x, y) {
		this.radius = radius;
		this.x = x;
		this.y = y;
	}
}

export class Rectangle {
	/**
	 * @param {Number} width - width of the rectangle
	 * @param {Number} height - height of the rectangle
	 * @param {Number} x - x coordinate of center of rectangle
	 * @param {Number} y - y coordinate of center of rectangle
	 */
	constructor(width, height, x, y) {
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
	}
}

/**
 * @param {Circle} circle1 - First circle to compare.
 * @param {Circle} circle2 - Second circle to compare.
 * @return {boolean} True if the circles intersect. False otherwise.
 */
export function circlesOverlap(circle1, circle2) {
	const distance = Math.hypot(circle2.x - circle1.x, circle2.y - circle1.y);
	return distance < circle1.radius + circle2.radius;
}

/**
 * @param {Rectangle} rectangle
 * @param {Circle} circle
 * @return {boolean}
 */
export function rectangleAndCircleOverlap(rectangle, circle) {
	const distX = Math.abs(circle.x - rectangle.x);
	const distY = Math.abs(circle.y - rectangle.y);

	if (distX > (rectangle.width / 2 + circle.radius)) {
		return false;
	}
	if (distY > (rectangle.height / 2 + circle.radius)) {
		return false;
	}

	if (distX <= (rectangle.width / 2)) {
		return true;
	}
	if (distY <= (rectangle.height / 2)) {
		return true;
	}

	const dx = distX - rectangle.width;
	const dy = distY - rectangle.height;
	return (dx * dx + dy * dy < (circle.radius * circle.radius));
}

/**
 * @param {Rectangle} rectangle1
 * @param {Rectangle} rectangle2
 * @return {boolean}
 */
export function rectanglesOverlap(rectangle1, rectangle2) {
	const left1 = rectangle1.x - rectangle1.width / 2;
	const right1 = rectangle1.x - rectangle1.width / 2;
	const top1 = rectangle1.y - rectangle1.height / 2;
	const bottom1 = rectangle1.y - rectangle1.height / 2;

	const left2 = rectangle2.x - rectangle2.width / 2;
	const right2 = rectangle2.x - rectangle2.width / 2;
	const top2 = rectangle2.y - rectangle2.height / 2;
	const bottom2 = rectangle2.y - rectangle2.height / 2;

	return left1 < right2
		&& right1 > left2
		&& top1 < bottom2
		&& bottom1 > top2;
}