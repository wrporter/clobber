export enum Action {
    None = 'None',
    Move = 'Move',
    Shoot = 'Shoot'
}

export enum Direction {
    None = 'None',
    Up = 'Up',
    Right = 'Right',
    Down = 'Down',
    Left = 'Left',
    UpRight = 'UpRight',
    DownRight = 'DownRight',
    DownLeft = 'DownLeft',
    UpLeft = 'UpLeft'
}

export default class BotAction {
    constructor(public readonly action: Action, public readonly direction: Direction) {
        this.action = action;
        this.direction = direction;
    }
}
