var window = window || this;

(function() {
  'use strict';

  window.logTime = function(callback, name) {
    var t0 = Date.now();
    var result = callback();
    var ms = Date.now() - t0;
    console.log(name + " took " + ms + " millisec to run.");
    return result;
  };

  Function.prototype.inherits = function(Parent, options) {
    var Child = this;
    function Surrogate() {}
    Surrogate.prototype = Parent.prototype;
    Child.prototype = new Surrogate();
    Child.prototype.name = Child.name;
    Child.prototype.constructor = Child;
    for (var key in options) {
      Child.prototype[key] = options[key];
    }
  };

})();
