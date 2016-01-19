(function() {
  'use strict';

  /*
    For the player going against the computer robot.
    If either game starts, stops, wins, or loses,
    The corresponding action in the opponent's 
    game view is triggered.
  */

  window.CompetitiveView = function CompetitiveView(options) {
    View.call(this, options);
  };

  CompetitiveView.inherits(View, {
    setOpponentView: function(opponentView) {
      this.opponentView = opponentView;
    },

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
    }

  });

})();