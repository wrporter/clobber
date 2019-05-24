export const Action = {
    None: "None",
    Move: "Move",
    Shoot: "Shoot"
};

export const Direction = {
    Up: "Up",
    Right: "Right",
    Down: "Down",
    Left: "Left",
    UpRight: "UpRight",
    DownRight: "DownRight",
    DownLeft: "DownLeft",
    UpLeft: "UpLeft"
};

export default class BotAction {
    constructor(action, direction) {
        this.action = action;
        this.direction = direction;
    }
}
