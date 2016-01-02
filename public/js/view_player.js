(function() {
  'use strict';

  window.MainView = function MainView(options) {
    View.call(this, options);
    this.addListeners(options);
  };

  MainView.inherits(View, {
    gameType: window.MainGame,

    start: function() {
      View.prototype.start.call(this, options);
    },

    stop: function(options) {
      View.prototype.stop.call(this, options);
    },

    reset: function(newOptions) {
      View.prototype.reset.call(this, newOptions);
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
          resetButton.classList.add('open-mouth');
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
  });

})();
