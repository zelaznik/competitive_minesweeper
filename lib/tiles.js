var window = window || this;

(function() {
  'use strict';

  var Tiles = window.Tiles = function Tiles(options) {
    this.img = options.img;
    this.game = options.game;
    this.rowCt = this.game.rowCt;
    this.colCt = this.game.colCt;
    this.canvas = options.canvas;

    this.srcWidth = options.width || options.srcWidth;
    this.srcHeight = options.height || options.srcHeight;
    this.dstWidth = options.width || options.dstWidth;
    this.dstHeight = options.height || options.dstHeight;

    this.dX = (this.canvas.width - this.width) / 2;
    this.dY = 50;
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
    '8': {r: 2, c:3},
    'exploded': {r:3, c:0},
    'falseflag': {r:3, c:1},
    'active': {r:0, c:3},
  };

  Tiles.prototype = {
    calculateCell: function(e) {
      var dx1 = e.offsetX - this.dX;
      var dy1 = e.offsetY - this.dY;
      var d = {
        r: Math.floor(dy1 / this.dstHeight),
        c: Math.floor(dx1 / this.dstWidth)
      };
      return d;
    },

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

    setFalseFlags: function(options) {
      var no_mine_at = options.not_a_mine;
      var callback = options.callback;
      for (var r=0, rMax=this.rowCt; r<rMax; r++) {
        for (var c=0, cMax=this.colCt; c<cMax; c++) {
          var pos = {r: r, c: c};
          if (this.get(pos) === 'flag' && no_mine_at(pos)) {
            this.set(pos, 'falseflag');
            callback(pos);
          }
        }
      }
    },

    drawSingle: function(pos, ctx, options) {
      var lkp, src, dst, val;
      val = this.game.get(pos);
      if (options && options.active) {
        val = val || 'active';
      }
      lkp = Tiles.lookups[val];
      src = {
        r: lkp.r * this.srcHeight,
        c: lkp.c * this.srcWidth
      };
      dst = {
        r: this.dY + pos.r * this.dstHeight,
        c: this.dX + pos.c * this.dstWidth
      };

      ctx.drawImage(this.img,
        src.c, src.r, this.srcWidth, this.srcHeight,
        dst.c, dst.r, this.dstWidth, this.dstHeight
      );
    }, // end drawSingle function

    draw: function(ctx) {
      var srcHeight = this.srcHeight;
      var srcWidth = this.srcWidth;
      var dstHeight = this.dstHeight;
      var dstWidth = this.dstWidth;
      var get = this.game.get.bind(this.game);
      var lookups = Tiles.lookups;
      var img = this.img;

      for (var r=0, rMax=this.rowCt; r<rMax; r++) {
        for (var c=0, cMax=this.colCt; c<cMax; c++) {
          var pos = {r: r, c: c};
          var val = get(pos);
          var lkp = lookups[val];
          var src = {
            r: lkp.r * srcHeight,
            c: lkp.c * srcWidth
          };
          var dst = {
            r: r * dstHeight,
            c: c * dstWidth
          };
          ctx.drawImage(img,
            src.c, src.r, srcWidth, srcHeight,
            dst.c, dst.r, dstWidth, dstHeight
          );
        } // next column
      } // next row
    } // end draw function
  }; // end Tiles prototype

})();
