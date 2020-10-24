export default class Point {
    public x: number;
    public y: number

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    distance(point: Point) {
        return Math.hypot(point.x - this.x, point.y - this.y);
    }

    clone() {
        return new Point(this.x, this.y);
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
}
