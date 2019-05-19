# Clobber Bots

Welcome to Clobber Bots! The goals I have for creating this game are to:

1. Have fun!
2. Provide a cool way to learn some AI principles.

## Submission

Build your own bot and enter it into the game to contest other bots!

## Resources

TODO: Add resources for learning about AI. Add to website?

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
- Bots take up the space of an 8-pixel-radius circle, even if they do not render that large. Bots should pay attention to the potential areas they may collide.
- Bullets take up a space of a 2-pixel-radius circle. Once bullets leave the map, they are discarded.
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
