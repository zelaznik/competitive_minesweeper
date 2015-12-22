var window = window || this;

(function() {
  'use strict';

  var Group2D = window.Digital = function Group2D(options) {
    this.img = options.img;
    this.srcWidth = options.srcWidth || options.width;
    this.srcHeight = options.srcHeight || options.height;
    this.dstWidth = options.dstWidth || options.width;
    this.dstHeight = options.dstHeight || options.width;

    this._rowCt = options.rowCt;
    this._colCt = options.colCt;
  };

  Group2D.prototype = {
    get width() {
      return this.dstWidth * this.colCt;
    },

    get height() {
      return this.dstHeight * this.rowCt;
    },

    get rowCt() {
      return this._rowCt;
    },

    get colCt() {
      return this._colCt;
    }

    draw: function(ctx) {
      var pStart = this.digitCt - 1;
      for (var p = pStart; p>=0; p--) {
        var d = singleDigit(this, p);
        ctx.drawImage(this.img,
          this.srcX(d), this.srcY(d), this.srcWidth, this.srcHeight,
          this.dstX(p), this.dstY(p), this.dstWidth, this.dstHeight
        );
      }
    }
  };

})();
