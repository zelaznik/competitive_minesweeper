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
    var firstIndex = firstPos ? this.toIndex(firstPos) : null;

    for (r=0; r<this.rowCt; r++) {
      for (c=0; c<this.colCt; c++) {
        pos = {r:r, c:c};
        i = this.toIndex(pos);
        if (i !== firstIndex) {
          cells.push(pos);
        }
      }
    }

    for (m = 0; m < this.mineCt; m++) {
      i = Math.floor(Math.random() * cells.length);
      this.set(cells[i], true);
      cells = cells.slice(0,i).concat(cells.slice(i+1));
    }

    // Calculate in advance all the
    // numbers of adjacent mines for each cell.
    b = new Grid(this);
    for (i in cells) {
      b.set(cells[i], this.generateNearby(cells[i]));
    }

    this.nearbyCount = function(pos) {
      return b.get(pos);
    };
  };

  Minefield.inherits(Grid, {
    reveal: function(pos) {
      var hasMine = (this.get(pos) === -1);
      return {
        mine: hasMine,
        state: (hasMine) ? this.data() : null,
        nearbyCount: this.nearbyCount(pos),
        neighbors: this.neighbors(pos)
      };
    },

    generateNearby: function(pos) {
      // Calculates the number of neighbors with mines underneath.
      var count = 0;
      this.neighbors(pos).forEach(function(cell) {
        count += !!this.get(cell);
      }.bind(this));
      return count;
    }
  });

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
