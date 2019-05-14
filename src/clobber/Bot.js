import ID from './ID';
import * as images from './images';

const BOT_RADIUS = 8;
const IMAGES = [images.bird, images.duck, images.fish, images.frog, images.owl];

function getRandomImage() {
	return IMAGES[Math.floor(Math.random() * IMAGES.length)];
}

class Bot {
	constructor(name, ctx, point) {
		this.id = ID();
		this.name = name;
		this.ctx = ctx;
		this.point = point;
		this.image = new Image();
		this.image.src = getRandomImage();
	}

	getId() {
		return this.id;
	}

	move() {
		let x = this.point.x + (Math.random() < 0.5 ? -1 : 1);
		let y = this.point.y + (Math.random() < 0.5 ? -1 : 1);
		if (x < 0) {
			x = 0;
		}
		if (x >= this.ctx.canvas.width) {
			x = this.ctx.canvas.width;
		}
		if (y < 0) {
			y = 0;
		}
		if (y >= this.ctx.canvas.height) {
			y = this.ctx.canvas.height;
		}

		this.point.x = x;
		this.point.y = y;
	}

	render() {
		this.ctx.drawImage(this.image, this.point.x, this.point.y);
	}

	toString() {
		return JSON.stringify({
			id: this.id,
			name: this.name,
			point: this.point
		}, null, 4);
	}
}

export { BOT_RADIUS };
export default Bot;
