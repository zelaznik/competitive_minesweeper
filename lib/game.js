var window = window || this;

(function() {

  var Game = window.Game = function Game(options) {
    Grid.call(this, options);
    this.mineCt = options.mineCt;
    this.flagCt = 0;
  };

  Game.ROW_CT = 16;
  Game.COL_CT = 30;
  Game.MINE_CT = 99;

  Game.inherits(Grid, {
    /*****************************
              Properties
    *****************************/
    minesRemaining: function() {
      return this.mineCt - this.flagCt;
    },

    elapsedTime: function() {
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
