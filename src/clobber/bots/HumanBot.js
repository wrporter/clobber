import BotAction, { Action, Direction } from '../BotAction';

/*
This bot can be controlled by a human. Use the arrow keys to move and the the E (up), D (down), S (left), and F (right) keys to shoot in the provided
direction.
 */

const KEY_CODES = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyE", "KeyD", "KeyS", "KeyF"];

class HumanBot {
	constructor(id, team, world) {
		this.id = id;
		this.team = team;
		this.world = world;
		this.shotClock = 0;

		this.keys = {};

		document.addEventListener('keydown', (event) => this.captureKey(event));
		document.addEventListener('keyup', (event) => this.releaseKey(event));
	}

	captureKey(event) {
		if(KEY_CODES.indexOf(event.code) > -1) {
			event.preventDefault();
		}
		this.keys[event.code] = true;
	}

	releaseKey(event) {
		if(KEY_CODES.indexOf(event.code) > -1) {
			event.preventDefault();
		}
		this.keys[event.code] = false;
	}

	getId() {
		return this.id;
	}

	takeTurn(state) {
		this.shotClock++;
		let action = Action.None;
		let direction = null;

		if (this.keys["KeyE"]) {
			direction = Direction.Up;
			if (this.keys["KeyF"]) {
				direction = Direction.UpRight;
			} else if (this.keys["KeyS"]) {
				direction = Direction.UpLeft;
			}
		} else if (this.keys["KeyD"]) {
			direction = Direction.Down;
			if (this.keys["KeyF"]) {
				direction = Direction.DownRight;
			} else if (this.keys["KeyS"]) {
				direction = Direction.DownLeft;
			}
		} else if (this.keys["KeyF"]) {
			direction = Direction.Right;
		} else if (this.keys["KeyS"]) {
			direction = Direction.Left;
		}

		if (direction !== null && this.shotClock % this.world.shootFrequency === 0) {
			this.shotClock = 0;
			return new BotAction(Action.Shoot, direction);
		}

		if (this.keys["ArrowUp"]) {
			direction = Direction.Up;
			if (this.keys["ArrowRight"]) {
				direction = Direction.UpRight;
			} else if (this.keys["ArrowLeft"]) {
				direction = Direction.UpLeft;
			}
		} else if (this.keys["ArrowDown"]) {
			direction = Direction.Down;
			if (this.keys["ArrowRight"]) {
				direction = Direction.DownRight;
			} else if (this.keys["ArrowLeft"]) {
				direction = Direction.DownLeft;
			}
		} else if (this.keys["ArrowRight"]) {
			direction = Direction.Right;
		} else if (this.keys["ArrowLeft"]) {
			direction = Direction.Left;
		}

		if (action === Action.None && direction !== null) {
			action = Action.Move;
		}

		return new BotAction(action, direction);
	}

	render(context, point) {
		context.fillStyle = "#ffff00";
		context.beginPath();
		context.arc(point.x, point.y, this.world.botRadius, 0, 2 * Math.PI);
		context.fill();
		context.fillStyle = "#000";
	}

	toString() {
		return JSON.stringify({
			id: this.id,
			name: this.team
		}, null, 4);
	}
}

export default HumanBot;
