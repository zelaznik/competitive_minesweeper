(function() {
  'use strict';

  var mineSweeperBoard = window.mineSweeperBoard = function mineSweeperBoard(options) {
    /* The HTML should look like this:
      <div id="main" class="game border-convex">
        <div id="aux" class="aux border-concave">
          <canvas class='aux-item score-canvas' id="main-score-canvas"></canvas>
          <canvas class="aux-item faces" id="main-faces-button"></canvas>
          <canvas class='aux-item timer-canvas' id="main-timer-canvas"></canvas>
        </div>
        <canvas class="board border-concave" id="main-board-canvas"></canvas>
      </div> <!-- End main -->
    */

    throw "NotImplemented";

    var document = document || options.document;
    var height = options.height || '256px';
    var width = options.width || '480px';
    var category = options.category;

    var $div = $('<div id="' + category + '" class="game border-convex"></div>');
    $div.attr('style', 'width: ' + width + ';');

      var $aux = $('<div class="aux border-concave"></div>');
      $div.append($aux);

        var $score = $('<canvas class="aux-item score-canvas"></canvas>');
        $aux.append($score);

        var $faces = $('<canvas class="aux-item faces"></canvas>');
        $faces.attr('id', category + '-faces-button');
        $aux.append($faces);

        var $timer = $('<canvas class="aux-item timer-canvas"></canvas>');
        $timer.attr('id', category + '-timer-canvas');
        $aux.append($timer);

      var $board = $('<canvas class="board border-concave"></canvas>');
      $board.attr('id', category + '-board-canvas');
      $div.append($board);

      return {
        main: $div, canvas: $board, resetButton: $faces,
        aux: $aux, timer_canvas: $timer, score_canvas: $score
      };
  };

  var respondToButtons = window.respondToButtons = function(options) {
    var choices = document.getElementsByClassName('level-choice');
    var views = options.views;

    var addListenerTo = function(choice) {
      var levelName = choice.getAttribute('name');
      choice.addEventListener('click', function(e) {
        for (var j=0; j<choices.length; j++) {
          choices[j].classList.remove('active');
        }
        e.currentTarget.classList.add('active');
        views.forEach(function(view) {
          view.reset({level: levelName});
        });
      });
    };

    for (var i=0; i<choices.length; i++) {
      addListenerTo(choices[i]);
    }

  };

  var prepare = window.prepare = function prepare(options) {

    var imgDigits, imgTiles, imgFaces, remainingCt = 0;
    var views = options.views;

    var afterAllImagesLoaded = function() {
      remainingCt--;
      if (remainingCt > 0) {
        return;
      }
      view.draw();
      views.push(view);
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

    var view = new options.viewType(
      merge(options, {
        files: {
          'digits': imgDigits, 'faces': imgFaces, 'tiles': imgTiles
        }
      })
    );

    view.draw();
    return view;
  };

})();
