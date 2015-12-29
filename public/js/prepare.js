var window = window || this;

(function() {
  'use strict';

  var prepare = window.prepare = function prepare(options) {
    var imgDigits, imgTiles, imgFaces, remainingCt = 0;

    var afterAllImagesLoaded = function() {
      remainingCt--;
      if (remainingCt > 0) {
        return;
      }
      var view = window.view = new View({
        document: options.document,
        canvas: options.canvas,
        timer_canvas: options.timer_canvas,
        score_canvas: options.score_canvas,
        resetButton: options.resetButton,
        main: options.main,
        files: {
          'digits': imgDigits, 'faces': imgFaces, 'tiles': imgTiles
        }
      });
      view.draw();
    };

    imgDigits = window.imgDigits = new Image();
    imgDigits.src = 'images/digits.png';
    remainingCt++;
    imgDigits.addEventListener('load', afterAllImagesLoaded);

    imgTiles = window.imgTiles = new Image();
    imgTiles.src = 'images/tiles.png';
    remainingCt++;
    imgTiles.addEventListener('load', afterAllImagesLoaded);

    imgFaces = window.imgFaces = new Image();
    imgFaces.src = 'images/faces.png';
    remainingCt++;
    imgFaces.addEventListener('load', afterAllImagesLoaded);

  };

})();
