var window = window || this;

(function() {
  'use strict';

  var singleDigit = window.singleDigit = function(value, place) {
    // Returns the nth digit of a number
    var pow10 = Math.pow(10, -place);
    var size = Math.abs(value);
    return Math.floor(size * pow10) % 10;
  };

  var Digital = window.Digital = function Digital(options) {
    this.img = options.img;
    this.srcWidth = options.srcWidth || options.width;
    this.srcHeight = options.srcHeight || options.height;
    this.dstWidth = options.dstWidth || options.width;
    this.dstHeight = options.dstHeight || options.width;
    this.digitCt = (options.maxDigits || 3);
    this.decimalCt = -Math.abs(options.decimalCt || 0);
  };

  Digital.prototype = {
    get width() {
      return this.dstWidth * this.colCt;
    },

    get height() {
      return this.dstHeight * this.rowCt;
    },

    get rowCt() {
      return 1;
    },

    get colCt() {
      return this.digitCt;
    },

    srcXminus: function() {
      return 5 * this.srcWidth;
    },

    srcYminus: function() {
      return 1 * this.srcHeight;
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
      var negative, p, pStart, d;
      negative = (this<0);

      if (negative) {
        ctx.drawImage(this.img,
          this.srcXminus(), this.srcYminus(), this.srcWidth, this.srcHeight,
          0, 0, this.dstWidth, this.dstHeight
        );
        pStart = this.digitCt - 2;
      } else {
        pStart = this.digitCt - 1;
      }

      for (p = pStart; p>=0; p--) {
        d = singleDigit(this, p);
        ctx.drawImage(this.img,
          this.srcX(d), this.srcY(d), this.srcWidth, this.srcHeight,
          this.dstX(p), this.dstY(p), this.dstWidth, this.dstHeight
        );
      }

      if (!this.decimalCt) { return; }
    }
  };

})();
