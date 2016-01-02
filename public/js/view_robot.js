(function() {
  'use strict';

  window.RobotView = function RobotView(options) {
    View.call(this, options);
  };

  RobotView.inherits(View, {
    gameType: window.RobotGame,

    start: function(options) {
      View.prototype.start.call(this, options);
      var randomMoves = this.game.mineField.randomMoves;
      var i = 0;
      var view = this;
      this._tick = function() {
        var pos = randomMoves[i++];
        console.log(JSON.stringify(pos));
        view.reveal(pos);
        view.draw();
      };
      setInterval(this._tick, 1500);
    },

    stop: function(options) {
      View.prototype.stop.call(this, options);
      clearInterval(this._tick, 1500);
    },

    reset: function(newOptions) {
      View.prototype.reset.call(this, newOptions);
    }
  });

})();
