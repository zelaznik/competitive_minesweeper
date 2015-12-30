(function() {
  'use strict';

  var Score = window.Score = function Score(options) {
    Digital.call(this, options);
    this.game = options.game;
    this.canvas = options.canvas;

    this.canvas.height = this.height;
    this.canvas.width = this.width;
  };

  Score.inherits(Digital, {
    valueOf: function() {
      return this.game.minesRemaining();
    }
  });

})();
