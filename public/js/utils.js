var window = window || this;

(function() {
  'use strict';

  window.blackAndWhite = function(color) {
    var pure, red, green, blue, grey, asHex;
    pure = color.replace('#', '');
    red = parseInt(pure.slice(0, 2), 16);
    green = parseInt(pure.slice(2, 4), 16);
    blue = parseInt(pure.slice(4, 6), 16);
    grey = 0.3 * red  + 0.59 * green + 0.11 * blue;
    asHex = (Math.round(grey)).toString(16).toUpperCase();
    return '#' + asHex + asHex + asHex;
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
