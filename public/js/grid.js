var window = window || this;

(function() {
  'use strict';

  window.Grid = function Grid(options) {
    this.rowCt = options.rowCt;
    this.colCt = options.colCt;
    this.cellCt = this.rowCt * this.colCt;
    this._values = {};
    this._groups = {undefined: +this.cellCt};
  };

  Grid.prototype = {
    get: function(pos) {
      var key = [[pos.r, pos.c]];
      return this._values[key];
    },

    set: function(pos, newVal) {
      var key = [[pos.r, pos.c]];
      this._values[key] = newVal;
    },

    del: function(pos) {
      var key = [[pos.r, pos.c]];
      delete this._values[key];
    },

    forEach: function(callback) {
      //callback accepts (value [position])
      for (var r=0, rowCt = this.rowCt; r<rowCt; r++) {
        for (var c=0, colCt = this.colCt; c<colCt; c++) {
          var pos = {r:r, c:c};
          callback( this.get(pos) , pos );
        }
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
