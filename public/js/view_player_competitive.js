(function() {
  'use strict';

  window.CompetitivePlayerView = function CompetitivePlayerView(options) {
    console.log("Making competitivePlayerView");
    PlayerView.call(this, options);
    CompetitiveView.call(this, options);
  };

  CompetitivePlayerView.inherits(PlayerView,
    mixin(CompetitiveView)
  );

})();
