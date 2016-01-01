(function() {
  'use strict';

  window.MainView = function MainView(options) {
    View.call(this, options);
    this.addListeners(options);
  };

  MainView.inherits(View, {
    addListeners: function(options) {
      // Don't need to run this twice in case a game is reset.
      if (this._listenersAdded) {
        return;
      }

      var view = this;
      var mouseDown = {left: false, right: false};

      var isPressed = {};
      var choices = view.menu.getElementsByClassName('level-choice');

      var addListenerTo = function(choice) {
        var levelName = choice.getAttribute('name');
        choice.addEventListener('click', function(e) {
          for (var j=0; j<choices.length; j++) {
            choices[j].classList.remove('active');
          }
          e.currentTarget.classList.add('active');
          view.reset({level: levelName});
        });
      };
      for (var i=0; i<choices.length; i++) {
        addListenerTo(choices[i]);
      }

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
      var dbg = function(action, callback) {
        // Only use this function for debugging purposes.
        view.canvas.addEventListener(action, function(e) {
          // console.log((++clickId) + ") " + action + ": button(" + button(e) + "), buttons(" + buttons(e) + "), status: " + JSON.stringify(mouseDown));
          callback(e);
        });
      };

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

      dbg('contextmenu', function(e) {
        e.preventDefault();
        var btn = button(e);
        if (btn === 'left' || !mouseDown.left) {
          view.toggleFlagOrSweep(e);
        }
      });

      dbg('click', function(e) {
        view.reveal(e);
      });

      dbg('mousedown', function(e) {
        var btn = button(e);
        mouseDown[btn] = true;
        if (mouseDown.left && !e.ctrlKey) {
          view.highlightActive(e, {
            includeNeighbors: !!mouseDown.right
          });
          resetButton.classList.add('open-mouth');
        }
      });

      dbg('mouseup', function(e) {
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
