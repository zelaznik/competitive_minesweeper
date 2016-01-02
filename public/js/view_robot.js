(function() {
  'use strict';

  window.RobotView = function RobotView(options) {
    View.call(this, options);
    this.addListeners(options);
  };

  RobotView.inherits(View, {
    gameType: window.MainGame,

    start: function() {
      View.prototype.start.call(this, options);
    },

    stop: function(options) {
      View.prototype.stop.call(this, options);
    },

    reset: function(newOptions) {
      View.prototype.reset.call(this, newOptions);
    }
  });

})();
