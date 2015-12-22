var window = window || this;

(function() {
  var Score = window.Score = function Score(options) {
    Digital.call(this, options);
    this.game = options.game;
  };

  Score.inherits(Digital, {
    valueOf: function() {
      return this.game.minesRemaining();
    }
  });

})();
