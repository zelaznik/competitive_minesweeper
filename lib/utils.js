var window = window || this;

(function() {
  'use strict';

  window.logTime = function logTime(callback, name) {
    return function() {
      var t0 = Date.now();
      var result = callback.apply(this, arguments);
      var ms = Date.now() - t0;
      if (ms > 1) {
        var finalName = (name || callback.name);
        var msg = ms + " ms to run '" + finalName + "'";
        if (arguments.length > 0) {
          var args = [].slice.call(arguments);
          msg += ' with arguments: ' + JSON.stringify(args);
        }
        console.log(msg);
      }
      return result;
    };
  };

  window.addTimerToAll = function(obj) {
    var modified = {};
    for (var name in obj) {
      modified[name] = logTime(obj[name], name);
    }
    return modified;
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
