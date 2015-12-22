// Stores a Game instance
// Stores a canvas context to draw the game into.
// Installs key listeners to move the ship and fire bullets.
// Installs a timer to call Game#step.

(function() {
  var Minesweeper = window.Minesweeper = window.Minesweeper || {};

  var GameView = Minesweeper.GameView = function(game, ctx) {
    this.game = game;
    this.ctx = ctx;
  };

  GameView.dt = 0.02;

  GameView.prototype = {
    start: function() {
      this.game.start();
      setInterval(this.game.draw.bind(this.ctx), this.dt * 1000);
    }
  };

})();
