import * as images from './images';
import BotAction, {Action, Direction} from '../BotAction';
import {WorldState} from '../State';
import Point from '../Point';
import {Bot} from '../BotManager';

const IMAGES = [images.bird, images.duck, images.fish, images.frog, images.owl];

function getRandomImage(): string {
    return IMAGES[Math.floor(Math.random() * IMAGES.length)];
}

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}

export default class RandomBot extends Bot {
    private readonly image: HTMLImageElement;

    constructor(protected world: WorldState) {
        super(world);
        this.image = new Image();
        this.image.src = getRandomImage();
    }

    getId(): string {
        return this.id;
    }

    takeTurn(): BotAction {
        let action: Action;
        let direction: Direction;

        switch(getRandomInt(2))
        {
        case 0:
            action = Action.Move;
            break;
        case 1:
            action = Action.Shoot;
            break;
        default:
            action = Action.None;
        }

        switch(getRandomInt(7))
        {
        case 0:
            direction = Direction.Up;
            break;
        case 1:
            direction = Direction.Down;
            break;
        case 2:
            direction = Direction.Left;
            break;
        case 3:
            direction = Direction.Right;
            break;
        case 4:
            direction = Direction.UpLeft;
            break;
        case 5:
            direction = Direction.UpRight;
            break;
        case 6:
            direction = Direction.DownRight;
            break;
        default:
            direction = Direction.None;
        }

        return new BotAction(action, direction);
    }

    render(context: CanvasRenderingContext2D, point: Point): void {
        // TODO: Don't allow bots to draw outside their allotted 16x16 space.

        context.drawImage(this.image, point.x - this.world.botRadius, point.y - this.world.botRadius, this.world.botRadius * 2, this.world.botRadius * 2);
    }

    public getTeamName(): string {
        return 'RandomBot';
    }

    toString(): string {
        return JSON.stringify({
            id: this.id,
        }, null, 4);
    }
}
