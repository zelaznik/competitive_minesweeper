var window = window || this;

(function() {
  var singleDigit = window.singleDigit = function(value, place) {
    // Returns the nth digit of a number
    var pow10 = Math.pow(10, -place);
    var size = Math.abs(value);
    return Math.floor(size * pow10) % 10;
  };

  var Digital = window.Digital = function Digital(options) {
    this.img = options.img;
    this.width = options.width;
    this.height = options.height;
    this.digitCt = (options.maxDigits || 3);
    this.decimalCt = -Math.abs(options.minDigits || 2);
  };

  Digital.prototype = {
    srcX: function(ones) {
      return (ones % 5) * this.width;
    },
    srcY: function(ones) {
      return Math.floor(ones / 5) * this.height;
    },
    dstX: function(place) {
      return (this.digitCt - place - 1) * (this.width);
    },
    dstY: function(place) {
      return 0;
    },
    draw: function(ctx, value) {
      var pStart = this.digitCt - 1;
      var pFinish = this.decimalCt;
      for (var p = pStart; p>=pFinish; p--) {
        var d = singleDigit(value, p);
        ctx.drawImage(this.img,
          this.srcX(d), this.srcY(d), this.width, this.height,
          this.dstX(p), this.dstY(p), this.width, this.height
        );
      }
    }
  };

})();
