var window = window || this;

var singleDigit = window.singleDigit = function(value, place) {
  // Returns the nth digit of a number
  var pow10 = Math.pow(10, -place);
  var size = Math.abs(value);
  return Math.floor(size * pow10) % 10;
};

var Digital = window.Digital = function Digital(options) {
  this.img = options.img;
  this.srcWidth = options.width;
  this.srcHeight = options.height;
  this.dstWidth = options.dstWidth || this.srcWidth;
  this.dstHeight = options.dstHeight || this.srcHeight;
  this.digitCt = (options.maxDigits || 3);
};

Digital.prototype = {
  get width() {
    return this.dstWidth * this.digitCt;
  },

  get height() {
    return this.dstHeight;
  },

  valueOf: function() {
    throw "NotImplemented";
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
