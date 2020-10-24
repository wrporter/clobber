import Point from './Point';
import BotAction, {Action, Direction} from './BotAction';
import State, {WorldState} from './State';
import {generateId} from './ID';

export abstract class Bot {
    constructor(protected id: string, protected team: string, protected world: WorldState) {
    }

    public abstract takeTurn(state: State): BotAction;

    public abstract render(context: CanvasRenderingContext2D, point: Point): void;

    public toString(): string {
        return this.id;
    }
}

class BotManager {
    public id: string;
    public team: string;
    public bot: Bot;
    public point: Point;
    public kills: { [key: string]: boolean };
    public dead: boolean;
    public currentAction: BotAction;
    public shotClock: number;
    public score: number;

    constructor(bot: Bot, team: string, point: Point) {
        this.id = generateId();
        this.currentAction = new BotAction(Action.None, Direction.None)
        this.bot = bot;
        this.team = team;
        this.point = point;
        this.kills = {};
        this.dead = false;
        this.shotClock = 0;
        this.score = 0;
    }

    render(context: CanvasRenderingContext2D) {
        this.bot.render(context, this.point);
    }

    toString() {
        return JSON.stringify({
            bot: this.bot,
            point: this.point,
            kills: this.kills,
            dead: this.dead
        }, null, 4);
    }
}

export default BotManager;
