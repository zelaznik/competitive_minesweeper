var window = window || this;

(function() {
  'use strict';

  window.Grid = function Grid(options) {
    this.rowCt = options.rowCt;
    this.colCt = options.colCt;
    this._values = {};
  };

  Grid.prototype = {
    get cellCt() {
      return this.rowCt * this.colCt;
    },

    get: function(pos) {
      var i = this.toIndex(pos);
      return this._values[i];
    },

    set: function(pos, val) {
      var i = this.toIndex(pos);
      this._values[i] = val;
    },

    del: function(pos) {
      var i = this.toIndex(pos);
      delete this._values[i];
    },

    data: function() {
      var output = {};
      for (var i in this._values) {
        var key = this.fromIndex(i);
        output[key] = this._values[i];
      }
      return output;
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

      return possible.filter(this.inRange.bind(this));
    }
  };

})();
