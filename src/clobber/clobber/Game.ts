import Point from './Point';
import State, {BotState, BulletState, WorldState} from './State';
import BotManager, {Bot} from './BotManager';
import {Action, Direction} from './BotAction';
import Bullet from './Bullet';
import {Circle, circlesOverlap} from './Shapes';
import GameRenderer from './GameRenderer/GameRenderer';
import ConsoleGameRenderer from './GameRenderer/ConsoleGameRenderer';

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class Game {
    public readonly world: WorldState;
    private botManagers: BotManager[];
    private deadBots: BotManager[];
    private readonly bullets: Bullet[];

    private gameOver: boolean;

    private fps: number;
    private readonly fpsTimes: number[];

    private renderer: GameRenderer;

    constructor() {
        this.world = new WorldState();
        this.renderer = new ConsoleGameRenderer();

        this.botManagers = [];
        this.deadBots = [];
        this.bullets = [];

        this.gameOver = false;

        this.fps = 0;
        this.fpsTimes = [];
    }

    public setRenderer(renderer: GameRenderer) {
        this.renderer = renderer;
    }

    public start(): void {
        // TODO: This is done to allow images to load. Fix this?
        setTimeout(() => this.gameLoop(), 10);
    }

    private getMinDistanceToBot(point: Point): number {
        return this.botManagers.reduce(
            (min, otherBot) => Math.min(min, point.distance(otherBot.point)),
            Number.MAX_VALUE
        );
    }

    public addBotToGame(bot: Bot): void {
        let numTries = 0;
        let minDistance = 0;
        let point;
        do {
            numTries++;
            if (numTries > 1000) {
                throw new Error('Failed to find a spot to place the bot.');
            }
            point = new Point(
                getRandomInt(this.world.botRadius, this.world.width - this.world.botRadius),
                getRandomInt(this.world.botRadius, this.world.height - this.world.botRadius));
            minDistance = this.getMinDistanceToBot(point);
        } while (minDistance < this.world.minStartDistance);
        const botManager = new BotManager(bot, point);
        this.botManagers.push(botManager);
    }

    private gameLoop(): void {
        if (this.gameOver) {
            this.renderer.renderGameOver(this.compileResults());
        } else {
            this.collectBotActions();
            this.performBotActions();
            this.updateBulletPositions();

            this.renderer.render(this.botManagers, this.bullets);
            this.renderer.renderFPS(this.fps);

            this.handleCollisions();
            this.checkGameOver();

            this.renderer.gameLoop(() => {
                const now = performance.now();
                while (this.fpsTimes.length > 0 && this.fpsTimes[0] <= now - 1000) {
                    this.fpsTimes.shift();
                }
                this.fpsTimes.push(now);
                this.fps = this.fpsTimes.length;
                // setTimeout(() => this.gameLoop(), 50);
                this.gameLoop();
            });
        }
    }

    private checkGameOver() {
        const oneTeamStanding = this.botManagers.every(
            (bm, i, managers) => bm.bot.getTeamName() === managers[0].bot.getTeamName()
        );

        if (oneTeamStanding) {
            this.gameOver = true;
        }
    }

    private collectBotActions() {
        this.botManagers.forEach((botManager, index, botManagers) => {
            const state = this.generateState(botManager);
            try {
                botManager.currentAction = botManager.bot.takeTurn(state);
            } catch (err) {
                console.error(`Bot ${botManager} returned error when taking a turn.`, err);
                // TODO: Fix all the places I'm removing items in a forEach. This won't work for consecutive items that need to be removed. It will work if we use a regular loop and start from the end of the array and go backwards.
                botManager.dead = true;
                this.deadBots.push(botManager);
                botManagers.splice(index, 1);
            }
        });
    }

    private generateState(botManager: BotManager): State {
        const myBot = new BotState(
            Game.cloneString(botManager.id),
            Game.cloneString(botManager.bot.getTeamName()),
            botManager.point.clone());

        const bots = this.botManagers
            .filter(bm => bm.id !== botManager.id)
            .map(bm => new BotState(
                Game.cloneString(bm.id),
                Game.cloneString(bm.bot.getTeamName()),
                bm.point.clone()));

        const myBullets = this.bullets
            .filter(bulletManager => bulletManager.owner.id === botManager.id)
            .map(bullet => new BulletState(bullet.point, bullet.direction));

        const bullets = this.bullets
            .filter(bullet => bullet.owner.id !== botManager.id)
            .map(bullet => new BulletState(bullet.point, bullet.direction));

        return new State(myBot, bots, myBullets, bullets);
    }

    private static cloneString(str: string): string {
        return (' ' + str).slice(1);
    }

    private performBotActions() {
        this.botManagers.forEach(botManager => {
            if (botManager.shotClock + this.world.shootFrequency > 0) {
                botManager.shotClock--;
            }
            const action = botManager.currentAction.action;
            const direction = botManager.currentAction.direction;

            if (action === Action.None || direction === Direction.None) {
                return;
            }

            if (action === Action.Move) {
                const point = this.getUpdatedPoint(direction, botManager.point, this.world.botStepDistance);
                if (point.x < this.world.botRadius) {
                    point.x = this.world.botRadius;
                }
                if (point.y < this.world.botRadius) {
                    point.y = this.world.botRadius;
                }
                if (point.x >= this.world.width - this.world.botRadius) {
                    point.x = this.world.width - this.world.botRadius;
                }
                if (point.y >= this.world.height - this.world.botRadius) {
                    point.y = this.world.height - this.world.botRadius;
                }
                botManager.point = point;
            } else if (action === Action.Shoot && botManager.shotClock + this.world.shootFrequency === 0) {
                botManager.shotClock = 0;
                const bullet = new Bullet(
                    botManager,
                    // TODO: Fix bullet starting position. Should start from the edge of the bot. It doesn't render that way because the bullet positions are updated once before getting rendered.
                    this.getUpdatedPoint(direction, botManager.point, this.world.botRadius),
                    direction,
                    this.world.clone()
                );
                this.bullets.push(bullet);
            }
        });
    }

    private updateBulletPositions() {
        this.bullets.forEach((bullet, index, bullets) => {
            bullet.point = this.getUpdatedPoint(bullet.direction, bullet.point, this.world.bulletStepDistance);
            if (bullet.point.x <= -this.world.bulletRadius
                || bullet.point.y <= -this.world.bulletRadius
                || bullet.point.x >= this.world.width + this.world.bulletRadius
                || bullet.point.y >= this.world.height + this.world.bulletRadius) {
                bullets.splice(index, 1);
            }
        });
    }

    private getUpdatedPoint(direction: Direction, point: Point, stepDistance: number): Point {
        let updatedPoint = point.clone();

        if (direction === Direction.Up) {
            updatedPoint.y -= stepDistance;
        } else if (direction === Direction.Right) {
            updatedPoint.x += stepDistance;
        } else if (direction === Direction.Down) {
            updatedPoint.y += stepDistance;
        } else if (direction === Direction.Left) {
            updatedPoint.x -= stepDistance;
        } else if (direction === Direction.UpRight) {
            updatedPoint.y -= stepDistance;
            updatedPoint.x += stepDistance;
        } else if (direction === Direction.DownRight) {
            updatedPoint.y += stepDistance;
            updatedPoint.x += stepDistance;
        } else if (direction === Direction.DownLeft) {
            updatedPoint.y += stepDistance;
            updatedPoint.x -= stepDistance;
        } else if (direction === Direction.UpLeft) {
            updatedPoint.y -= stepDistance;
            updatedPoint.x -= stepDistance;
        }

        return updatedPoint;
    }

    private handleCollisions() {
        this.botManagers = this.botManagers.filter(
            bm1 => !this.botManagers.some(bm2 => {
                const collide = this.botsCollide(bm1, bm2);

                if (collide) {
                    this.deadBots.push(bm1, bm2);
                    bm1.dead = true;
                    bm2.dead = true;
                    // TODO: Can push more dead bots if more than 2 collide at a time. Clean up the lame way of doing this. Probably just use a Set to begin with.
                    this.deadBots = Array.from(new Set(this.deadBots));
                    this.addBotCollideKill(bm1.id, bm2.id);
                    this.addBotCollideKill(bm2.id, bm1.id);
                }

                return collide;
            })
        );

        this.bullets.forEach((bullet, bulletIndex, bullets) => {
            this.botManagers.forEach((botManager, botIndex, botManagers) => {
                if (botManager.id !== bullet.owner.id
                    && this.botAndBulletCollide(bullet.point, botManager.point)) {

                    botManager.dead = true;
                    this.deadBots.push(botManager);
                    this.addBulletKill(bullet.owner.id, botManager.id);

                    bullets.splice(bulletIndex, 1);
                    botManagers.splice(botIndex, 1);
                }
            });
        });
    }

    private addBotCollideKill(killerId: string, killedId: string): void {
        const bot = this.botManagers
            .find(botManager => botManager.id === killerId);
        if (bot) {
            bot.kills[killedId] = true;
        }
    }

    private addBulletKill(killerId: string, killedId: string): void {
        let bot = this.botManagers
            .find(bm => bm.id === killerId);
        if (!bot) {
            bot = this.deadBots.find(bm => bm.id === killerId);
        }
        if (bot) {
            bot.kills[killedId] = true;
        }
    }

    private botAndBulletCollide(bulletPoint: Point, botPoint: Point): boolean {
        const botCircle = new Circle(this.world.botRadius, botPoint.x, botPoint.y);
        const bulletCircle = new Circle(this.world.bulletRadius, bulletPoint.x, bulletPoint.y);
        return circlesOverlap(botCircle, bulletCircle);
    }

    private botsCollide(bot1: BotManager, bot2: BotManager): boolean {
        const botCircle1 = new Circle(this.world.botRadius, bot1.point.x, bot1.point.y);
        const botCircle2 = new Circle(this.world.botRadius, bot2.point.x, bot2.point.y);
        return bot1 !== bot2
            && circlesOverlap(botCircle1, botCircle2);
    }

    private compileResults(): BotManager[] {
        return this.botManagers.concat(this.deadBots)
            .map(bm => {
                bm.score = Object.keys(bm.kills).length * this.world.killPoints
                    + (!bm.dead ? this.world.survivePoints : 0);
                return bm;
            }).sort((bm1, bm2) => {
            return bm2.score - bm1.score;
        });
    }
}
