(function() {
  'use strict';

  var Minefield = window.Minefield;

  window.RobotGame = function RobotGame(options) {
    Game.call(this, options);
    // The actual data is locked in
    // a closure. No peeking allowed
    this.mineField = new Minefield($.extend(options, {
      firstPos: {r:0, c:0}
    }));
  };

  RobotGame.inherits(Game, {

  });

})();
