import Point from './Point';
import {Direction} from './BotAction';
import BotManager from './BotManager';
import {WorldState} from './State';

export default class Bullet {
    constructor(
        public owner: BotManager,
        public point: Point,
        public direction: Direction,
        private readonly world: WorldState
    ) {
    }

    render(context: CanvasRenderingContext2D) {
        context.fillStyle = '#00FF00';
        context.beginPath();
        context.arc(this.point.x, this.point.y, this.world.bulletRadius, 0, 2 * Math.PI);
        context.fill();

        context.fillStyle = '#000';
    }
}
