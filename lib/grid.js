var window = window || this;

(function() {
  'use strict';

  window.Grid = function Grid(options) {
    this.rowCt = options.rowCt;
    this.colCt = options.colCt;
    this.cellCt = this.rowCt * this.colCt;

    this.values = [];
    for (var r=0; r<this.rowCt; r++) {
      this.values.push(new Array(this.colCt));
    }
  };

  Grid.prototype = {
    get: function(pos) {
      var row = this.values[pos.r];
      return (row && row[pos.c]);
    },

    set: function(pos, val) {
      this.values[pos.r][pos.c] = val;
    },

    del: function(pos) {
      delete this.values[pos.r][pos.c];
    },

    toIndex: function(pos) {
      this.validate(pos);
      return (pos.r * this.colCt) + pos.c;
    },

    fromIndex: function(i) {
      var r = Math.floor(i / this.colCt);
      var c = i % this.colCt;
      return {r: r, c: c};
    },

    validate: function(pos) {
      if (!this.inRange(pos)) {
        throw new RangeError("Invalid position" + JSON.stringify(pos));
      }
    },

    inRange: function(pos) {
      return (
        pos.r >= 0 && pos.r < this.rowCt &&
        pos.c >= 0 && pos.c < this.colCt
      );
    },

    neighbors: function(pos) {
      // Returns all the neighbors within the boundaries of the minefield.
      var possible = [
        {r: pos.r - 1, c: pos.c - 1},
        {r: pos.r - 1, c: pos.c + 0},
        {r: pos.r - 1, c: pos.c + 1},

        {r: pos.r + 0, c: pos.c - 1},
        {r: pos.r + 0, c: pos.c + 1},

        {r: pos.r + 1, c: pos.c - 1},
        {r: pos.r + 1, c: pos.c + 0},
        {r: pos.r + 1, c: pos.c + 1},
      ];

      var output = [];
      for (var i in possible) {
        if (this.inRange(possible[i])) {
          output.push(possible[i]);
        }
      }
      return output;
    }
  };

})();
