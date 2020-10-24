import Point from './Point';
import {Direction} from './BotAction';

export default class State {
    constructor(
        public readonly myBot: BotState,
        public readonly bots: BotState[],
        public readonly myBullets: BulletState[],
        public readonly bullets: BulletState[]
    ) {
    }

    toString(): string {
        return JSON.stringify(this);
    }
}

export class BotState {
    constructor(
        public readonly id: string,
        public readonly team: string,
        public readonly point: Point
    ) {
    }

    toString(): string {
        return JSON.stringify(this);
    }
}

export class BulletState {
    constructor(
        public readonly point: Point,
        public readonly direction: Direction
    ) {
    }

    toString(): string {
        return JSON.stringify(this);
    }
}

export class WorldState {
    public readonly width: number;
    public readonly height: number;
    public readonly botRadius: number;
    public readonly bulletRadius: number;
    public readonly botStepDistance: number;
    public readonly bulletStepDistance: number;
    public readonly shootFrequency: number;
    public readonly minStartDistance: number;
    public readonly killPoints: number;
    public readonly survivePoints: number;

    constructor() {
        this.width = 800;
        this.height = 800;

        this.botRadius = 8;
        this.bulletRadius = 2;

        this.botStepDistance = 2;
        this.bulletStepDistance = 4;

        this.shootFrequency = 20;

        this.minStartDistance = 4 * this.botRadius;

        this.killPoints = 10;
        this.survivePoints = 40;
    }

    clone(): WorldState {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}
