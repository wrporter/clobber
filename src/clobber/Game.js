import Bot from "./Bot";

class Game {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	render() {
		this.ctx.beginPath();
		this.ctx.arc(95, 50, 40, 0, 2 * Math.PI);
		this.ctx.stroke();
	}

	start() {
		const bot = new Bot("wesp");
		console.log(bot.getId());
		this.render();
	}
}

export default Game;
