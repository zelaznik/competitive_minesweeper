(function() {
  var Minesweeper = window.Minesweeper = window.Minesweeper || {};

  var Game = Minesweeper.Game = function(options) {
    this.img = options.img;
  };

  Game.prototype = surrogateOf(Grid, {
    /*****************************
              Properties
    *****************************/
    get minesReminaing() {
      return this.minefield.mineCt - this.flagCount;
    },

    get elapsedTime() {
      var millisec = (Date.now() - this.startTime);
      return Math.round(millisec / 1000);
    },

    /*****************************
              Methods
    *****************************/
    start: function() {
      this.startTime = Date.now();
    },

    flag: function(pos) {
      this.flagged[this.toIndex(pos)] = true;
      this.flagCount++;
    },

    unflag: function(pos) {
      delete this.flagged[this.toIndex(pos)];
      this.flagCount--;
    },

    click: function(pos) {
      var x = 3;
    },
  }); // End Prototype

})();
