export default class State {
    /**
	 * @param myBot {BotState}
	 * @param bots {BotState[]}
	 * @param myBullets {BulletState[]}
	 * @param bullets {BulletState[]}
	 */
    constructor(myBot, bots, myBullets, bullets) {
        this.myBot = myBot;
        this.bots = bots;
        this.myBullets = myBullets;
        this.bullets = bullets;
    }

    toString() {
        return JSON.stringify(this);
    }
}

export class BotState {
    /**
	 * @param id {String}
	 * @param team {String}
	 * @param point {Point}
	 */
    constructor(id, team, point) {
        this.id = id;
        this.team = team;
        this.point = point;
    }

    toString() {
        return JSON.stringify(this);
    }
}

export class BulletState {
    /**
	 * @param point {Point}
	 * @param direction {Direction}
	 */
    constructor(point, direction) {
        this.point = point;
        this.direction = direction;
    }

    toString() {
        return JSON.stringify(this);
    }
}

export class WorldState {
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

    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}
