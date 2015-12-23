var window = window || this;

(function() {
  'use strict';

  window.Grid = function Grid(options) {
    this.rowCt = options.rowCt;
    this.colCt = options.colCt;
    this._values = {};
    this.values = [];
    for (var r=0; r<this.rowCt; r++) {
      this.values.push(new Array(this.colCt));
    }
  };

  Grid.prototype = {
    get cellCt() {
      return this.rowCt * this.colCt;
    },

    has: function(pos) {
      var i = this.toIndex(pos);
      return (i in this._values);
    },

    get: function(pos) {
      var i = this.toIndex(pos);
      if (this._values[i] !== this.values[pos.r][pos.c]) {
        throw new Error("Inconsistent storage" + JSON.stringify({
          old: this._values[i], new: this.values[pos.r][pos.c]
        }));
      }
      return this._values[i];
    },

    set: function(pos, val) {
      var i = this.toIndex(pos);
      this.values[pos.r][pos.c] = val;
      this._values[i] = val;
    },

    del: function(pos) {
      var i = this.toIndex(pos);
      delete this.values[pos.r][pos.c];
      delete this._values[i];
    },

    keys: function() {
      return Object.keys(this._values).map(this.fromIndex.bind(this));
    },

    values: function() {
      var d = this._values;
      return Object.keys(d).map(function(k) {return d[k];});
    },

    items: function() {
      var output = [];
      for (var key in this._values) {
        output.push([this.fromIndex(key), this._values[key]]);
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
