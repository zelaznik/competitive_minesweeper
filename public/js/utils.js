(function() {
  'use strict';

  var pk = 0;
  window.debug = function(message) {
    return pk++ + ' ' + message;
  };

  window.shuffle = function(arr) {
    for (var i=0, n=arr.length; i<n; i++) {
      var j = Math.floor((n - i) * Math.random());
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }

    return arr;
  };

  window.makeGrey = function(color) {
    var pure, red, green, blue, grey, asHex;
    pure = color.replace('#', '');
    red = parseInt(pure.slice(0, 2), 16);
    green = parseInt(pure.slice(2, 4), 16);
    blue = parseInt(pure.slice(4, 6), 16);
    grey = 0.3 * red  + 0.59 * green + 0.11 * blue;
    return grey;
  };

  window.blackAndWhite = function(color) {
    var asGrey, asHex;
    asGrey = makeGrey(color);
    asHex = (Math.round(grey)).toString(16).toUpperCase();
    return '#' + asHex + asHex + asHex;
  };

  window.hue = function(origColor, weights) {
    var r = weights.r || weights.red;
    var g = weights.r || weights.green;
    var b = weights.b || weights.blue;
  };

  window.superClass = function superClass(obj) {
    return Object.getPrototypeOf(Object.getPrototypeOf(obj));
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

  window.mixin = function mixin() {
    var output = {};
    for (var i in arguments) {
      var dct = arguments[i];
      for (var key in dct) {
        output[key] = dct[key];
      }
    }
    return output;
  };

})();
