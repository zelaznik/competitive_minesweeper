# Minesweeper-JS

[Live Link][heroku]
[heroku]: http://competitive-minesweeper.herokuapp.com

[preview]: https://github.com/zelaznik/minesweeper_js/blob/master/_readme/preview.png
![screenshot of expert game in progress][preview]

## Overview
Pixel perfect clone of the classic Windows logic game, implemented in JavaScript. All the standard features are available such as dual-clicking in order to clear the adjacent cells of mines. Touch responsive: when holding the mouse down, a user can see the adjacent mines press inward before clicking. The yellow face reacts to events just like the classic Windows version.

Separation of concerns. The board is instantiated in a separate class and only accessible through a closure. Only one square is revealed at a time. The game communicates to the view through callback functions, which makes this game scalable. Includes facebook and open graph metatags to make sharing on social media easier.

## Technologies Used
[technologies]: https://github.com/zelaznik/minesweeper_js/blob/master/_readme/technologies.jpg
![Canvas CSS3 Javascript jQuery][technologies]
