import Point from "./Point";

export default class GameRenderer {
    constructor(canvas, world) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.world = world;
    }

    clearScreen() {
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render(botManagers, bullets) {
        this.clearScreen();
        botManagers.forEach(bot => bot.render(this.context));
        bullets.forEach(bullet => bullet.render(this.context));
    }

    renderFPS(fps) {
        this.context.fillStyle = "#FF00FF";
        this.context.font = "normal 12pt Arial";
        this.context.fillText(Math.round(fps) + " fps", 4, 18);

        this.context.fillStyle = "#000000";
    }

    renderGameOver(botManagers, deadBots) {
        this.clearScreen();
        this.context.fillStyle = "#0000FF";
        this.context.font = "normal 12pt Arial";
        this.context.textBaseline = "middle";

        let x = 12;
        let y = 20;

        this.context.fillText("Scoreboard", x, y);

        y += 20;

        this.context.fillStyle = "#00FF00";
        this.context.fillText("Bot", x, y);
        this.context.fillText("Score", x + 150, y);
        this.context.fillText("Kills", x + 225, y);
        this.context.fillText("Survive", x + 300, y);

        y += 20;

        botManagers.concat(deadBots)
            .map(bm => {
                bm.score = Object.keys(bm.kills).length * this.world.killPoints
                    + (!bm.dead ? this.world.survivePoints : 0);
                return bm;
            }).sort((bm1, bm2) => {
                return bm2.score - bm1.score;
            }).forEach(bm => {
                // TODO: Bots that are larger than 16x16 based on world config do not render well here. Need to account for bot size here.
                let colX = x + this.world.botRadius;
                bm.bot.render(this.context, new Point(colX, y));

                colX += this.world.botRadius + 8;
                this.context.fillStyle = "#FF0000";
                const winnerId = bm.bot.getId();
                this.context.fillText(winnerId, colX, y);

                colX = x + 150;
                this.context.fillStyle = "#FFFF00";
                this.context.fillText(bm.score, colX, y);

                colX = x + 225;
                this.context.fillStyle = "#FFFF00";
                this.context.fillText(Object.keys(bm.kills).length, colX, y);

                colX = x + 300;
                this.context.fillStyle = "#FFFF00";
                this.context.fillText(bm.dead ? 0 : 1, colX, y);

                y += 20;
            });
    }
}