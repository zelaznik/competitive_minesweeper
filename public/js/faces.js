var window = window || this;

(function() {
  'use strict';

  var Faces = window.Faces = function Faces(options) {
    this.img = options.img;
    this.game = options.game;
    this.rowCt = this.game.rowCt;
    this.colCt = this.game.colCt;
    this.canvas = options.canvas;

    this.srcWidth = options.width || options.srcWidth;
    this.srcHeight = options.height || options.srcHeight;
    this.dstWidth = options.width || options.dstWidth;
    this.dstHeight = options.height || options.dstHeight;

    this.width = this.dstWidth;
    this.height = this.dstHeight;
  };

  Faces.lookups = {
    'smile': {r:0, c:0},
    'open': {r:0, c:1},
    'glasses': {r:1, c:0},
    'frown': {r: 1, c:1},
    'active': {r:2, c:0}
  };

  Faces.prototype = {
    draw: function(ctx) {
      var srcHeight = this.srcHeight;
      var srcWidth = this.srcWidth;
      var dstHeight = this.dstHeight;
      var dstWidth = this.dstWidth;
      var get = this.game.get.bind(this.game);
      var lookups = Faces.lookups;
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
  }; // end Faces prototype

})();
