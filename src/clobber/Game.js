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
		this.deadBots = [];
		this.bullets = [];

		this.gameOver = false;

		this.fps = 0;
		this.times = [];
	}

	start() {
		for (let i = 0; i < 10; i++) {
			this.addBotToGame(new RandomBot(generateId(), generateId(), this.world.clone()));
		}

		// TODO: This is done to allow images to load. Fix this?
		setTimeout(() => this.gameLoop(), 10);
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
		if (this.gameOver) {
			this.renderGameOver();
		} else {
			this.collectBotActions();
			this.performBotActions();
			this.updateBulletPositions();
			this.render();
			this.handleCollisions();
			this.checkGameOver();

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

	checkGameOver() {
		if (this.botManagers.every((bm, i, managers) => bm.bot.team === managers[0].bot.team)) {
			this.gameOver = true;
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
				botManager.dead = true;
				this.deadBots.push(botManager);
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
			.filter(bullet => bullet.owner.bot.getId() === botManager.bot.getId())
			.map(bullet => new BulletState(bullet.point.clone(), this.cloneString(bullet.direction)));

		const bullets = this.bullets
			.filter(bullet => bullet.owner.bot.getId() !== botManager.bot.getId())
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
					botManager,
					// TODO: Fix bullet starting position. Should start from the edge of the bot. It doesn't render that way because the bullet positions are updated once before getting rendered.
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

	clearScreen() {
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	render() {
		this.clearScreen();
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

	renderGameOver() {
		this.clearScreen();
		this.ctx.fillStyle = "#0000FF";
		this.ctx.font = "normal 12pt Arial";
		this.ctx.textBaseline = "middle";

		let x = 12;
		let y = 20;

		this.ctx.fillText("Scoreboard", x, y);

		y += 20;

		this.ctx.fillStyle = "#00FF00";
		this.ctx.fillText("Bot", x, y);
		this.ctx.fillText("Score", x + 150, y);
		this.ctx.fillText("Kills", x + 225, y);
		this.ctx.fillText("Survive", x + 300, y);

		y += 20;

		this.botManagers.concat(this.deadBots)
			.map(bm => {
				bm.score = Object.keys(bm.kills).length * this.world.killPoints
					+ (!bm.dead ? this.world.survivePoints : 0);
				return bm;
			}).sort((bm1, bm2) => {
				return bm2.score - bm1.score;
			}
		).forEach(bm => {
			// TODO: Bots that are larger than 16x16 based on world config do not render well here. Need to account for bot size here.
			let colX = x + this.world.botRadius;
			bm.bot.render(this.ctx, new Point(colX, y));

			colX += this.world.botRadius + 8;
			this.ctx.fillStyle = "#FF0000";
			const winnerId = bm.bot.getId();
			this.ctx.fillText(winnerId, colX, y);

			colX = x + 150;
			this.ctx.fillStyle = "#FFFF00";
			this.ctx.fillText(bm.score, colX, y);

			colX = x + 225;
			this.ctx.fillStyle = "#FFFF00";
			this.ctx.fillText(Object.keys(bm.kills).length, colX, y);

			colX = x + 300;
			this.ctx.fillStyle = "#FFFF00";
			this.ctx.fillText(bm.dead ? 0 : 1, colX, y);

			y += 20;
		});
	}

	handleCollisions() {
		this.botManagers = this.botManagers.filter(
			bm1 => !this.botManagers.some(bm2 => {
				const collide = this.botsCollide(bm1, bm2);

				if (collide) {
					this.deadBots.push(bm1, bm2);
					bm1.dead = true;
					bm2.dead = true;
					// TODO: Can push more dead bots if more than 2 collide at a time. Clean up the lame way of doing this. Probably just use a Set to begin with.
					this.deadBots = [...new Set(this.deadBots)];
					this.addBotCollideKill(bm1.bot.getId(), bm2.bot.getId());
					this.addBotCollideKill(bm2.bot.getId(), bm1.bot.getId());
				}

				return collide;
			})
		);

		this.bullets.forEach((bullet, bulletIndex, bullets) => {
			this.botManagers.forEach((botManager, botIndex, botManagers) => {
				if (botManager.bot.getId() !== bullet.owner.bot.getId()
					&& this.botAndBulletCollide(bullet.point, botManager.point)) {

					botManager.dead = true;
					this.deadBots.push(botManager);
					this.addBulletKill(bullet.owner.bot.getId(), botManager.bot.getId());

					bullets.splice(bulletIndex, 1);
					botManagers.splice(botIndex, 1);
				}
			});
		});
	}

	addBotCollideKill(killerId, killedId) {
		this.botManagers
			.find(bm => bm.bot.getId() === killerId)
			.kills[killedId] = true;
	}

	addBulletKill(killerId, killedId) {
		let bot = this.botManagers
			.find(bm => bm.bot.getId() === killerId);
		if (!bot) {
			bot = this.deadBots.find(bm => bm.bot.getId() === killerId);
		}
		bot.kills[killedId] = true;
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
