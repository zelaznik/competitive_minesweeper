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
    Grid.call(this, options);

    this.flagCt = 0;
    this._counts = {undefined: this.cellCt};
    this.hiddenCt = this.cellCt;
    this.mineCt = options.mineCt;
    // The actual data is locked in a closure.
    // No peeking allowed
    this.proxy = mineFieldProxy(this);
    this.over = false;
  };

  Game.ROW_CT = 16;
  Game.COL_CT = 30;
  Game.MINE_CT = 40;

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

    set: function(pos, val) {
      Grid.prototype.set.call(this, pos, val);
      var prev = this._counts[val];
      this._counts[val] = (prev || 0) + 1;
      this._counts[undefined] -= 1;
    },

    del: function(pos) {
      var val = this.get(pos);
      Grid.prototype.del.call(this, pos);
      this._counts[undefined] += 1;
      if (this._counts[val] == 1) {
        delete this._counts[val];
      } else {
        this._counts[val] -= 1;
      }
    },

    count: function(val) {
      return this._counts[val] || 0;
    },

    reveal: function(pos, callback) {
      if (this.get(pos) !== undefined) {
        return {};
      }

      callback = callback || function() {};
      var result = this.proxy(pos);

      if (result.mine) {
        return this.lose(pos, result);
      }

      this.set(pos, result.nearbyCount);
      callback(pos);

      if (result.nearbyCount === 0) {
        for (var i in result.neighbors) {
          var neighbor = result.neighbors[i];
          callback(neighbor);
          this.reveal(neighbor, callback);
        }
      }

      // We can win even if we haven't flagged all the remaining mines
      // as long as every non-mine has already been turned over.
      if ((this.count('flag') + this.count(undefined)) === this.mineCt) {
        this.forEach(function(val, coord) {
          this.ensureFlag(coord, callback);
        }.bind(this));
        return this.win(pos, result);
      }

      return result;
    },

    start: function() {
      this.startTime = Date.now();
      this.begun = true;
    },

    end: function(pos, result) {
      this.over = true;
      this.endTime = Date.now();
    },

    win: function(pos, result) {
      this.won = result.won = true;
      this.end(pos, result);
      return result;
    },

    lose: function(pos, result) {
      this.lost = true;
      this.end(pos, result);

      var self = this;
      self.set(pos, 'exploded');

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

    ensureFlag: function(pos, callback) {
      if (this.get(pos) === undefined) {
        this.set(pos, 'flag');
        this.flagCt++;
      }
      callback(pos);
      return {};
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
      var v = this.get(pos);
      if (v === undefined || v === 'flag') {
        return {};
      }

      var flagCount = 0;
      this.neighbors(pos).forEach(function(coord) {
        if (this.get(coord) === 'flag') {
          flagCount ++;
        }
      }.bind(this));

      if (flagCount != v) {
        return {};
      }

      var result = this.reveal(pos, callback);
      this.neighbors(pos).forEach(function(coord, i) {
        callback(coord, i);
        var singleResult = this.reveal(coord, callback);
        if (singleResult.mine || singleResult.won) {
          result = singleResult;
        }
      }.bind(this));

      return result;
    }

  }); // End Prototype

})();
