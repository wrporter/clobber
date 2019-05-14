import Bot, { BOT_RADIUS } from "./Bot";
import Point from './Point';

const MIN_START_DISTANCE = 8 * BOT_RADIUS;

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Game {
	constructor(canvas) {
		this.canvas = canvas;
		this.canvas.width = 400;
		this.canvas.height = 400;
		this.ctx = canvas.getContext("2d");

		this.bots = [];
		this.fps = 0;
		this.fpsUpdateInterval = 0;
		this.lastCalledTime = null;
		this.stopGame = false;
	}

	start() {
		for (let i = 0; i < 20; i++) {
			this.addBotToGame(new Bot("wesp", this.ctx));
		}
		setInterval(() => this.update(), 10);
	}

	getMinDistanceToBot(bot) {
		return this.bots.reduce((min, otherBot) => Math.min(min, bot.point.distance(otherBot)), Number.MAX_VALUE);
	}

	addBotToGame(bot) {
		let numTries = 0;
		let minDistance = 0;
		do {
			numTries++;
			if (numTries > 1000) {
				throw new Error("Failed to find a spot to place the bot.");
			}
			bot.point = new Point(getRandomInt(0, this.canvas.width), getRandomInt(0, this.canvas.height));
			minDistance = this.getMinDistanceToBot(bot);
		} while (minDistance < MIN_START_DISTANCE);
		this.bots.push(bot);
	}

	update() {
		if (!this.stopGame) {
			this.updatePositions();
			this.render();
			this.handleCollisions();
			this.requestAnimFrame();
		}
	}

	updatePositions() {
		this.bots.forEach(bot => bot.move());
	}

	render() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.bots.forEach(bot => bot.render());
		this.renderFPS();
	}

	renderFPS() {
		this.ctx.fillStyle = "#FF00FF";
		this.ctx.font = "normal 16pt Arial";
		this.ctx.fillText(Math.round(this.fps) + " fps", 10, 26);

		this.ctx.fillStyle = "#000000";
	}

	requestAnimFrame() {
		if (!this.lastCalledTime) {
			this.lastCalledTime = Date.now();
			this.fps = 0;
			return;
		}
		if (this.fpsUpdateInterval % 10 === 0) {
			const delta = (Date.now() - this.lastCalledTime) / 1000;
			this.lastCalledTime = Date.now();
			this.fps = 1 / delta;
		}
		this.fpsUpdateInterval++;
	}

	handleCollisions() {

		this.bots = this.bots.filter(bot1 => !this.bots.some(bot2 => {
				const collide = bot1 !== bot2 &&
					this.botsCollide(bot1, bot2);

				if (collide) {
					console.log(`Bots collided. Bot1: ${bot1}, Bot2: ${bot2}`);
				}

				return collide;
			})
		);
	}

	botsCollide(bot1, bot2) {
		const width = 2 * BOT_RADIUS;
		return bot1.point.x < bot2.point.x + width
			&& bot1.point.x + width > bot2.point.x
			&& bot1.point.y < bot2.point.y + width
			&& bot1.point.y + width > bot2.point.y;
	}
}

export default Game;
