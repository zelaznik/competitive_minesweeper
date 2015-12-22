var window = window || this;

(function() {
  'use strict';

  var Grid = window.Grid;

  var mineFieldProxy = window.mineFieldProxy;

  var Game = window.Game = function Game(options) {
    this.flagCt = 0;
    Grid.call(this, options);
    this.mineCt = options.mineCt;
    this.proxy = mineFieldProxy(this);
  };

  Game.ROW_CT = 16;
  Game.COL_CT = 30;
  Game.MINE_CT = 99;

  Game.inherits(Grid, {
    /*****************************
              Properties
    *****************************/
    minesRemaining: function() {
      return this.mineCt - this.flagCt;
    },

    elapsedTime: function() {
      var millisec = (Date.now() - this.startTime);
      return Math.round(millisec / 1000);
    },

    /*****************************
              Methods
    *****************************/
    reveal: function(pos) {
      var result = this.proxy(pos);
      if (!result.mine) {
        this.set(pos, result.nearbyCount);
      } else {
        this.set(pos, 'bomb');
        alert("You lose!");
      }
    },

    start: function() {
      this.startTime = Date.now();
    },

    toggleFlag: function(pos) {
      if (this.get(pos) === undefined) {
        this.set(pos, 'flag');
        this.flagCt++;
      } else if (this.get(pos) === 'flag') {
        this.del(pos);
        this.flagCt--;
      }
    },

    click: function(pos) {
      var x = 3;
    },
  }); // End Prototype

})();
