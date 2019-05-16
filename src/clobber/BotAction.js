const Action = {
	None: "None",
	Move: "Move",
	Shoot: "Shoot"
};

const Direction = {
	Up: "Up",
	Right: "Right",
	Down: "Down",
	Left: "Left",
	UpRight: "UpRight",
	DownRight: "DownRight",
	DownLeft: "DownLeft",
	UpLeft: "UpLeft"
};

class BotAction {
	constructor(action, direction) {
		this.action = action;
		this.direction = direction;
	}
}

export { Action, Direction };
export default BotAction;
