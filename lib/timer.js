var window = window || this;

(function() {
  'use strict';
  
  var Timer = window.Timer = function Timer(options) {
    Digital.call(this, options);
    this.prev = 0;
  };

  Timer.inherits(Digital, {
    valueOf: function() {
      return this.elapsed();
    },

    dt: function() {
      var t = this._timeF || Date.now();
      return (t - this.t0) / 1000;
    },

    start: function() {
      this.t0 = Date.now();
      delete this._timeF;
    },

    stop: function() {
      this._timeF = Date.now();
      this.prev += this.dt();
      delete this.t0;
    },

    reset: function() {
      this.stop();
      delete this._timeF;
      delete this._time0;
      this.prev = 0;
    },

    elapsed: function() {
      return this.prev + (this.dt() || 0);
    }

  });
})();
