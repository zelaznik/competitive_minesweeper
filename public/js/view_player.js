(function() {
  'use strict';

  window.CompetitivePlayerView = function CompetitivePlayerView(options) {
    View.call(this, options);
    this.opponentView = options.opponentView;
    this.addListeners(options);
  };

  CompetitivePlayerView.inherits(View, mixin(CompetitiveView, {
    gameType: window.MainGame,

    handlerBase: function(e, callFwd) {
      var pos = this.tiles.calculateCell(e);
      View.prototype.handlerBase.call(this, pos, callFwd);
    },

    onWin: function() {
      View.prototype.onWin.call(this);
      this.body.classList.add('success');
      this.resetButton.classList.add('sunglasses');
    },

    onLose: function() {
      View.prototype.onLose.call(this);
      this.body.classList.add('failure');
      this.resetButton.classList.add('frown');
    },

    addListeners: function(options) {
      // Don't need to run this twice in case a game is reset.
      if (this._listenersAdded) {
        return;
      }

      var view = this;
      var mouseDown = {left: false, right: false};

      // Converts button codes to 'left', 'right', 'middle'.
      var buttonDesc = {'0': 'left', '1': 'middle', '2': 'right'};
      function button(e) {
        return buttonDesc[e.button];
      }

      var buttonsDesc = {'0': 'none', '1': 'left', '2': 'right', '3': 'both'};
      function buttons(e) {
        return buttonsDesc[e.buttons];
      }

      var clickId = 0;
      var resetButton = options.resetButton;
      var on = view.canvas.addEventListener.bind(view.canvas);

      resetButton.addEventListener('click', function(e) {
        resetButton.classList.remove('sunglasses');
        resetButton.classList.remove('open-mouth');
        resetButton.classList.remove('frown');
        mouseDown.left = false;
        mouseDown.right = false;
        view.reset();
      });

      on('mousemove', function(e) {
        if (mouseDown.left) {
          view.highlightActive(e, {includeNeighbors: mouseDown.right});
        }
      });

      on('contextmenu', function(e) {
        e.preventDefault();
        var btn = button(e);
        if (btn === 'left' || !mouseDown.left) {
          view.toggleFlagOrSweep(e);
        }
      });

      on('click', function(e) {
        view.reveal(e);
      });

      on('mousedown', function(e) {
        var btn = button(e);
        mouseDown[btn] = true;
        if (mouseDown.left && !e.ctrlKey) {
          view.highlightActive(e, {
            includeNeighbors: !!mouseDown.right
          });
          if (view.game.begun && !view.game.over) {
            resetButton.classList.add('open-mouth');
          }
        }
      });

      on('mouseup', function(e) {
        var btn = button(e);
        if (mouseDown.left && mouseDown.right) {
          view.sweep(e);
        }
        resetButton.classList.remove('open-mouth');
        mouseDown[btn] = false;
        view.draw();
      });

      this._listenersAdded = true;
    },

    highlightActive: function(e, options) {
      if (this.game.over) {
        return;
      }

      var includeNeighbors = options && !!options.includeNeighbors;

      var pos = this.tiles.calculateCell(e);
      this.draw();

      this.tiles.drawSingle(pos, this.ctx, {active: true});
      if (includeNeighbors) {
        for (var dr=-1; dr<2; dr++) {
          for (var dc=-1; dc<2; dc++) {
            var coord = {r: pos.r + dr, c: pos.c + dc};
            if (this.game.inRange(coord)) {
              this.tiles.drawSingle(coord, this.ctx, {active: true});
            }
          } // next col
        } //next row
      } // end neighbors clause
    }
  }));

})();
