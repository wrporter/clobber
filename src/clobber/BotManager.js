class BotManager {
    constructor(bot, point) {
        this.bot = bot;
        this.point = point;
        this.kills = [];
        this.dead = false;
        this.currentAction = null;
        this.shotClock = 0;
        this.score = 0;
    }

    render(context) {
        this.bot.render(context, this.point);
    }

    toString() {
        return JSON.stringify({
            bot: this.bot,
            point: this.point,
            kills: this.kills,
            dead: this.dead
        }, null, 4);
    }
}

export default BotManager;
