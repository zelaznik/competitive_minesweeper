(function() {
  'use strict';

  window.RobotView = function RobotView(options) {
    View.call(this, options);
  };

  RobotView.inherits(CompetitiveView, {
    gameType: window.RobotGame,

    start: function(options) {
      var randomMoves, randomFlags, debugGetValues;
      var pos, view, match, x, i, n, ct;

      CompetitiveView.prototype.start.call(this, options);

      randomMoves = this.game.mineField.randomMoves;
      randomFlags = this.game.mineField.randomFlags;
      view = this;

      this._tick = setInterval(function() {
        // Either flag a mine or reveal a new square, 50-50 odds.
        if (randomFlags.length >= 1 && Math.random() < 0.5) {
          view.toggleFlag(randomFlags.pop());

        } else {
          while (!pos || view.game.get(pos) !== undefined) {
            pos = randomMoves.pop();
          }
          view.reveal(pos);
        }
        view.draw();

      }.bind(this), 50);
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
