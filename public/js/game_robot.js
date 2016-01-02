(function() {
  'use strict';

  var MineField = window.MineField;

  window.RobotGame = function RobotGame(options) {
    Game.call(this, options);
    // The actual data is locked in
    // a closure. No peeking allowed
    this.mineField = new MineField();
  };

  RobotGame.inherits(Game, {
    
  });

})();
