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
    this.decimalCt = Math.abs(options.decimalCt || 0);
  };

  Digital.prototype = {
    get width() {
      if (!this.decimalCt) {
        return this.dstWidth * this.digitCt;
      } else {
        return this.dstWidth * (this.digitCt + 0.5 + this.decimalCt);
      }
    },

    get height() {
      return this.dstHeight * this.rowCt;
    },

    get rowCt() {
      return 1;
    },

    get colCt() {
      if (!this.decimalCt) {
        return this.digitCt;
      } else {
        return this.digitCt + 1 + Math.abs(this.decimalCt);
      }
    },

    srcX: function(ones) {
      return (ones % 5) * this.srcWidth;
    },

    srcY: function(ones) {
      return Math.floor(ones / 5) * this.srcHeight;
    },

    dstX: function(place) {
      var n = (this >= 0) ? 1 : 2;
      var d = (place < 0) ? 1 : 0;
      return (this.digitCt - place - n + d) * (this.dstWidth);
    },

    dstY: function(place) {
      return 0;
    },

    decSrcX: function() {
      return 5 * this.srcWidth;
    },

    decSrcY: function() {
      return 0 * this.srcHeight;
    },

    decSrcWidth: function() {
      return this.srcWidth * 0.5;
    },

    decDstWidth: function() {
      return this.dstWidth * 0.5;
    },

    negSrcX: function() {
      return 5 * this.srcWidth;
    },

    negSrcY: function() {
      return 1 * this.srcHeight;
    },

    draw: function(ctx) {
      var negative, p, pStart, pEnd, d, h, s;
      negative = (this<0);

      if (this < 0) {
        h = 1;
        pStart = this.digitCt - 2;
        // Draw minus sign;
        s = 0;
        p = this.digitCt - 1;
        ctx.drawImage(this.img,
          this.negSrcX(), this.negSrcY(), this.srcWidth, this.srcHeight,
          s * this.dstWidth, 0, this.dstWidth, this.dstHeight
        );

      } else {
        h = 0;
        s = -1;
        pStart = this.digitCt - 1;
      }

      for (p = pStart; p>=0; p--) {
        d = singleDigit(this, p);
        s = s + 1;
        ctx.drawImage(this.img,
          this.srcX(d),   this.srcY(d),   this.srcWidth, this.srcHeight,
          s * this.dstWidth, 0, this.dstWidth, this.dstHeight
        );
      }

      if (this.decimalCt === 0) {
        return;
      }

      s = s + 1;
      ctx.drawImage(this.img,
        this.decSrcX(), this.decSrcY(),   this.srcWidth, this.srcHeight,
        s * this.dstWidth, 0, this.decDstWidth(), this.dstHeight
      );
      s = s - 0.5;

      for (p = 1; p<=this.decimalCt; p++) {
        s = s + 1;
        d = singleDigit(this, -p);
        ctx.drawImage(this.img,
          this.srcX(d), this.srcY(d), this.srcWidth, this.srcHeight,
          s * this.dstWidth, 0, this.dstWidth, this.dstHeight
        );
      }
    }
  };

})();
