(function() {
  'use strict';

  window.CompetitivePlayerView = function CompetitivePlayerView(options) {
    View.call(this, options);
    this.opponentView = options.opponentView;
    this.addListeners(options);
  };

  CompetitivePlayerView.inherits(PlayerView, mixin(CompetitiveView, {
    gameType: window.MainGame,

    onWin: function(options) {
      this.body.classList.add('success');
      this.resetButton.classList.add('sunglasses');
    },

    onLose: function() {
      this.body.classList.add('failure');
      this.resetButton.classList.add('frown');
    },

  }));

})();
