# Competitive Minesweeper Online

[Live Link][heroku]
[heroku]: http://competitive-minesweeper.herokuapp.com

[preview]: https://github.com/zelaznik/minesweeper_js/blob/master/_readme/preview.png
![screenshot of expert game in progress][preview]

[gatlin]: https://www.github.com/aegatlin
[ms_league_live]: http://www.minesweeperleague.com
[ms_league_github]: https://github.com/aegatlin/minesweeper-league

## Overview
- Clone of the classic Windows logic game.  Can be played either solo, or against a computer.
- The solo game is a pixel perfect clone of the Windows implementation.
- The underlying code is in HTML, CSS, and Javascript.
- Original idea from <a href="https://www.github.com/aegatlin" target="_blank">Austin Gatlin</a>'s "Minesweeper League" ( <a href="http://www.minesweeperleague.com" target="_blank">live</a> , <a href="https://www.github.com/aegatlin/minesweeper-league" target="_blank">github</a> ).

## Rules of Competitive Minesweeper
- The player and the computer get two separate boards.
- Whichever one clears the board first wins.
- If either player overturns a mine, the other one wins.

## All Standard Click Responses Work
- Dual-clicking will sweep the adjacent mines
- Holding the left button down will depress the button where the mouse cursor is.
- Holding both buttons down will depress the current target as well as the surrounding cells.
- The yellow face responds to a button pressing just like in the classic Windows version.
- (Ah, nostalgia)

## Separation of Concerns
- The board is instantiated in a separate class and only accessible through a closure.
- Only one square is revealed at a time.
- The game communicates to the view through callback functions, which makes this game scalable.
- Includes facebook and open graph metatags to make sharing on social media easier.

## Technologies Used
[technologies]: https://github.com/zelaznik/minesweeper_js/blob/master/_readme/technologies.png
![Canvas CSS3 Javascript jQuery][technologies]
