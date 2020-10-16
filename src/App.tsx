import React from 'react';
import './App.css';

import styles from './clobber/clobber.module.css';
import './clobber/prismjs/prism';
import Game from './clobber/clobber/Game';
import {generateId} from './clobber/clobber/ID';
import RandomBot from './clobber/clobber/bots/RandomBot';
import {Mushroom} from './clobber/clobber/bots/Mushroom';
import PotentialFieldBot from './clobber/clobber/bots/PotentialFieldBot';
import HumanBot from './clobber/clobber/bots/HumanBot';

function addBots(game) {
    game.addBotToGame(new HumanBot(generateId(), 'human', game.world.clone()));
    game.addBotToGame(new Mushroom(generateId(), 'mushroom', game.world.clone()));
    game.addBotToGame(new Mushroom(generateId(), 'mushroom', game.world.clone()));
    game.addBotToGame(new Mushroom(generateId(), 'mushroom', game.world.clone()));
    game.addBotToGame(new Mushroom(generateId(), 'mushroom', game.world.clone()));
    game.addBotToGame(new Mushroom(generateId(), 'mushroom', game.world.clone()));
    game.addBotToGame(new RandomBot(generateId(), generateId(), game.world.clone()));
    game.addBotToGame(new RandomBot(generateId(), generateId(), game.world.clone()));
    game.addBotToGame(new RandomBot(generateId(), generateId(), game.world.clone()));
    game.addBotToGame(new PotentialFieldBot(generateId(), 'star', game.world.clone()));
    game.addBotToGame(new PotentialFieldBot(generateId(), 'star', game.world.clone()));
    game.addBotToGame(new PotentialFieldBot(generateId(), 'star', game.world.clone()));
    game.addBotToGame(new PotentialFieldBot(generateId(), 'star', game.world.clone()));
    game.addBotToGame(new PotentialFieldBot(generateId(), 'star', game.world.clone()));
}

function App() {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const botCodeRef = React.useRef<HTMLElement>(null);
    const gameRef = React.useRef<any>();

    React.useEffect(() => {
        if (canvasRef.current) {
            gameRef.current = new Game(canvasRef.current);
            addBots(gameRef.current);
            gameRef.current.start();
        }
    }, [])

    function handleNewGame() {
        gameRef.current = new Game(canvasRef.current);
        addBots(gameRef.current);
    }

    function handleAddBot() {
        // eslint-disable-next-line no-eval
        const MyBot = eval(`(${botCodeRef.current?.innerText})`);
        const bot = new MyBot(generateId(), 'my-bot', gameRef.current.world.clone());
        gameRef.current.addBotToGame(bot);
    }

    function handleStartGame() {
        for (let i = 0; i < 10; i++) {
            gameRef.current.addBotToGame(new RandomBot(generateId(), generateId(), gameRef.current.world.clone()));
        }
        for (let i = 0; i < 3; i++) {
            gameRef.current.addBotToGame(new Mushroom(generateId(), 'mushroom', gameRef.current.world.clone()));
        }
        gameRef.current.start();
    }

    function handleEndGame() {
        gameRef.current.gameOver = true;
    }

    return (
        <div className="App">
            <h1>Clobber Bots</h1>

            <canvas className={styles.game} ref={canvasRef} width="400" height="400"/>

            <h2>Human Bot</h2>
            <p>Take the challenge and contest as the human-controlled bot, currently represented as a yellow circle.</p>
            <p>Use the arrow keys to move and the the E (up), D (down), S (left), and F (right) keys to shoot in the
                provided
                direction.</p>


            <h2>Custom Bots!</h2>

            <button type="button" onClick={handleNewGame}>New Game</button>
            <button type="button" onClick={handleAddBot}>Add Bot</button>
            <button type="button" onClick={handleStartGame}>Start Game</button>
            <button type="button" onClick={handleEndGame}>End Game</button>

            <ol>
                <li>Click New Game to setup a new game. You want to do this if you want to test modifications to your
                    bot. If
                    you click Start Game between games, all bots from previous games will get added.
                </li>
                <li>Add your bot in the code area below.</li>
                <li>Click Add Bot to add your bot to the game. For each click, a new copy of your bot will get added.
                </li>
                <li>Click Start Game to start the game and see it run!</li>
            </ol>

            <pre className={styles.botPre}>
	<code ref={botCodeRef} className="bot-code language-javascript" contentEditable suppressContentEditableWarning={true}>
        {
            `
            class MyBot {
                constructor(id, team, world) {
                    this.id = id;
                    this.team = team;
                    this.world = world;
                }
            
                getId() {
                    return this.id;
                }
            
                takeTurn(state) {
                    let action = "None";
                    let direction = "Up";
            
                    switch(MyBot.getRandomInt(2))
                    {
                        case 0:
                            action = "Move";
                            break;
                        case 1:
                            action = "Shoot";
                            break;
                        default:
                            action = "None";
                    }
            
                    switch(MyBot.getRandomInt(8))
                    {
                        case 0:
                            direction = "Up";
                            break;
                        case 1:
                            direction = "Down";
                            break;
                        case 2:
                            direction = "Left";
                            break;
                        case 3:
                            direction = "Right";
                            break;
                        case 4:
                            direction = "UpLeft";
                            break;
                        case 5:
                            direction = "UpRight";
                            break;
                        case 6:
                            direction = "DownRight";
                            break;
                        default:
                            direction = "DownLeft";
                    }
            
                    return {action, direction};
                }
            
                render(context, point) {
                    context.fillStyle = "#ffff00";
                    context.beginPath();
                    context.arc(point.x, point.y, this.world.botRadius, 0, 2 * Math.PI);
                    context.fill();
                    context.fillStyle = "#000";
                }
            
                toString() {
                    return JSON.stringify({
                        id: this.id,
                        name: this.team
                    }, null, 4);
                }
            
                static getRandomInt(max) {
                    return Math.floor(Math.random() * Math.floor(max));
                }
            }
            `
        }
	</code>
</pre>
        </div>
    );
}

export default App;
