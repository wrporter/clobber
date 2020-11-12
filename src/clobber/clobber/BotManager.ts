import Point from './Point';
import BotAction, {Action, Direction} from './BotAction';
import State, {WorldState} from './State';
import {generateId} from './ID';

export abstract class Bot {
    protected id: string;
    protected teammates: Set<string>;

    constructor(protected world: WorldState) {
        this.id = '';
        this.teammates = new Set();
    }

    public setId(id: string): void {
        this.id = id;
    }

    public getId(): string {
        return this.id;
    }

    public registerTeammate(id: string): void {
        this.teammates.add(id);
    }

    public abstract takeTurn(state: State): BotAction;

    /**
     *
     * @param context
     * @param point
     */
    public render(context: CanvasRenderingContext2D, point: Point): void {
        context.fillStyle = '#FF0000';
        context.beginPath();
        context.arc(point.x, point.y, this.world.botRadius, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = '#000000';
    }

    public abstract getTeamName(): string;
}

class BotManager {
    public id: string;
    public bot: Bot;
    public point: Point;
    public kills: { [key: string]: boolean };
    public dead: boolean;
    public currentAction: BotAction;
    public shotClock: number;
    public score: number;

    constructor(bot: Bot, point: Point) {
        this.id = generateId();
        this.currentAction = new BotAction(Action.None, Direction.None)
        this.bot = bot;
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
