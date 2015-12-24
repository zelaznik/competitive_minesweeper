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
  Game.MINE_CT = 10;

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
      if (this[[pos.r, pos.c]] !== undefined) {
        return {};
      }

      var result = this.proxy(pos);
      if (result.mine) {
        this.set(pos, 'exploded');
        return this.end(result);
      }

      this.set(pos, result.nearbyCount);
      if (callback) {
        callback(pos);
      }
      if (result.nearbyCount === 0) {
        result.neighbors.forEach(callback);
        result.neighbors.forEach(function(coord, i) {
          this.reveal(coord, callback);
        }.bind(this));
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

      var self = this;
      var mf = result.minefield;

      // Display All The Bombs
      mf.forEach(function(val, pos) {
        if (val && (self.get(pos) === undefined)) {
          self.set(pos, 'bomb');
        }
      });

      // Show all False Flags
      this.forEach(function(val, pos) {
        if ( (val === 'flag') && (!mf.get(pos)) ) {
          self.set(pos, 'falseflag');
        }
      });

      return result;
    },

    reset: function() {
      delete this.over;
      delete this.begun;
      Game.call(this, this.options);
    },

    toggleFlag: function(pos, callback) {
      if (this.get(pos) === undefined) {
        this.set(pos, 'flag');
        this.flagCt++;
      } else if (this.get(pos) === 'flag') {
        this.del(pos);
        this.flagCt--;
      }
      callback(pos);
      return {};
    },

    sweep: function(pos, callback) {
      if (this.get(pos) === undefined) {
        return {};
      }

      var result = this.reveal(pos, callback);
      this.neighbors(pos).forEach(function(coord, i) {
        callback(coord, i);
        var singleResult = this.reveal(coord, callback);
        if (singleResult.mine) {
          result = singleResult;
        }
      }.bind(this));

      return result;
    }

  }); // End Prototype

})();
