var window = window || this;

(function() {
  'use strict';

  var Grid = window.Grid;

  var mineFieldProxy = window.mineFieldProxy;

  var Game = window.Game = function Game(options) {
    this.flagCt = 0;
    Grid.call(this, options);
    this.mineCt = options.mineCt;
    // The actual data is locked in a closure.
    // No peeking allowed
    this.proxy = mineFieldProxy(this);
    this.over = false;
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
    reveal: function(pos, callback) {
      if (this.over) {return;}

      var result = this.proxy(pos);
      if (!result.mine) {
        this.set(pos, result.nearbyCount);
        if (result.nearbyCount === 0) {
          result.neighbors.forEach(function(coord) {
            if (!this.has(coord)) {
              this.reveal(coord);
            }
          }.bind(this));
        }
      } else {
        this.set(pos, 'exploded');
        this.end(result);
      }
      return result;
    },

    start: function() {
      this.startTime = Date.now();
    },

    end: function(result) {
      this.over = true;
      this.endTime = Date.now();
      result.allMines.forEach(function(coord) {
        if (!this.get(coord)) {
          this.set(coord, 'bomb');
        }
      }.bind(this));
    },

    toggleFlag: function(pos) {
      if (this.get(pos) === undefined) {
        this.set(pos, 'flag');
        this.flagCt++;
      } else if (this.get(pos) === 'flag') {
        this.del(pos);
        this.flagCt--;
      }
    }

  }); // End Prototype

})();
