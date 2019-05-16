# Clobber Bots

## Getting Started

Serve and develop the app:

```bash
npm start
```

Build static assets to be output to the `dist` directory:

```bash
npm run build
```

## Rules

- For each turn cycle, every bot may make 1 of 3 actions.
    1. Do nothing
    2. Move
    3. Shoot
- Bots may move or shoot in any of the 8 directions.
	1. Up
	2. Right
	3. Down
	4. Left
	5. Up-Right
	6. Down-Right
	7. Down-Left
	8. Up-Left
- If bots attempt to move outside the playing field, their position will be auto-adjusted to stay within the boundaries of the game. Bots that move in this manner, essentially lose a turn.
- If bots collide with each other they die.
- If bots get hit by a bullet they die.
- Bots may only shoot at a maximum rate of every 20 turn cycles. For example, if a bot chooses to shoot on turn 3, they cannot shoot again until turn 23. Bots that choose to shoot on a turn they are not permitted will essentially lose a turn.
- Bots cannot be killed by their own bullets.
- Bots take up the space of a 16x16 pixel square, even if they do not render that large. Bots should pay attention to the potential areas they may collide.
- Bullets take up a space of a 5 pixel circle.
- If bots throw any errors during processing, they will be disqualified and deleted from the match.
### Teams

Bots may form teams. Bots that are programmed to recognize their teammates and work together will have a significant advantage.

### Points

Points are awarded in the following ways.

1. +10 points per kill, either by colliding into another bot or shooting them. When bots collide, each bot gains +10 points equally for a kill.
2. +40 points per bot that survives to the end of the game.

Points are accumulated per bot on a team.

The winner is the one with the most points at the end of the game.

### Game End

The game ends when there are only bots of the same team remaining.

## Description:

In this assignment, you will develop an agent (or bot) for a video game. More than 1 copy of your bot may be placed in the game. So, for maximum performance you will need to make your bots cooperate with each other - at a minimum they shouldn't intentionally shoot each other. I plan on running tournaments with teams of size 1, 2, and 4. I'll run the tournaments as 1 team vs 1 team round robbin, and free-for-all (everybody all at once). There are two goals in the game:

- Destroy as many of the other bots in the game as possible by shooting them or ramming them (but if you ram them you die too, so that may not be the best strategy) - worth +10 points for each kill.
- Survive to the end of the game - worth +40 points.
- The score for all copies of your bots will be summed.

I have provided the game code and examples of bots. You will want to look at these bots as potential starting points for your bot. In particular, look at ClobberBot4.java to see how you can read through the world state (WhatIKnow.java class) to see where everything is. The best performing bot is ClobberBot6.java.

## Program Requirements:

Your bot should extend the ClobberBot class and override the toString, drawMe, and takeTurn methods.

The main thing for your bot is performance. In terms of performance, your bot should outperform the bots that have been provided as examples. To do that you'll need to somehow improve on ClobberBot6's performance, which may not be all that easy to do. You can use it as a starting point, or code your own bot up from scratch. Make sure you report on the performance of your bot vs ClobberBot6.

When the Clobber game queries your bot for an action (calls the takeTurn method), your takeTurn method must return that action in a timely manner. Bots that take too long will be penalized. How long is too long? Certainly a 10th of a second is too long. For example, if you want to do 30 frames a second, and you've got, say, 20 bots in the game, then each bot can only take *at most* 1/600 of a second to make a decision every turn. For this program try to keep your decision making time to less than 1/100 of a second. If you go above that you're going to start to be penalized.

Your drawMe method also should be very fast. It should take at most something like 1/10,000 of a second. Whatever you decided to draw for your agent, it should be centered on the point passed into the method and shouldn't exceed the agent girth (see Clobber.java for the maximum girth).

Your toString method should return the string "yourLoginName" (where "yourLoginName" is your login name on onyx, which also happens to be the name of your main class for this assignment).

## Objectives:

- Learn how program an adjent that functions in a multi-agent environment.
- Learn how to make teams of agents cooperate.
- Beat the pants off your fellow students

## Readme:

You should also include a professional quality writeup of 5 to 8 (or so, single spaced) pages that describes the overall design of your bot. In particular, include a description of the algorithm you use in your takeTurn method. Also include your implementation plan in the readme file. You can also include any other information you think I should know when I'm grading your program. If you have ideas for how to improve the program, you could mention those as well. Make sure you report on your own performance results/tests.

## Testing:

We have provided the Clobber game program that you can use to run your bot. Other than that it is up to you to decide what testing you need to do. Make sure you talk about your test methodology in your readme file.

## Submission:

Required files (be sure the names match what is here exactly):

- yourLoginName.java
- readme

All the files that are relevant to this assignment should be together in a single directory (the name of your directory does not matter). Remove all class files and any other extraneous files before submitting.
