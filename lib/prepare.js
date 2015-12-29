var window = window || this;

(function() {
  'use strict';

  var prepare = window.prepare = function prepare(options) {
    var imgDigits = window.imgDigits = new Image();
    imgDigits.src = 'assets/digits.png';
    imgDigits.addEventListener('load', function () {

      var imgTiles = window.imgTiles = new Image();
      imgTiles.src = 'assets/tiles.png';
      imgTiles.addEventListener('load', function() {

        var imgFaces = window.imgFaces = new Image();
        imgFaces.src = 'assets/faces_glyph.jpg';
        imgFaces.addEventListener('load', function() {

          var view = window.view = new View({
            document: options.document,
            canvas: options.canvas,
            timer_canvas: options.timer_canvas,
            score_canvas: options.score_canvas,
            resetButton: options.resetButton,
            files: {
              'digits': imgDigits, 'faces': imgFaces, 'tiles': imgTiles
            }
          });
          view.draw();

        });
      });
    });
  };

})();
