(function() {
  'use strict';

  window.RobotView = function RobotView(options) {
    View.call(this, options);
  };

  RobotView.inherits(CompetitiveView, {
    gameType: window.RobotGame,

    start: function(options) {
      CompetitiveView.prototype.start.call(this, options);
      var randomMoves = this.game.mineField.randomMoves;
      var i = 0;
      var view = this;
      this._tick = setInterval(function() {
        var pos = randomMoves[i++];
        while (view.game.get(pos) !== undefined) {
          pos = randomMoves[i++];
        }
        view.reveal(pos);
        view.draw();
      }, 1500);
    },

    stop: function(options) {
      CompetitiveView.prototype.stop.call(this, options);
      clearInterval(this._tick);
    },

    reset: function(newOptions) {
      CompetitiveView.prototype.reset.call(this, newOptions);
      clearInterval(this._tick);
    }

  });

})();
