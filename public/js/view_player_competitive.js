(function() {
  'use strict';

  window.CompetitivePlayerView = function CompetitivePlayerView(options) {
    PlayerView.call(this, options);
    CompetitiveView.call(this, options);
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
