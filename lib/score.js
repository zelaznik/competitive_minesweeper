var window = window || this;

(function() {
  var Score = window.Score = function Score(options) {
    Digital.call(this, options);
  };

  Score.inherits(Digital, {
    valueOf: function() {
      return 99;
    }
  });

})();
