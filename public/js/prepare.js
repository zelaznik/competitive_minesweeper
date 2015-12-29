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
        menu: options.menu,
        body: options.body,
        aux: options.aux,
        timer_canvas: options.timer_canvas,
        score_canvas: options.score_canvas,
        resetButton: options.resetButton,
        main: options.main,
        // aux: options.aux,
        files: {
          'digits': imgDigits, 'faces': imgFaces, 'tiles': imgTiles
        }
      });
      view.draw();
    };

    var stage = function(path) {
      var img = new Image();
      img.src = path;
      img.addEventListener('load', afterAllImagesLoaded);
      remainingCt++;
      return img;
    };

    imgDigits = window.imgDigits = stage('images/digits.png');
    imgTiles = window.imgTiles = stage('images/tiles.png');
    imgFages = window.imgFages = stage('images/faces.png');
  };

})();
