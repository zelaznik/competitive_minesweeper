(function() {
  'use strict';
  var window = window || this;

  function surrogateOf(Parent, options) {
    function Surrogate() {}
    Surrogate.prototype = Parent.prototype;
    Child.prototype = new Surrogate();
    Child.prototype.constructor = Child;
    for (var key in options) {
      Child.prototype[key] = options[key];
    }
  }

})();
