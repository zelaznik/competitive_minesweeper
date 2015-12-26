var window = window || this;

(function() {
  'use strict';

  var Minefield = window.Minefield = function Minefield(options) {
    Grid.call(this, options);
    this.mineCt = options.mineCt;

    // Populates the mine field after the first click.
    // The first cell clicked can never contain a mine.
    var b, r, c, m, i, pos, iMax;

    var cells = [];
    var firstPos = options.firstPos;
    var firstIndex = '' + [firstPos.r, firstPos.c];
    this.forEach(function(val, pos) {
      if (([pos.r,pos.c]+'') !== firstIndex) {
        cells.push(pos);
      }
    });

    for (m = 0; m < this.mineCt; m++) {
      i = Math.floor(Math.random() * cells.length);
      this.set(cells[i], true);
      cells = cells.slice(0,i).concat(cells.slice(i+1));
    }

    // Pre-calculate the number of mines nearby.
    var nearby = this.nearby = {};
    this.forEach(function(val, pos) {
      nearby[[pos.r, pos.c]] = this.nearbyCount(pos);
    }.bind(this));
  };

  Minefield.inherits(Grid, ({
    reveal: function(pos) {
      var hasMine = !!this.get(pos);
      return {
        mine: hasMine,
        minefield: (hasMine) ? this : null,
        nearbyCount: this.nearby[[pos.r, pos.c]],
        neighbors: this.neighbors(pos)
      };
    },

    nearbyCount: function(pos) {
      var dct, i, ct;
      // Calculates the number of neighbors with mines underneath.
      ct = 0;
      var myNeighbors = this.neighbors(pos);
      for (i in myNeighbors) {
        var neighbor = myNeighbors[i];
        ct += !!this.get(neighbor);
      }
      return ct;
    }
  }));

  window.mineFieldProxy = function(options) {
    var minefield;
    return function proxy(pos) {
      if (!minefield) {
        options.firstPos = pos;
        minefield = new Minefield(options);
      }
      return minefield.reveal(pos);
    };
  };

})();
