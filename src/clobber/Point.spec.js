import Point from "./Point";

describe("Point", () => {
    describe("constructor", () => {
        it("sets x", () => {
            const point = new Point(3, 5);
            expect(point.x).toEqual(3);
        });

        it("sets y", () => {
            const point = new Point(3, 5);
            expect(point.x).toEqual(3);
        });
    });

    describe("distance", () => {
        const tests = [
            {x1: 3, y1: 5, x2: 8, y2: 8, distance: 5.8309518948453},
            {x1: 2, y1: 2, x2: 4, y2: 4, distance: 2.8284271247461903},
            {x1: 0, y1: 2, x2: 0, y2: 4, distance: 2},
            {x1: 0, y1: -2, x2: 0, y2: -4, distance: 2},
            {x1: 2, y1: 0, x2: 4, y2: 0, distance: 2},
            {x1: -2, y1: 0, x2: -4, y2: 0, distance: 2},
        ];

        tests.forEach(test => {
            const point1 = new Point(test.x1, test.y1);
            const point2 = new Point(test.x2, test.y2);
            expect(point1.distance(point2)).toEqual(test.distance);
            expect(point2.distance(point1)).toEqual(test.distance);
        });
    });

    describe("clone", () => {
        it("returns a deep copy", () => {
            const point = new Point(0, 2);
            const clone = point.clone();
            expect(clone).toEqual(point);

            clone.x = -5;
            expect(clone.x).toEqual(-5);
            expect(point.x).toEqual(0);
        });
    });

    describe("toString", () => {
        it("returns a string representation of a point", () => {
            const point = new Point(1, 2);
            expect(point.toString()).toEqual("(1, 2)");
        });
    });
});
