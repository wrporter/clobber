import BotAction, { Action, Direction } from '../BotAction';

class DoNothingBot {
    constructor(id, team, world) {
        this.id = id;
        this.team = team;
        this.world = world;
    }

    getId() {
        return this.id;
    }

    takeTurn() {
        return new BotAction(Action.None, Direction.Up);
    }

    render(context, point) {
        context.fillStyle = '#FFFFFF';
        context.beginPath();
        context.arc(point.x, point.y, this.world.botRadius, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = '#000000';
    }

    toString() {
        return JSON.stringify({
            id: this.id,
            name: this.team
        }, null, 4);
    }
}

export default DoNothingBot;
