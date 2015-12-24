var window = window || this;

(function() {
  'use strict';

  var Grid = window.Grid;

  var mineFieldProxy = window.mineFieldProxy;

  var Game = window.Game = function Game(options) {
    options = options || {};
    options.rowCt = options.rowCt || Game.ROW_CT;
    options.colCt = options.colCt || Game.COL_CT; 
    options.mineCt = options.mineCt || Game.MINE_CT;
    this.options = options;

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
<<<<<<< HEAD
    reveal: function(pos, callback) {
      if (this.over || (this.get(pos) !== undefined)) {
        return {};
      }

=======
    reveal: function(pos, level) {
      if (this.get(pos)) {
        return;
      }
      level = level || 0;
>>>>>>> 36754e9cb2bedeea4d46f53857ba8fadbd16713f
      var result = this.proxy(pos);
      console.log(JSON.stringify({pos: pos, level: level, result: result}));
      if (!result.mine) {
        this.set(pos, result.nearbyCount);
        if (result.nearbyCount === 0) {
          result.neighbors.forEach(function() {
            this.reveal(pos, level+1);
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
      this.begun = true;
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

    reset: function() {
      Game.call(this, this.options);
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

    sweep: function(pos) {
      if (this.get(pos) === undefined) {
        return;
      }
      this.neighbors(pos).forEach(
        this.reveal.bind(this)
      );
    }

  }); // End Prototype

})();
