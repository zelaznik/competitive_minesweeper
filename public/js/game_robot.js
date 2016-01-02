(function() {
  'use strict';

  var Minefield = window.Minefield;

  window.RobotGame = function RobotGame(options) {
    Game.call(this, options);
    // The actual data is locked in
    // a closure. No peeking allowed
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
