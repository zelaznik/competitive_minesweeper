(function() {
  'use strict';

  var mineFieldProxy = window.mineFieldProxy;

  window.MainGame = function MainGame(options) {
    Game.call(this, options);
    // The actual data is locked in
    // a closure. No peeking allowed
    this.proxy = mineFieldProxy(this);
  };

  MainGame.inherits(Game, {

  });

})();
