var window = window || this;

(function() {
  var Timer = window.Timer = function Timer(options) {
    this.digital = options.digital;
    this.ctx = options.ctx;
  };

  Timer.dt = 0.25;

  Timer.prototype = {
    start: function() {
      this._time0 = Date.now();
      var ctx = this.ctx;
      var draw = this.digital.draw;
      setInterval(function() {
        draw(ctx, this.elapsed());
      }.bind(this), Timer.dt * 1000);
    },
    elapsed: function() {
      return (Date.now() - this._time0) / 1000;
    }
  };

})();
