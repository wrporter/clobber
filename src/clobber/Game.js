import RandomBot from "./bots/RandomBot";
import Point from './Point';
import State, { BotState, BulletState, WorldState } from './State';
import BotManager from './BotManager';
import { Action, Direction } from './BotAction';
import Bullet from './Bullet';
import { generateId } from './ID';

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Game {
	constructor(canvas) {
		this.world = new WorldState();

		this.canvas = canvas;
		this.canvas.width = this.world.width;
		this.canvas.height = this.world.height;
		this.ctx = canvas.getContext("2d");

		this.botManagers = [];
		this.bullets = [];

		this.stopGame = false;

		this.fps = 0;
		this.times = [];
	}

	start() {
		for (let i = 0; i < 10; i++) {
			this.addBotToGame(new RandomBot(generateId(), "wesp", this.world.clone()));
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
		} while (minDistance < this.world.minStartDistance);
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
		this.botManagers.forEach((botManager, index, botManagers) => {
			const state = this.generateState(botManager);
			try {
				botManager.currentAction = botManager.bot.takeTurn(state);
			} catch (err) {
				console.error(`Bot ${botManager} returned error when taking a turn.\n${err}`);
				// TODO: Fix all the places I'm removing items in a forEach. This won't work for consecutive items that need to be removed. It will work if we use a regular loop and start from the end of the array and go backwards.
				botManagers.splice(index, 1);
			}
		});
	}

	generateState(botManager) {
		const myBot = new BotState(
			this.cloneString(botManager.bot.getId()),
			this.cloneString(botManager.bot.team),
			botManager.point.clone());

		const bots = this.botManagers
			.filter(bm => bm.bot.getId() !== botManager.bot.getId())
			.map(bm => new BotState(
				this.cloneString(bm.bot.getId()),
				this.cloneString(bm.bot.team),
				bm.point.clone()));

		const myBullets = this.bullets
			.filter(bullet => bullet.ownerId === botManager.bot.getId())
			.map(bullet => new BulletState(bullet.point.clone(), this.cloneString(bullet.direction)));

		const bullets = this.bullets
			.filter(bullet => bullet.ownerId !== botManager.bot.getId())
			.map(bullet => new BulletState(bullet.point.clone(), this.cloneString(bullet.direction)));

		return new State(myBot, bots, myBullets, bullets);
	}

	cloneString(str) {
		return (' ' + str).slice(1);
	}

	performBotActions() {
		this.botManagers.forEach(botManager => {
			if (botManager.shotClock + this.world.shootFrequency > 0) {
				botManager.shotClock--;
			}
			const action = botManager.currentAction.action;
			const direction = botManager.currentAction.direction;

			if (action === Action.Move) {
				const point = this.getUpdatedPoint(direction, botManager.point, this.world.botStepDistance);
				if (point.x < this.world.botRadius) {
					point.x = this.world.botRadius;
				}
				if (point.y < this.world.botRadius) {
					point.y = this.world.botRadius;
				}
				if (point.x >= this.ctx.canvas.width - this.world.botRadius) {
					point.x = this.ctx.canvas.width - this.world.botRadius;
				}
				if (point.y >= this.ctx.canvas.height - this.world.botRadius) {
					point.y = this.ctx.canvas.height - this.world.botRadius;
				}
				botManager.point = point;
			} else if (action === Action.Shoot && botManager.shotClock + this.world.shootFrequency === 0) {
				botManager.shotClock = 0;
				const bullet = new Bullet(
					botManager.bot.getId(),
					this.getUpdatedPoint(direction, botManager.point, this.world.botRadius),
					direction,
					this.world.clone()
				);
				this.bullets.push(bullet);
			}
		});
	}

	updateBulletPositions() {
		this.bullets.forEach((bullet, index, bullets) => {
			bullet.point = this.getUpdatedPoint(bullet.direction, bullet.point, this.world.bulletStepDistance);
			if (bullet.point.x <= -this.world.bulletRadius
				|| bullet.point.y <= -this.world.bulletRadius
				|| bullet.point.x >= this.ctx.canvas.width + this.world.bulletRadius
				|| bullet.point.y >= this.ctx.canvas.height + this.world.bulletRadius) {
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
		this.ctx.font = "normal 12pt Arial";
		this.ctx.fillText(Math.round(this.fps) + " fps", 4, 18);

		this.ctx.fillStyle = "#000000";
	}

	handleCollisions() {
		this.botManagers = this.botManagers.filter(
			bot1 => !this.botManagers.some(bot2 => this.botsCollide(bot1, bot2))
		);

		this.bullets.forEach((bullet, bulletIndex, bullets) => {
			this.botManagers.forEach((botManager, botIndex, botManagers) => {
				if (botManager.bot.getId() !== bullet.ownerId
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

		if (distX > (this.world.botRadius + this.world.bulletRadius)) {
			return false;
		}
		if (distY > (this.world.botRadius + this.world.bulletRadius)) {
			return false;
		}

		if (distX <= (this.world.botRadius)) {
			return true;
		}
		if (distY <= (this.world.botRadius)) {
			return true;
		}

		const dx = distX - this.world.botRadius;
		const dy = distY - this.world.botRadius;
		return (dx * dx + dy * dy <= (this.world.bulletRadius * this.world.bulletRadius));
	}

	botsCollide(bot1, bot2) {
		const width = 2 * this.world.botRadius;
		return bot1 !== bot2
			&& bot1.point.x < bot2.point.x + width
			&& bot1.point.x + width > bot2.point.x
			&& bot1.point.y < bot2.point.y + width
			&& bot1.point.y + width > bot2.point.y;
	}
}

export default Game;
