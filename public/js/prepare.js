(function() {
  'use strict';

  var respondToNewDifficulty = window.respondToNewDifficulty = function(options) {
    var choices = options.choices;
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

  var respondToNewGameType = window.respondToNewGameType = function(options) {
    var opponentProgressBar = options.opponentProgressBar;
    var opponentCanvas = options.opponentCanvas;
    var opponentView = options.opponentView;
    var choices = options.choices;
    var views = options.views;

    var addListenerTo = function(choice) {
      var gameType = choice.getAttribute('name');
      choice.addEventListener('click', function(e) {
        for (var j=0; j<choices.length; j++) {
          choices[j].classList.remove('active');
        }
        e.currentTarget.classList.add('active');
        views.forEach(function(view) {
          view.reset();
        });
        opponentView.setActive((gameType !== 'solo'));
        opponentCanvas.setAttribute('game-type', gameType);
        opponentProgressBar.setAttribute('game-type', gameType);
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
