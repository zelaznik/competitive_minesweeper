(function() {
  'use strict';

  var timerId = 0;

  var Timer = window.Timer = function Timer(options) {
    this.tempName = options.tempName;

    Digital.call(this, options);
    this.prev = 0;
    this.running = false;
    this.canvas = options.canvas;
    this.canvas.height = this.height;
    this.canvas.width = this.width;
  };

  Timer.inherits(Digital, {
    valueOf: function() {
      return this.elapsed();
    },

    dt: function() {
      var t = this._timeF || Date.now();
      this._t = t;
      this._dt = (t - this.t0) / 1000;
      return this._dt;
    },

    _start: function() {
      this.t0 = Date.now();
      delete this._timeF;
      this.running = true;
    },

    _stop: function() {
      this._timeF = Date.now();
      this.prev += this.dt();
      delete this.t0;
      this.running = false;
    },

    _reset: function() {
      delete this._timeF;
      delete this._time0;
      this.prev = 0;
    },

    start: function() {
      this._reset();
      this._start();
    },


    stop: function() {
      this._stop();
    },

    reset: function() {
      this._stop();
      this._reset();
    },

    elapsed: function() {
      return this.prev + (this.dt() || 0);
    }

  });
})();
