(function() {
  'use strict';

  window.updatePct = function updatePct($status, newValue, millisec, callback) {
    /* millisec is the number of ms to change from 100% to 0% */
    $status.stop();
    callback = callback || function() {};
    var pctStr = parseStyle($status.attr('style')).width;
    var oldPct = +pctStr.replace(' ','').replace('%','') / 100;
    if (!millisec) {
      $status.css({width: formatPct(newValue)});
    } else {
      var dt = Math.abs(newValue - oldPct) * millisec;
      $status.animate({width: formatPct(newValue)}, dt);
    }
  };

})();
