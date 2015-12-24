var window = window || this;

(function() {
  'use strict';

  window.Grid = function Grid(options) {
    this.rowCt = options.rowCt;
    this.colCt = options.colCt;
    this.cellCt = this.rowCt * this.colCt;
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

    forEach: function(callback) {
      //callback accepts (value [position])
      for (var r=0, rowCt = this.rowCt; r<rowCt; r++) {
        for (var c=0, colCt = this.colCt; c<colCt; c++) {
          callback( this[[r,c]], {r:r, c:c} );
        }
      }
    },

    keys: function(callback) {
      return this.map(function(value, pos) { return pos; });
    },

    values: function(callback) {
      return this.map(function(value, pos) { return value; });
    },

    items: function(callback) {
      return this.map(function(value, pos) { return [value, pos]; });
    },

    filter: function(callback) {
      var output = new Grid(this);
      this.forEach(function(value, pos) {
        if (callback(value, pos)) {output[pos] = value; }
      });
      return output;
    },

    map: function(callback) {
      var output = new Grid(this);
      this.forEach(function(value, pos) {
        output[pos] = callback(value, pos);
      });
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
      this.forEach(function(val, pos) {
        var result = this.neighborsForOne(pos.r, pos.c);
        cache[[pos.r,pos.c]] = result;
      }.bind(this));
    }
  };

})();
