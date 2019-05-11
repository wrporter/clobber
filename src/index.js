import "./clobber.css";
import Game from "./clobber/Game";

(() => {
	const canvas = document.getElementsByClassName("game")[0];
	const game = new Game(canvas);
	game.start();
})();
