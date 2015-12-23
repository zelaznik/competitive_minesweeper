var window = window || this;

(function() {
  'use strict';


  var prepare = window.prepare = function prepare(options) {

    var game = new Game({rowCt: Game.ROW_CT,
    colCt: Game.COL_CT, mineCt: Game.MINE_CT});

    var imgDigits = window.imgDigits = new Image();
    imgDigits.src = 'assets/digits_glyph.png';
    imgDigits.addEventListener('load', function () {

      var imgTiles = window.imgTiles = new Image();
      imgTiles.src = 'assets/minesweeper_tiles.jpg';
      imgTiles.addEventListener('load', function() {

        var imgFaces = window.imgFaces = new Image();
        imgFaces.src = 'assets/faces_glyph.jpg';
        imgFaces.addEventListener('load', function() {

          var view = window.view = new View({
            document: options.document,
            canvas: options.canvas, game: game,
            files: { 'digits': imgDigits,
            'tiles': imgTiles, 'faces': imgFaces}
          });
          view.start();
        });
      });
    });
  };

})();
