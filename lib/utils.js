var window = window || this;

(function() {
  'use strict';

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
