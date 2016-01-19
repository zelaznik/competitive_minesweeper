(function() {
  'use strict';

  window.CompetitivePlayerView = function CompetitivePlayerView(options) {
    PlayerView.call(this, options);
    CompetitiveView.call(this, options);
  };

  CompetitivePlayerView.inherits(PlayerView,
    mixin(CompetitiveView)
  );

})();
