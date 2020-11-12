import GameRenderer from './GameRenderer';
import BotManager from '../BotManager';
import Bullet from '../Bullet';

export default class ConsoleGameRenderer extends GameRenderer {
    render(botManagers: BotManager[], bullets: Bullet[]) {
    }

    renderFPS(fps: number) {
    }

    renderGameOver(orderedBots: BotManager[]) {
        orderedBots.forEach(bm => {
            console.log(`Bot: ${bm.id}, Team: ${bm.bot.getTeamName()}, Score: ${bm.score}`)
        });
    }

    gameLoop(callback: () => void): void {
        callback();
    }
}
