var window = window || this;

(function() {
  'use strict';

  var Minefield = window.Minefield = function Minefield(options) {
    Grid.call(this, options);
    this.mineCt = options.mineCt;

    // Populates the mine field after the first click.
    // The first cell clicked can never contain a mine.
    var r, c, m, i, pos, iMax;

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
  };

  Minefield.inherits(Grid, {
    toString: function() {
      var v, pos;
      var rows = [];
      for (var r=0; r<this.rowCt; r++) {
        var cols = [];
        for (var c=0; c<this.colCt; c++) {
          pos = {r: r, c: c};
          if (this.get(pos)) {
            v = 'X';
          } else {
            v = '' + this.nearbyCount(pos);
          }
          cols.push(v);
        }
        console.log(cols);
        rows.push(cols);
      }
      return rows;
    },

    reveal: function(pos) {
      if (!field.inRange(pos)) {
        throw new RangeError("Invalid position: " + JSON.stringify(pos));
      }

      var hasMine = !!field.get(pos);
      return {
        mine: hasMine,
        state: (hasMine) ? field.values : null,
        nearbyCount: field.nearbyCount(pos),
        neighbors: field.neighbors(pos)
      };
    },

    nearbyCount: function(pos) {
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
