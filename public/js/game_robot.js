(function() {
  'use strict';

  var Minefield = window.Minefield;

  window.RobotGame = function RobotGame(options) {
    Game.call(this, options);

    // The robot gets to view the board, unlike a human player.
    // The robot will NEVER make a mistake under this implementation.
    var mineField = this.mineField = new Minefield($.extend(options, {
      firstPos: {r:0, c:0}
    }));

    this.proxy = function(pos) {
      return mineField.reveal(pos);
    };
  };

  RobotGame.inherits(Game, {

  });

})();
