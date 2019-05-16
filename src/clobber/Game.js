import RandomBot, { BOT_RADIUS } from "./RandomBot";
import Point from './Point';
import State from './State';
import BotManager from './BotManager';
import { Action, Direction } from './BotAction';
import Bullet from './Bullet';

const MIN_START_DISTANCE = 8 * BOT_RADIUS;
const BOT_STEP_DISTANCE = 2;
const BULLET_STEP_DISTANCE = 4;
const SHOOT_FREQUENCY = 20;

const BULLET_RADIUS = 2;

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

		this.botManagers = [];
		this.bullets = [];

		this.stopGame = false;

		this.fps = 0;
		this.times = [];
	}

	start() {
		for (let i = 0; i < 10; i++) {
			this.addBotToGame(new RandomBot("wesp", this.ctx));
		}
		this.gameLoop();
	}

	getMinDistanceToBot(point) {
		return this.botManagers.reduce((min, otherBot) => Math.min(min, point.distance(otherBot)), Number.MAX_VALUE);
	}

	addBotToGame(bot) {
		let numTries = 0;
		let minDistance = 0;
		let point;
		do {
			numTries++;
			if (numTries > 1000) {
				throw new Error("Failed to find a spot to place the bot.");
			}
			point = new Point(getRandomInt(0, this.canvas.width), getRandomInt(0, this.canvas.height));
			minDistance = this.getMinDistanceToBot(point);
		} while (minDistance < MIN_START_DISTANCE);
		const botManager = new BotManager(bot, point);
		this.botManagers.push(botManager);
	}

	gameLoop() {
		if (!this.stopGame) {
			this.collectBotActions();
			this.performBotActions();
			this.updateBulletPositions();
			this.render();
			this.handleCollisions();

			requestAnimationFrame(() => {
				const now = performance.now();
				while (this.times.length > 0 && this.times[0] <= now - 1000) {
					this.times.shift();
				}
				this.times.push(now);
				this.fps = this.times.length;
				this.gameLoop();
			});
		}
	}

	collectBotActions() {
		// TODO: Add proper state. Bots should only know about the locations and identities of other bots and bullets. Bots should not be able to modify any of the world state, so we should pass in a clone of the data - is that too expensive?
		const state = new State(this.botManagers);
		this.botManagers.forEach(botManager => {
			try {
				botManager.currentAction = botManager.bot.takeTurn(state);
			} catch (err) {
				console.error(`Bot ${botManager} returned error when taking a turn.\n${err}`);
				// TODO: Delete bot
			}
		});
	}

	performBotActions() {
		this.botManagers.forEach(botManager => {
			if (botManager.shotClock + SHOOT_FREQUENCY > 0) {
				botManager.shotClock--;
			}
			const action = botManager.currentAction.action;
			const direction = botManager.currentAction.direction;

			if (action === Action.Move) {
				const point = this.getUpdatedPoint(direction, botManager.point, BOT_STEP_DISTANCE);
				if (point.x < BOT_RADIUS) {
					point.x = BOT_RADIUS;
				}
				if (point.y < BOT_RADIUS) {
					point.y = BOT_RADIUS;
				}
				if (point.x >= this.ctx.canvas.width - BOT_RADIUS) {
					point.x = this.ctx.canvas.width - BOT_RADIUS;
				}
				if (point.y >= this.ctx.canvas.height - BOT_RADIUS) {
					point.y = this.ctx.canvas.height - BOT_RADIUS;
				}
				botManager.point = point;
			} else if (action === Action.Shoot && botManager.shotClock + SHOOT_FREQUENCY === 0) {
				botManager.shotClock = 0;
				const bullet = new Bullet(
					botManager.bot.getId(),
					this.getUpdatedPoint(direction, botManager.point, BOT_RADIUS),
					direction
				);
				this.bullets.push(bullet);
			}
		});
	}

	updateBulletPositions() {
		this.bullets.forEach((bullet, index, bullets) => {
			bullet.point = this.getUpdatedPoint(bullet.direction, bullet.point, BULLET_STEP_DISTANCE);
			if (bullet.point.x <= -BULLET_RADIUS
				|| bullet.point.y <= -BULLET_RADIUS
				|| bullet.point.x >= this.ctx.canvas.width + BULLET_RADIUS
				|| bullet.point.y >= this.ctx.canvas.height + BULLET_RADIUS) {
				bullets.splice(index, 1);
			}
		});
	}

	getUpdatedPoint(direction, point, stepDistance) {
		let updatedPoint = point.clone();

		if (direction === Direction.Up) {
			updatedPoint.y -= stepDistance;
		} else if (direction === Direction.Right) {
			updatedPoint.x += stepDistance;
		} else if (direction === Direction.Down) {
			updatedPoint.y += stepDistance;
		} else if (direction === Direction.Left) {
			updatedPoint.x -= stepDistance;
		} else if (direction === Direction.UpRight) {
			updatedPoint.y -= stepDistance;
			updatedPoint.x += stepDistance;
		} else if (direction === Direction.DownRight) {
			updatedPoint.y += stepDistance;
			updatedPoint.x += stepDistance;
		} else if (direction === Direction.DownLeft) {
			updatedPoint.y += stepDistance;
			updatedPoint.x -= stepDistance;
		} else if (direction === Direction.UpLeft) {
			updatedPoint.y -= stepDistance;
			updatedPoint.x -= stepDistance;
		}

		return updatedPoint;
	}

	render() {
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.botManagers.forEach(bot => bot.render(this.ctx));
		this.bullets.forEach(bullet => bullet.render(this.ctx));
		this.renderFPS();
	}

	renderFPS() {
		this.ctx.fillStyle = "#FF00FF";
		this.ctx.font = "normal 16pt Arial";
		this.ctx.fillText(Math.round(this.fps) + " fps", 10, 26);

		this.ctx.fillStyle = "#000000";
	}

	handleCollisions() {
		this.botManagers = this.botManagers.filter(
			bot1 => !this.botManagers.some(bot2 => this.botsCollide(bot1, bot2))
		);

		this.bullets.forEach((bullet, bulletIndex, bullets) => {
			this.botManagers.forEach((botManager, botIndex, botManagers) => {
				if (botManager.bot.getId() !== bullet.owner
					&& this.botAndBulletCollide(bullet.point, botManager.point)) {
					bullets.splice(bulletIndex, 1);
					botManagers.splice(botIndex, 1);
				}
			});
		});
	}

	botAndBulletCollide(bulletPoint, botPoint) {
		const distX = Math.abs(bulletPoint.x - botPoint.x);
		const distY = Math.abs(bulletPoint.y - botPoint.y);

		if (distX > (BOT_RADIUS + BULLET_RADIUS)) {
			return false;
		}
		if (distY > (BOT_RADIUS + BULLET_RADIUS)) {
			return false;
		}

		if (distX <= (BOT_RADIUS)) {
			return true;
		}
		if (distY <= (BOT_RADIUS)) {
			return true;
		}

		const dx = distX - BOT_RADIUS;
		const dy = distY - BOT_RADIUS;
		return (dx * dx + dy * dy <= (BULLET_RADIUS * BULLET_RADIUS));
	}

	botsCollide(bot1, bot2) {
		const width = 2 * BOT_RADIUS;
		return bot1 !== bot2
			&& bot1.point.x < bot2.point.x + width
			&& bot1.point.x + width > bot2.point.x
			&& bot1.point.y < bot2.point.y + width
			&& bot1.point.y + width > bot2.point.y;
	}
}

export default Game;
