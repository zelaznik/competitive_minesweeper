(function() {
  'use strict';

  /*
    For the player going against the computer robot.
    If either game starts, stops, wins, or loses,
    The corresponding action in the opponent's
    game view is triggered.
  */

  window.DummyView = function DummyView(options) {
    // This is a view solely for single player.
  };

  DummyView.inherits(View, {
    _triggerOpponent: function(methodName, options) {
      if (options && options.calledFromOpponent) {
        return;
      }
      this.opponentView[methodName]({
        calledFromOpponent: true
      });
    },

    start: function(options) {
      View.prototype.start.call(this, options);
      this._triggerOpponent('start', options);
    },

    stop: function(options) {
      View.prototype.stop.call(this, options);
      this._triggerOpponent('stop', options);
    },

    reset: function(newOptions) {
      View.prototype.reset.call(this, newOptions);
      this._triggerOpponent('reset', newOptions);
    },

    makeWin: function(options) {
      this.onWin(options);
      this._triggerOpponent('makeLose', options);
    },

    makeLose: function(options) {
      this.onLose(options);
      this._triggerOpponent('makeWin', options);
    }

  });

})();
