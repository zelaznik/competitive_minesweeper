# Competitive Minesweeper Online

<a href="http://competitive-minesweeper.herokuapp.com" target="_blank">
<img src="https://github.com/zelaznik/minesweeper_js/blob/master/_readme/preview.png" alt="screenshot of expert player-vs-compter game in progress with link to live page"></a>

## Overview
- Clone of the classic Windows logic game, with the added ability to play against a computer.
- A human player sees their board on the left and their oppponent's on the right.
- A player wins when: a) they clear ther own board first, or b) their opponent clicks on a mine.
- The display of each player's game is a pixel perfect clone of the classic Windows version.

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
