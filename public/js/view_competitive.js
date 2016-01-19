(function() {
  'use strict';

  window.CompetitiveView = function CompetitiveView(options) {
    this.opponentView = options.opponentView;
  };

  CompetitiveView.prototype = {
    // This prototype is solely designed for mixins, not inheritance;

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
      superClass(this).start.call(this, options);
      this._triggerOpponent('start', options);
    },

    stop: function(options) {
      superClass(this).stop.call(this, options);
      this._triggerOpponent('stop', options);
    },

    reset: function(newOptions) {
      superClass(this).reset.call(this, newOptions);
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

  };

})();
