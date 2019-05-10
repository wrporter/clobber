import "./clobber.css"

(() => {
	function Game(canvas) {
		const ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.arc(95, 50, 40, 0, 2 * Math.PI);
		ctx.stroke();
	}

	const canvas = document.getElementsByClassName("game")[0];
	Game(canvas)
})();
