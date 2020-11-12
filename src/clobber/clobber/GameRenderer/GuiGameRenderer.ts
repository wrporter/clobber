import GameRenderer from './GameRenderer';
import {WorldState} from '../State';
import BotManager from '../BotManager';
import Bullet from '../Bullet';
import Point from '../Point';

export default class GuiGameRenderer extends GameRenderer {
    private readonly context: CanvasRenderingContext2D;
    private readonly canvas: HTMLCanvasElement;

    constructor(private rootElement: HTMLDivElement, private world: WorldState) {
        super();

        const canvas = document.createElement('canvas');
        canvas.width = world.width;
        canvas.height = world.height;
        rootElement.appendChild(canvas);

        this.context = canvas.getContext('2d')!;
        this.canvas = canvas;
    }

    private clearScreen() {
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render(botManagers: BotManager[], bullets: Bullet[]) {
        this.clearScreen();
        botManagers.forEach(bot => bot.render(this.context));
        bullets.forEach(bullet => bullet.render(this.context));
    }

    renderFPS(fps: number) {
        this.context.fillStyle = '#FF00FF';
        this.context.font = 'normal 12pt Arial';
        this.context.fillText(Math.round(fps) + ' fps', 4, 18);

        this.context.fillStyle = '#000000';
    }

    renderGameOver(orderedBots: BotManager[]) {
        this.clearScreen();
        this.context.fillStyle = '#0000FF';
        this.context.font = 'normal 12pt Arial';
        this.context.textBaseline = 'middle';

        let x = 12;
        let y = 20;

        this.context.fillText('Scoreboard', x, y);

        y += 20;

        this.context.fillStyle = '#00FF00';
        this.context.fillText('Bot', x, y);
        this.context.fillText('Score', x + 150, y);
        this.context.fillText('Kills', x + 225, y);
        this.context.fillText('Survive', x + 300, y);

        y += 20;

        orderedBots.forEach(bm => {
            // TODO: Bots that are larger than 16x16 based on world config do not render well here. Need to account for bot size here.
            let colX = x + this.world.botRadius;
            bm.bot.render(this.context, new Point(colX, y));

            colX += this.world.botRadius + 8;
            this.context.fillStyle = '#FF0000';
            const winnerId = bm.id;
            this.context.fillText(winnerId, colX, y);

            colX = x + 150;
            this.context.fillStyle = '#FFFF00';
            this.context.fillText(String(bm.score), colX, y);

            colX = x + 225;
            this.context.fillStyle = '#FFFF00';
            this.context.fillText(String(Object.keys(bm.kills).length), colX, y);

            colX = x + 300;
            this.context.fillStyle = '#FFFF00';
            this.context.fillText(bm.dead ? '0' : '1', colX, y);

            y += 20;
        });
    }

    gameLoop(callback: () => void): void {
        requestAnimationFrame(callback);
    }
}