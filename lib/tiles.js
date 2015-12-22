var window = window || this;

(function() {
  'use strict';

  var Tiles = window.Tiles = function Tiles(options) {
    this.img = options.img;
    this.game = options.game;
    this.rowCt = this.game.rowCt;
    this.colCt = this.game.colCt;

    this.srcWidth = options.width || options.srcWidth;
    this.srcHeight = options.height || options.srcHeight;
    this.dstWidth = options.width || options.dstWidth;
    this.dstHeight = options.height || options.dstHeight;
  };

  Tiles.lookups = {
    'undefined': {r:0, c:0},
    'flag': {r:0, c:1},
    'bomb': {r:0, c:2},
    '0': {r: 0, c:3},
    '1': {r: 1, c:0},
    '2': {r: 1, c:1},
    '3': {r: 1, c:2},
    '4': {r: 1, c:3},
    '5': {r: 2, c:0},
    '6': {r: 2, c:1},
    '7': {r: 2, c:2},
    '8': {r: 2, c:3}
  };

  Tiles.prototype = {
    get width() {
      return this.dstWidth * this.colCt;
    },
    get height() {
      return this.dstHeight * this.rowCt;
    },
    srcX: function(ones) {
      return (ones % 5) * this.srcWidth;
    },
    srcY: function(ones) {
      return Math.floor(ones / 5) * this.srcHeight;
    },
    dstX: function(place) {
      return (this.digitCt - place - 1) * (this.dstWidth);
    },
    dstY: function(place) {
      return 0;
    },

    draw: function(ctx) {
      var get = this.game.get;
      var lookups = Tiles.lookups;
      for (var r=0, rMax=this.rowCt; r<rMax; r++) {
        for (var c=0, cMax=this.colCt; c<cMax; c++) {
          var pos = {r:r, c:c};
          var val = get(pos);

          var src = {
            r: lookups[val].r * this.srcHeight,
            c: lookups[val].c * this.srcWidth
          };
          var dst = {
            r: r * this.dstHeight,
            c: c * this.dstWidth
          };
          ctx.drawImage(this.img,
            src.c, src.r, this.srcWidth, this.srcHeight,
            dst.c, dst.r, this.dstWidth, this.dstHeight
          );
        } // next column
      } // next row
    } // end draw function
  };

})();
