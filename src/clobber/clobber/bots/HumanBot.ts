import BotAction, {Action, Direction} from '../BotAction';
import Point from '../Point';
import {WorldState} from '../State';
import {Bot} from '../BotManager';

/*
This bot can be controlled by a human. Use the arrow keys to move and the the E (up), D (down), S (left), and F (right) keys to shoot in the provided
direction.
 */

const KeyCodes = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyE', 'KeyD', 'KeyS', 'KeyF'];

export default class HumanBot extends Bot {
    private shotClock: number;
    private readonly keys: { [key: string]: boolean };

    constructor(protected id: string, protected team: string, protected world: WorldState) {
        super(id, team, world);
        this.shotClock = 0;
        this.keys = {};

        document.addEventListener('keydown', (event) => this.captureKey(event));
        document.addEventListener('keyup', (event) => this.releaseKey(event));
    }

    private captureKey(event: KeyboardEvent): void {
        if (KeyCodes.indexOf(event.code) > -1) {
            event.preventDefault();
        }
        this.keys[event.code] = true;
    }

    private releaseKey(event: KeyboardEvent): void {
        if (KeyCodes.indexOf(event.code) > -1) {
            event.preventDefault();
        }
        this.keys[event.code] = false;
    }

    getId(): string {
        return this.id;
    }

    takeTurn(): BotAction {
        this.shotClock++;
        let action = Action.None;
        let shootDirection = Direction.None;

        if (this.keys['KeyE']) {
            shootDirection = Direction.Up;
            if (this.keys['KeyF']) {
                shootDirection = Direction.UpRight;
            } else if (this.keys['KeyS']) {
                shootDirection = Direction.UpLeft;
            }
        } else if (this.keys['KeyD']) {
            shootDirection = Direction.Down;
            if (this.keys['KeyF']) {
                shootDirection = Direction.DownRight;
            } else if (this.keys['KeyS']) {
                shootDirection = Direction.DownLeft;
            }
        } else if (this.keys['KeyF']) {
            shootDirection = Direction.Right;
        } else if (this.keys['KeyS']) {
            shootDirection = Direction.Left;
        }

        if (shootDirection !== undefined) {
            if (this.shotClock % this.world.shootFrequency === 0) {
                this.shotClock = 0;
                return new BotAction(Action.Shoot, shootDirection);
            }
        }

        let moveDirection = Direction.None;

        if (this.keys['ArrowUp']) {
            moveDirection = Direction.Up;
            if (this.keys['ArrowRight']) {
                moveDirection = Direction.UpRight;
            } else if (this.keys['ArrowLeft']) {
                moveDirection = Direction.UpLeft;
            }
        } else if (this.keys['ArrowDown']) {
            moveDirection = Direction.Down;
            if (this.keys['ArrowRight']) {
                moveDirection = Direction.DownRight;
            } else if (this.keys['ArrowLeft']) {
                moveDirection = Direction.DownLeft;
            }
        } else if (this.keys['ArrowRight']) {
            moveDirection = Direction.Right;
        } else if (this.keys['ArrowLeft']) {
            moveDirection = Direction.Left;
        }

        if (action === Action.None && moveDirection !== undefined) {
            action = Action.Move;
        }

        return new BotAction(action, moveDirection);
    }

    render(context: CanvasRenderingContext2D, point: Point): void {
        context.fillStyle = '#FFFF00';
        context.beginPath();
        context.arc(point.x, point.y, this.world.botRadius, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = '#000000';
    }

    toString(): string {
        return JSON.stringify({
            id: this.id,
            name: this.team
        }, null, 4);
    }
}
