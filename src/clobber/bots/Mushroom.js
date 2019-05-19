import BotAction, { Action, Direction } from '../BotAction';

const eighthPi = Math.PI / 8;

const mushroomPng = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4wUSAiMdsN8cPgAAAEJ0RVh0Q29tbWVudABDUkVBVE9SOiBnZC1qcGVnIHYxLjAgKHVzaW5nIElKRyBKUEVHIHY2MiksIHF1YWxpdHkgPSAxMDAKu3x3owAAAMNJREFUOMulUzEOgzAM9IWO5QOVGPuA/I29YudveQBjJT4AK3KnK4lrQqveFMydc7HOEAeqql4dAGwtWCHFqW1kHTtZx05S23z8Jy72VpItWI/LJqqqdBNy8Tp2b8H9cXPP5FADfqS2KYg1TMMscdkEAGCts8k0zIXI1uOy7UO077Zir0ZNkD8RPJs1WA5UVfPpH1n2ml/7554DFojYH7vIL4RNFgOSh8Weixnk+fayXtuHgn+0QGfLFr7ZwhoHvzaw1l+S7oHlEqbYjAAAAABJRU5ErkJggg==";

export class Mushroom {

	constructor(id, team, world) {
		this.id = id;
		this.team = team;
		this.world = world;
		this.frameCounter = 0;

		this.win = false;

		this.image = new Image();
		this.image.src = mushroomPng;

		this.botBulletThresh = (world.botRadius + world.bulletRadius) + 20;
		this.botBotThresh = 2 * world.botRadius + 10;
	}

	getId() {
		return this.id;
	}

	takeTurn(state) {
		this.frameCounter++;
		let action;
		let direction = 0;

		if (this.frameCounter % this.world.shootFrequency === 0) {
			action = Action.Shoot;
			direction = this.getShootDirection(state);
		} else {
			action = Action.Move;
			direction = this.getDodgeDirection(state);

			if (direction === null) {
				const friendlyBot = this.getClosestFriendlyBot(state);
				if (friendlyBot !== null) {
					direction = this.getAvoidBotDirection(state.myBot.point, friendlyBot.point);
				}
			}

			if (direction === null) {
				const targetBot = this.getClosestEnemyBot(state);
				if (targetBot === null) {
					this.win = true;
				}
				direction = this.getGoToBotDirection(state.myBot.point, targetBot.point);
			}
		}

		return new BotAction(action, direction);
	}

	getClosestFriendlyBot(state) {
		let closestBot = null;
		let closestDistance = Number.MAX_VALUE;
		state.bots.forEach(bot => {
			if (this.team === bot.team
				&& state.myBot.point.distance(bot.point) < 60
				&& state.myBot.point.distance(bot.point) <= closestDistance) {
				closestBot = bot;
				closestDistance = state.myBot.point.distance(bot.point);
			}
		});
		return closestBot;
	}

	getClosestEnemyBot(state) {
		let closestBot = null;
		let closestDistance = Number.MAX_VALUE;
		state.bots.forEach(bot => {
			if (this.team !== bot.team
				&& state.myBot.point.distance(bot.point) <= closestDistance) {
				closestBot = bot;
				closestDistance = state.myBot.point.distance(bot.point);
			}
		});
		return closestBot;
	}

	getAvoidBotDirection(me, bot) {
		if (bot == null) {
			return null;
		}
		let botDistance = this.botBotThresh;

		let down = me.y > Math.abs(bot.y - botDistance);
		let up = me.y < Math.abs(bot.y - botDistance);
		let right = me.x > Math.abs(bot.x - botDistance);
		let left = me.x < Math.abs(bot.x - botDistance);

		if (up && left) {
			return Direction.UpLeft;
		} else if (up && right) {
			return Direction.UpRight;
		} else if (down && left) {
			return Direction.DownLeft;
		} else if (down && right) {
			return Direction.DownRight;
		} else if (up) {
			return Direction.Up;
		} else if (down) {
			return Direction.Down;
		} else if (left) {
			return Direction.Left;
		} else if (right) {
			return Direction.Right;
		}

		return null;
	}

	getGoToBotDirection(me, bot) {
		if (bot == null) {
			return null;
		}
		let botDistance = 50;

		let up = me.y > Math.abs(bot.y - botDistance);
		let down = me.y < Math.abs(bot.y - botDistance);
		let left = me.x > Math.abs(bot.x - botDistance);
		let right = me.x < Math.abs(bot.x - botDistance);

		if (up && left) {
			return Direction.UpLeft;
		} else if (up && right) {
			return Direction.UpRight;
		} else if (down && left) {
			return Direction.DownLeft;
		} else if (down && right) {
			return Direction.DownRight;
		} else if (up) {
			return Direction.Up;
		} else if (down) {
			return Direction.Down;
		} else if (left) {
			return Direction.Left;
		} else if (right) {
			return Direction.Right;
		}

		return null;
	}

	getDodgeDirection(state) {
		let closestBullet = null;
		let closestDistance = Number.MAX_VALUE;
		let bulletDistance = 50;

		state.bullets.forEach(bullet => {
			if (state.myBot.point.distance(bullet.point) < bulletDistance
				&& state.myBot.point.distance(bullet.point) <= closestDistance
				&& this.bulletWillHit(state.myBot.point, bullet.point)) {
				closestBullet = bullet;
				closestDistance = state.myBot.point.distance(bullet.point);
			}
		});

		if (closestBullet === null) {
			return null;
		} else {
			return this.getAvoidBulletDirection(state.myBot.point, closestBullet.point);
		}
	}

	getXPlus(bullet) {
		if (bullet.direction === Direction.Left) {
			return -this.world.bulletStepDistance;
		} else {
			return this.world.bulletStepDistance;
		}
	}

	getYPlus(bullet) {
		if (bullet.direction === Direction.Up) {
			return -this.world.bulletStepDistance;
		} else {
			return this.world.bulletStepDistance;
		}
	}

	bulletWillHit(me, bullet) {
		if ((this.getXPlus(bullet) > 0 && bullet.x < me.x)
			|| (this.getXPlus(bullet) < 0 && bullet.x > me.x)
			|| (this.getYPlus(bullet) < 0 && bullet.y > me.y)
			|| (this.getYPlus(bullet) > 0 && bullet.y < me.y)) {

			if (me.distance(bullet) < this.botBulletThresh * this.world.bulletStepDistance * ((this.getXPlus(bullet) !== 0)
			&& (this.getYPlus(bullet) !== 0) ? 2 : 1)) {
				return true;
			}
		}
		return false;
	}

	getAvoidBulletDirection(me, bullet) {
		let direction = null;
		if (this.getXPlus(bullet) !== 0 && this.getYPlus(bullet) !== 0) {
			let c = ((me.x - bullet.x) * this.getXPlus(bullet) + (me.y - bullet.y) * this.getYPlus(bullet)) / (Math.pow(this.getXPlus(bullet), 2) + Math.pow(this.getYPlus(bullet), 2));
			let distance = Math.sqrt(Math.pow((me.x - bullet.x - c * this.getXPlus(bullet)), 2) + Math.pow((me.y - bullet.y - c * this.getYPlus(bullet)), 2));
			// bullet is going in this direction: \
			if (this.getXPlus(bullet) * this.getYPlus(bullet) > 0 && Math.ceil(Math.abs(distance)) <= this.botBulletThresh) {
				if (me.y - me.x - bullet.y + bullet.x >= 0) {
					direction = Direction.DownLeft;
				} else {
					direction = Direction.UpRight;
				}
			} // bullet is going in this direction: /
			else if (this.getXPlus(bullet) * this.getYPlus(bullet) <= 0 && Math.ceil(Math.abs(distance)) <= this.botBulletThresh) {
				if (me.y + me.x - bullet.y - bullet.x > 0) {
					direction = Direction.DownRight;
				} else {
					direction = Direction.UpLeft;
				}
			}
		} else {
			if (this.shouldMoveVertical(me, bullet)) {
				if (me.y < bullet.y) {
					direction = Direction.Up;
				} else {
					direction = Direction.Down;
				}
			}
			if (this.shouldMoveHorizontal(me, bullet)) {
				if (me.x < bullet.x) {
					if (direction === Direction.Up) {
						direction = Direction.UpLeft;
					} else if (direction === Direction.Down) {
						direction = Direction.DownLeft
					} else {
						direction = Direction.Left;
					}
				} else {
					if (direction === Direction.Up) {
						direction = Direction.UpRight;
					} else if (direction === Direction.Down) {
						direction = Direction.DownRight
					} else {
						direction = Direction.Right;
					}
				}
			}
		}
		return direction;
	}

	shouldMoveVertical(me, bullet) {
		let thresh = Math.abs(Math.abs(me.y - bullet.y) - this.botBulletThresh);
		return ((this.getXPlus(bullet) > 0 && bullet.x < me.x)
			|| (this.getXPlus(bullet) < 0 && bullet.x > me.x))
			&& (thresh <= this.botBulletThresh && thresh > 0);
	}

	shouldMoveHorizontal(me, bullet) {
		let thresh = Math.abs(Math.abs(me.x - bullet.x) - this.botBulletThresh);
		return ((this.getYPlus(bullet) < 0 && bullet.y > me.y)
			|| (this.getYPlus(bullet) > 0 && bullet.y < me.y))
			&& (thresh <= this.botBulletThresh && thresh > 0);
	}

	getShootDirection(state) {
		let closestBot = null;
		let closestDistance = Number.MAX_VALUE;
		state.bots.forEach(bot => {
			if (this.team !== bot.team
				&& state.myBot.point.distance(bot.point) < closestDistance) {
				closestBot = bot;
				closestDistance = state.myBot.point.distance(bot.point);
			}
		});

		if (closestBot == null) {
			return null;
		} else {
			return this.shootTargetDirection(state.myBot.point, closestBot.point);
		}
	}

	shootTargetDirection(me, target) {
		let directionX = 0;
		let directionY = 0;
		let direction = null;
		let deltaX = target.x - me.x;
		let deltaY = target.y - me.y;

		if (deltaX > 0) {
			directionX = Direction.Right;
		} else if (deltaX < 0) {
			directionX = Direction.Left;
		}

		if (deltaY > 0) {
			directionY = Direction.Down;
		} else if (deltaY < 0) {
			directionY = Direction.Up;
		}

		if (deltaX === 0) {
			direction = directionY;
		} else if (deltaY === 0) {
			direction = directionX;
		} else {
			let ratio1 = Math.abs(deltaY) / Math.abs(deltaX);
			let ratio2 = Math.abs(deltaX) / Math.abs(deltaY);
			if (ratio1 <= Math.tan(eighthPi)) {
				direction = directionX;
			} else if (ratio2 <= Math.tan(eighthPi)) {
				direction = directionY;
			} else {
				if (directionY === Direction.Up && directionX === Direction.Left) {
					direction = Direction.UpLeft;
				} else if (directionY === Direction.Up && directionX === Direction.Right) {
					direction = Direction.UpRight;
				} else if (directionY === Direction.Down && directionX === Direction.Left) {
					direction = Direction.DownLeft;
				} else if (directionY === Direction.Down && directionX === Direction.Right) {
					direction = Direction.DownRight;
				}
			}
		}
		return direction;
	}

	render(context, point) {
		context.drawImage(this.image,
			point.x - this.world.botRadius,
			point.y - this.world.botRadius,
			this.world.botRadius * 2,
			this.world.botRadius * 2);

		// context.fillStyle = "#ffff00";
		// context.beginPath();
		// context.arc(point.x, point.y, this.world.botRadius, 0, 2 * Math.PI);
		// context.fill();
		// context.fillStyle = "#000";
	}
}