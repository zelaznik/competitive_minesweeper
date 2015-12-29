var window = window || this;

(function() {
  'use strict';

  var View = window.View = function View(options) {
    this.options = options = options || {};

    var choice = options.menu.getElementsByClassName('active level-choice')[0];
    this.game = options.game = new Game({level: choice.getAttribute('name')});

    this.storeSettings(options);
    this.addSubViews(options);
    this.resizeHTML(options);
    this.addListeners(options);

    this.ctx = this.canvas.getContext('2d');
    this.renderInitialView(options);
  };

  View.zoom = {
    tiles: {
      'beginner': 1.25
    },
    digital: {

    }
  };
  // View.zoom = {
  //   'beginner': {'tiles': 1.00, 'digital': }
  // };
  View.dt = 0.05;

  View.prototype = ({
    storeSettings: function(options) {
      this.main = options.main;
      this.menu = options.menu;
      this.resetButton = options.resetButton;
      this.timer_canvas = options.timer_canvas;
      this.score_canvas = options.score_canvas;

      this.canvas = options.canvas;
      this.score_ctx = this.score_canvas.getContext('2d');
      this.timer_ctx = this.timer_canvas.getContext('2d');
    },

    addSubViews: function(options) {
      var zd = View.zoom.digital[options.level] || 1;
      var digitalOptions = $.extend({
        img: options.files.digits,
        srcWidth: 52, srcHeight: 92,
        dstWidth: zd*18, dstHeight: zd*36,
        game: options.game,
        ctx: options.ctx,
        digitCt: 5
      }, {});

      this.timer = new Timer(
        $.extend(digitalOptions, {canvas: options.timer_canvas})
      );

      this.score = new Score(
        $.extend(digitalOptions, {canvas: options.score_canvas})
      );

      var zt = View.zoom.tiles[options.level] || 1;
      this.tiles = new Tiles({
        img: options.files.tiles,
        srcWidth: 16, srcHeight: 16,
        dstWidth: zt*16, dstHeight: zt*16,
        game: options.game,
        canvas: options.canvas,
        ctx: options.ctx
      });

    },

    resizeHTML: function() {
      this.main.style.width = Math.max(200, this.tiles.width);
    },

    deleteSubViews: function() {
      delete this.tiles;
      delete this.timer;
      delete this.score;
    },

    addListeners: function(options) {
      // Don't need to run this twice in case a game is reset.
      if (this._listenersAdded) {
        return;
      }

      var view = this;
      var mouseDown = {left: false, right: false};

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
      var desc = {'0': 'left', '1': 'middle', '2': 'right'};
      function label(e) {
        return desc[e.button];
      }

      var clickId = 0;
      var dbg = function(action, callback) {
        // Only use this function for debugging purposes.
        view.canvas.addEventListener(action, function(e) {
          console.log((++clickId) + ") " + action + ": " + label(e) + ", status: " + JSON.stringify(mouseDown));
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

      on('contextmenu', function(e) {
        e.preventDefault();
        var btn = label(e);
        if (btn === 'left' || !mouseDown.left) {
          view.toggleFlag(e);
        }
      });

      on('click', function(e) {
        view.reveal(e);
      });

      on('mousedown', function(e) {
        var btn = label(e);
        mouseDown[btn] = true;
        if (mouseDown.left) {
          view.highlightActive(e, {
            includeNeighbors: !!mouseDown.right
          });
          resetButton.classList.add('open-mouth');
        }
      });

      on('mouseup', function(e) {
        var btn = label(e);
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
    },

    renderInitialView: function(options) {
      var ctx = this.ctx;
      ctx.fillStyle = '#88c';
      ctx.fillRect(0, 0, View.WIDTH, View.HEIGHT);
    },

    start: function() {
      this.game.begun = true;
      this.timer.start();
      this._drawTimer = this.drawTimer.bind(this);
      setInterval(this._drawTimer, View.dt * 1000);
    },

    stop: function(options) {
      this.timer.stop();
      clearInterval(this._drawTimer);
      delete this._drawTimer;
    },

    reset: function(newOptions) {
      this.stop();
      this.deleteSubViews();
      delete this.game;
      this.resetButton.classList.remove('sunglasses');
      this.resetButton.classList.remove('open-mouth');
      this.resetButton.classList.remove('frown');
      View.call(this, $.extend(this.options, newOptions));
      this.draw();
    },

    visualSweep: function() {
      if (!this._sweep) {
        var t = 0;
        var view = this;
        var ctx = view.ctx;
        this._sweep = function(coord) {
          view.tiles.drawSingle(coord, ctx);
          view.drawScore(ctx);
        };
      }
      return this._sweep;
    },

    handlerBase: function(e, callFwd) {
      if (this.game.over) {
        return;
      }

      var pos = this.tiles.calculateCell(e);
      if (!this.game.inRange(pos)) {
        return;
      }
      var callback = this.visualSweep();
      var result = callFwd(pos, callback);

      if (!!result.mine || result.won) {
        this.draw();
        this.stop();
        if (result.won) {
          this.resetButton.classList.add('sunglasses');
        } else if (result.mine) {
          this.resetButton.classList.add('frown');
        }
      }
    },

    sweep: function(e) {
      var game = this.game;
      this.handlerBase(e, game.sweep.bind(game));
    },

    toggleFlag: function(e) {
      var game = this.game;
      this.handlerBase(e, game.toggleFlag.bind(game));
    },

    reveal: function(e) {
      var game = this.game;
      if (game.over) {
        return;
      }

      this.handlerBase(e, game.reveal.bind(game));
      if (!game.begun) {
        this.start();
      }
    },

    draw: function() {
      this.drawScore();
      this.drawAllTiles();
      this.drawTimer();
    },

    drawScore: function() {
      this.score.draw(this.score_ctx);
    },

    drawTimer: function() {
      this.timer.draw(this.timer_ctx);
    },

    drawAllTiles: function() {
      this.tiles.draw(this.ctx);
    }
  });

})();
