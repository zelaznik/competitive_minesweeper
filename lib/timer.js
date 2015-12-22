var window = window || this;

(function() {
  var Timer = window.Timer = function Timer(options) {
    this.digital = options.digital;
    this.ctx = options.ctx;
    this.prev = 0;
  };

  Timer.dt = 0.02;

  Timer.prototype = {
    get t() {
      return this._timeF || Date.now();
    },

    get dt() {
      return (this.t - this.t0) / 1000;
    },

    start: function() {
      this.t0 = Date.now();
      delete this._timeF;
      this._draw = this.draw.bind(this);
      setInterval(this._draw, Timer.dt * 1000);
    },

    stop: function() {
      if (!(this._draw)) {
        return;
      }
      this._timeF = Date.now();
      this.prev += this.dt;
      clearInterval(this._draw);
      delete this.t0;
      delete this._draw;
      this.draw();
    },

    reset: function() {
      this.stop();
      delete this._timeF;
      delete this._time0;
      this.prev = 0;
      clearInterval(this._draw);
      delete this._draw;
      this.draw();
    },

    elapsed: function() {
      return this.prev + (this.dt || 0);
    },

    draw: function() {
      this.digital.draw(this.ctx, this.elapsed());
    }
  };

})();
