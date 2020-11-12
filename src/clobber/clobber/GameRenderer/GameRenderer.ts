import BotManager from '../BotManager';
import Bullet from '../Bullet';

export default abstract class GameRenderer {
    public abstract gameLoop(callback: () => void): void;

    public abstract render(botManagers: BotManager[], bullets: Bullet[]): void;

    public abstract renderFPS(fps: number): void;

    public abstract renderGameOver(orderedBots: BotManager[]): void;
}

