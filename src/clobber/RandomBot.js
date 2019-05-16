import ID from './ID';
import * as images from './images';
import BotAction, { Action, Direction } from './BotAction';

const BOT_RADIUS = 8;
const IMAGES = [images.bird, images.duck, images.fish, images.frog, images.owl];

function getRandomImage() {
	return IMAGES[Math.floor(Math.random() * IMAGES.length)];
}

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

class RandomBot {
	constructor(name) {
		this.id = ID();
		this.name = name;
		this.image = new Image();
		this.image.src = getRandomImage();
	}

	getId() {
		return this.id;
	}

	takeTurn(state) {
		let action = Action.None;
		let direction = Direction.Up;

		switch(getRandomInt(2))
		{
			case 0:
				action = Action.Move;
				break;
			case 1:
				action = Action.Shoot;
				break;
			default:
				action = Action.None;
		}

		switch(getRandomInt(8))
		{
			case 0:
				direction = Direction.Up;
				break;
			case 1:
				direction = Direction.Down;
				break;
			case 2:
				direction = Direction.Left;
				break;
			case 3:
				direction = Direction.Right;
				break;
			case 4:
				direction = Direction.UpLeft;
				break;
			case 5:
				direction = Direction.UpRight;
				break;
			case 6:
				direction = Direction.DownRight;
				break;
			default:
				direction = Direction.DownLeft;
		}

		return new BotAction(action, direction);
	}

	render(context, point) {
		// context.fillStyle = "#ffff00";
		// context.fillRect(point.x - BOT_RADIUS, point.y - BOT_RADIUS, 2 * BOT_RADIUS, 2 * BOT_RADIUS);

		context.drawImage(this.image, point.x - BOT_RADIUS, point.y - BOT_RADIUS);

		// context.fillStyle = "#FF00FF";
		// context.font = "normal 8pt Arial";
		// context.fillText(this.id, point.x - BOT_RADIUS, point.y - BOT_RADIUS);

		// context.fillStyle = "#000";
	}

	toString() {
		return JSON.stringify({
			id: this.id,
			name: this.name
		}, null, 4);
	}
}

export { BOT_RADIUS };
export default RandomBot;
