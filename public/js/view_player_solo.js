(function() {
  'use strict';

  /*
    For the player going against the computer robot.
    If either game starts, stops, wins, or loses,
    The corresponding action in the opponent's
    game view is triggered.
  */

  window.SoloPlayerView = function SoloPlayerView(options) {
    // This is a view solely for single player.
    PlayerView.call(this, options);
  };

  SoloPlayerView.inherits(PlayerView, mixin(CompetitiveView, {
  }));

})();
