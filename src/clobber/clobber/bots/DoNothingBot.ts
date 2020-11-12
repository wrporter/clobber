import BotAction, {Action, Direction} from '../BotAction';
import {Bot} from '../BotManager';
import Point from '../Point';

export default class DoNothingBot extends Bot {
    getId(): string {
        return this.id;
    }

    takeTurn(): BotAction {
        return new BotAction(Action.None, Direction.Up);
    }

    render(context: CanvasRenderingContext2D, point: Point): void {
        context.fillStyle = '#FFFFFF';
        context.beginPath();
        context.arc(point.x, point.y, this.world.botRadius, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = '#000000';
    }

    toString(): string {
        return JSON.stringify({
            id: this.id,
        }, null, 4);
    }

    getTeamName(): string {
        return 'DoNothingBot';
    }
}
