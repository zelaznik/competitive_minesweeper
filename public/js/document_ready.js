document.addEventListener("DOMContentLoaded", function() {
  var competitiveMode = true;
  var mainView, opponentView;
  var mainViewType;
  var views = [];

  function getBoard(category) {
    return {
      main: document.getElementById(category),
      canvas: document.getElementById(category + '-board-canvas'),
      resetButton: document.getElementById(category + '-faces-button'),
      timer_canvas: document.getElementById(category + '-timer-canvas'),
      score_canvas: document.getElementById(category + '-score-canvas')
    };
  }

  var defaultViewParams = {
    views: views,
    document: document,
    aux: document.getElementById('aux'),
    menu: document.getElementById('cssmenu'),
    body: document.getElementsByTagName('body')[0]
  };

  if (competitiveMode) {
    opponentView = window.opponentView = prepare(
      merge(defaultViewParams, getBoard('opponent'), {
        viewType: RobotView
      })
    );
  }

  if (competitiveMode) {
    mainViewType = CompetitivePlayerView;
  } else {
    mainViewType = SoloPlayerView;
  }
  // Load your own board.
  mainView = window.mainView = prepare(
    merge(defaultViewParams, getBoard('main'), {
      viewType: mainViewType
    })
  );

  if (competitiveMode) {
    mainView.setOpponentView(opponentView);
    opponentView.setOpponentView(mainView);
    document.getElementById('opponent').classList.remove('hidden');

  } else {
    document.getElementById('opponent').classList.add('hidden');
  }

  // Group the buttons that select the difficulty level
  respondToNewDifficulty({
    views: views,
    document: document,
    choices: document.getElementsByClassName('level-choice')
  });

  respondToNewGameType({
    views: views,
    document: document,
    opponentView: opponentView,
    opponentCanvas: document.getElementById('opponent'),
    choices: document.getElementsByClassName('game-type-choice')
  });

});
