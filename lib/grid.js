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
      return this[[pos.r, pos.c]];
    },

    set: function(pos, val) {
      this[[pos.r, pos.c]] = val;
    },

    del: function(pos) {
      delete this[[pos.r, pos.c]];
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
      if (!this._neighborCache) {
        this.makeNeighborCache();
      }
      return this._neighborCache[[pos.r,pos.c]];
    },

    neighborsForOne: function(r, c) {
      // Returns all the neighbors within the boundaries of the minefield.
      var possible = [
        {r: r - 1, c: c - 1},
        {r: r - 1, c: c + 0},
        {r: r - 1, c: c + 1},

        {r: r + 0, c: c - 1},
        {r: r + 0, c: c + 1},

        {r: r + 1, c: c - 1},
        {r: r + 1, c: c + 0},
        {r: r + 1, c: c + 1},
      ];

      return possible.filter(this.inRange.bind(this));
    },

    makeNeighborCache: function() {
      var cache = this._neighborCache = {};
      for (var r=0; r<this.rowCt; r++) {
        for (var c=0; c<this.colCt; c++) {
          var val = this.neighborsForOne(r, c);
          cache[[r, c]] = val;
        }
      }
    }
  };

})();
