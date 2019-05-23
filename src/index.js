import "./clobber.css";
import "./prismjs/prism";
import Game from './clobber/Game';
import { generateId } from './clobber/ID';
import RandomBot from './clobber/bots/RandomBot';
import { Mushroom } from './clobber/bots/Mushroom';
import DoNothingBot from './clobber/bots/DoNothingBot';
import PotentialFieldBot from './clobber/bots/PotentialFieldBot';
import HumanBot from './clobber/bots/HumanBot';

(() => {
	const canvas = document.getElementsByClassName("game")[0];
	let game = new Game(canvas);

	const botCode = document.getElementsByClassName("bot-code")[0];

	document.getElementsByClassName("new-game")[0].addEventListener("click", () => {
		game = new Game(canvas);
	});

	document.getElementsByClassName("add-bot")[0].addEventListener("click", () => {
		const MyBot = eval(`(${botCode.innerText})`);
		const bot = new MyBot(generateId(), "my-bot", game.world.clone());
		console.log(bot.toString());
		game.addBotToGame(bot);
	});

	document.getElementsByClassName("start-game")[0].addEventListener("click", () => {
		for (let i = 0; i < 10; i++) {
			game.addBotToGame(new RandomBot(generateId(), generateId(), game.world.clone()));
		}
		for (let i = 0; i < 3; i++) {
			game.addBotToGame(new Mushroom(generateId(), "mushroom", game.world.clone()));
		}
		game.start();
	});

	document.getElementsByClassName("end-game")[0].addEventListener("click", () => {
		game.gameOver = true;
	});

	game.addBotToGame(new HumanBot(generateId(), "human", game.world.clone()));
	game.addBotToGame(new Mushroom(generateId(), "mushroom", game.world.clone()));
	game.addBotToGame(new RandomBot(generateId(), generateId(), game.world.clone()));
	game.addBotToGame(new PotentialFieldBot(generateId(), "pikachu", game.world.clone()));
	game.start();
})();
