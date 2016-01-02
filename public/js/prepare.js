(function() {
  'use strict';

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

    var view = new options.viewType({
      document: options.document,
      canvas: options.canvas,
      opponentView: options.opponentView,
      menu: options.menu,
      body: options.body,
      aux: options.aux,
      timer_canvas: options.timer_canvas,
      score_canvas: options.score_canvas,
      resetButton: options.resetButton,
      main: options.main,
      files: {
        'digits': imgDigits, 'faces': imgFaces, 'tiles': imgTiles
      }
    });
    return view;
  };

})();
