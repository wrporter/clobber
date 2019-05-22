import BotAction, { Action, Direction } from '../BotAction';
import Point from '../Point';

/*

This is a bot based on potential field behaviors. The computations used in this bot are taken from
http://cs.boisestate.edu/~tim/potentialfields/PfieldsTutorial.pdf

 */

const imageData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH4wUWAS4U8Ynz2QAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAACySURBVDjLtVKxDQMxCDyjzwC/SAr2cRMXmSlF0mSfL36RDPCvkOLtCFtgNwkSssDHcQICAKTIKHZ/LvDMwlGOpbgGGcWiHAAwadDtseB6YUmRg8Eh+b9KUpYTNEnTSUqxkh88mbJvcD1FlraGLKLp1I+HBPvWj00Ca/pW5xZH7ZTXmari8q4z6QHDXCMAnF9vU3bJ/3+IHtjNjzYw2oJ7SCny13uHVCk4TvQA1edq5X5kH7Oacty/CglpAAAAAElFTkSuQmCC";

class FieldObject {
	/**
	 * @param point {Point} - The position of the object generating the field.
	 * @param radius {Number} - The radius of the object generating the field. Can be a goal or obstacle.
	 * @param spread {Number} - The radius around the field that applies varying strengths.
	 * @param strength {Number} - The strength of the field. Stronger when closer for repulsive fields. Stronger when farther away for attractive
	 * fields.
	 * @param tangentialModifier {Number} - Should be + or - 90 degrees or Math.PI / 2.
	 */
	constructor(point, radius, spread, strength, tangentialModifier) {
		this.point = point;
		this.radius = radius;
		this.spread = spread;
		this.strength = strength;
		this.tangentialModifer = tangentialModifier || 1;
	}
}

class PotentialFieldBot {
	constructor(id, team, world) {
		this.id = id;
		this.team = team;
		this.world = world;
		this.shotClock = 0;

		this.image = new Image();
		this.image.src = imageData;
		this.history = [];
	}

	getId() {
		return this.id;
	}

	takeTurn(state) {
		this.shotClock++;
		this.history.push(state.myBot.point);
		if (this.history.length >= 100) {
			this.history.pop();
		}

		let action = Action.None;
		let direction = null;

		const closestEnemy = this.getClosestEnemy(state);

		if (this.shotClock % this.world.shootFrequency === 0) {
			// TODO: Do we want to shoot whenever we can? What if we need to move out of the way of a bullet with this one spare turn?
			this.shotClock = 0;
			action = Action.Shoot;
			direction = this.getShootDirection(state, closestEnemy);

			return new BotAction(action, direction);
		}

		const [deltaX, deltaY] = [
			// TODO: Experiment with field strength
			// prefer the center
			this.getAttractiveField(state, new FieldObject(new Point(this.world.width / 2, this.world.height / 2), 1, 1, 1)),
			// move toward the closest enemy
			this.getAttractiveField(state, new FieldObject(closestEnemy.point, this.world.botRadius, 1, 2)),
			// avoid lethal objects
			...this.getAvoidEnemyFields(state),
			...this.getAvoidBulletFields(state),
			// avoid getting cornered
			this.getAvoidWallField(state),
			// avoid cyclic behavior
			...this.getPastBehaviorFields(state),
		].reduce((delta, current) => [delta[0] + current[0], delta[1] + current[1]]);

		direction = this.getDirection(deltaX, deltaY);

		if (direction !== null) {
			action = Action.Move;
		}

		return new BotAction(action, direction);
	}

	getShootDirection(state, enemy) {
		// TODO: Is there a way we can combine this with the getDirection function?
		const deltaX = enemy.point.x - state.myBot.point.x;
		const deltaY = state.myBot.point.y - enemy.point.y;
		const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

		if (angle >= -22 && angle < 23) {
			return Direction.Right;
		}
		if (angle >= 23 && angle < 68) {
			return Direction.UpRight;
		}
		if (angle >= 68 && angle < 113) {
			return Direction.Up;
		}
		if (angle >= 113 && angle < 158) {
			return Direction.UpLeft;
		}
		if (angle >= 158 || angle < -157) {
			return Direction.Left;
		}
		if (angle >= -157 && angle < -112) {
			return Direction.DownLeft;
		}
		if (angle >= -112 && angle < -67) {
			return Direction.Down;
		}
		if (angle >= -67 && angle < -22) {
			return Direction.DownRight;
		}
	}

	getDirection(deltaX, deltaY) {
		let direction = null;

		if (deltaY !== 0) {
			if (deltaY < 0) {
				direction = Direction.Up;
			} else {
				direction = Direction.Down;
			}
		}

		if (deltaX !== 0) {
			if (deltaX < 0) {
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

		return direction;
	}

	getClosestEnemy(state) {
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

	getAvoidEnemyFields(state) {
		return state.bots.map(bot => {
			const safeBulletDistance = 40; // TODO: calculate based on how fast I can get out of bullet speed range
			const spread = 2 * this.world.botRadius + safeBulletDistance;
			const fieldObject = new FieldObject(bot.point, this.world.botRadius, spread, 1);
			return this.getRepulsiveField(state, fieldObject);
		});
	}

	getAvoidBulletFields(state) {
		return state.bullets.map(bullet => {
			const safeBulletDistance = 40; // TODO: calculate based on how fast I can get out of bullet speed range
			const spread = 2 * this.world.bulletRadius + safeBulletDistance;
			const fieldObject = new FieldObject(bullet.point, this.world.bulletRadius, spread, 2);
			return this.getRepulsiveField(state, fieldObject);
		});
	}

	getAvoidWallField(state) {
		// TODO: Calculate a Perpendicular Field
		const distanceFromWall = this.world.botRadius * 3;
		let deltaX = 0;
		let deltaY = 0;

		if (state.myBot.point.x < distanceFromWall) {
			deltaX = distanceFromWall;
		} else if (state.myBot.point.x > this.world.width - distanceFromWall) {
			deltaX = -distanceFromWall;
		}

		if (state.myBot.point.y < distanceFromWall) {
			deltaY = distanceFromWall;
		} else if (state.myBot.point.y > this.world.width - distanceFromWall) {
			deltaY = -distanceFromWall;
		}

		return [deltaX, deltaY];
	}

	getPastBehaviorFields(state) {
		return this.history.map(point => {
			const spread = this.world.bulletRadius;
			const fieldObject = new FieldObject(point, spread, spread, 1, Math.PI / 2);
			return this.getRepulsiveField(state, fieldObject);
		});
	}

	getAttractiveField(state, field) {
		// TODO: Explore tangential field
		const distance = state.myBot.point.distance(field.point);
		const angle = Math.atan2((field.point.y - state.myBot.point.y), (field.point.x - state.myBot.point.x)) + field.tangentialModifer;

		let deltaX;
		let deltaY;

		if (distance < field.radius) {
			deltaX = 0;
			deltaY = 0;
		} else if (field.radius <= distance && distance <= field.spread + field.radius) {
			deltaX = field.strength * (distance - field.radius) * Math.cos(angle);
			deltaY = field.strength * (distance - field.radius) * Math.sin(angle);
		} else if (distance > field.spread + field.radius) {
			deltaX = field.strength * field.spread * Math.cos(angle);
			deltaY = field.strength * field.spread * Math.sin(angle);
		}

		return [deltaX, deltaY];
	}

	getRepulsiveField(state, field) {
		// TODO: Explore tangential field
		const distance = state.myBot.point.distance(field.point);
		const angle = Math.atan2((field.point.y - state.myBot.point.y), (field.point.x - state.myBot.point.x)) + field.tangentialModifer;

		let deltaX;
		let deltaY;

		if (distance < field.radius) {
			deltaX = -Math.sign(Math.cos(angle)) * Number.MAX_VALUE;
			deltaY = -Math.sign(Math.sin(angle)) * Number.MAX_VALUE;
		} else if (field.radius <= distance && distance <= field.spread + field.radius) {
			deltaX = -field.strength * (field.spread + field.radius - distance) * Math.cos(angle);
			deltaY = -field.strength * (field.spread + field.radius - distance) * Math.sin(angle);
		} else if (distance > field.spread + field.radius) {
			deltaX = 0;
			deltaY = 0;
		}

		return [deltaX, deltaY];
	}

	render(context, point) {
		// TODO: Add animations for moving in various directions and shooting
		context.drawImage(this.image,
			point.x - this.world.botRadius,
			point.y - this.world.botRadius,
			this.world.botRadius * 2,
			this.world.botRadius * 2);
	}

	toString() {
		return JSON.stringify({
			id: this.id,
			name: this.team
		}, null, 4);
	}
}

export default PotentialFieldBot;
