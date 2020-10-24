export class Circle {
    public radius: number;
    public x: number;
    public y: number;

    constructor(radius: number, x: number, y: number) {
        this.radius = radius;
        this.x = x;
        this.y = y;
    }
}

export class Rectangle {
    public width: number;
    public height: number;
    public x: number;
    public y: number;

    constructor(width: number, height: number, x: number, y: number) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }
}

export function circlesOverlap(circle1: Circle, circle2: Circle): boolean {
    const distance = Math.hypot(circle2.x - circle1.x, circle2.y - circle1.y);
    return distance < circle1.radius + circle2.radius;
}

export function rectangleAndCircleOverlap(rectangle: Rectangle, circle: Circle): boolean {
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

export function rectanglesOverlap(rectangle1: Rectangle, rectangle2: Rectangle): boolean {
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