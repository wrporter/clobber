export default class State {
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
		this.width = 400;
		this.height = 400;

		this.botRadius = 8;
		this.bulletRadius = 2;

		this.botStepDistance = 2;
		this.bulletStepDistance = 4;

		this.shootFrequency = 20;

		this.minStartDistance = 8 * this.botRadius;

		this.killPoints = 10;
		this.survivePoints = 40;
	}

	clone() {
		return Object.assign(Object.create(Object.getPrototypeOf(this)), this)
	}
}
