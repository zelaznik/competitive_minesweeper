var window = window || this;

(function() {
  'use strict';

  var View = window.View = function View(options) {
    this.options = options = options || {};
    this.game = options.game = new Game(options.gameSettings);

    this.storeSettings(options);
    this.addSubViews(options);
    this.resizeHTML(options);
    this.addListeners(options);

    this.ctx = this.canvas.getContext('2d');
    this.renderInitialView(options);
  };

  View.dt = 0.05;

  View.prototype = ({
    storeSettings: function(options) {
      this.main = options.main;
      this.timer_canvas = options.timer_canvas;
      this.score_canvas = options.score_canvas;

      this.canvas = options.canvas;
      this.score_ctx = this.score_canvas.getContext('2d');
      this.timer_ctx = this.timer_canvas.getContext('2d');
    },

    addSubViews: function(options) {
      var digitalOptions = {
        img: options.files.digits,
        srcWidth: 52, srcHeight: 92,
        dstWidth: 18, dstHeight: 36,
        game: options.game,
        ctx: options.ctx,
        digitCt: 5
      };

      this.timer = new Timer({
        img: options.files.digits,
        srcWidth: 52, srcHeight: 92,
        dstWidth: 18, dstHeight: 36,
        canvas: options.timer_canvas,
        game: options.game,
        digitCt: 5
      });

      this.score = new Score({
        img: options.files.digits,
        srcWidth: 52, srcHeight: 92,
        dstWidth: 18, dstHeight: 36,
        canvas: options.score_canvas,
        game: options.game,
        digitCt: 5
      });

      this.tiles = new Tiles({
        img: options.files.tiles,
        srcWidth: 16, srcHeight: 16,
        dstWidth: 16, dstHeight: 16,
        game: options.game,
        canvas: options.canvas,
        ctx: options.ctx
      });
    },

    resizeHTML: function() {
      this.main.style.width = this.tiles.width + 100;
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
      var on = view.canvas.addEventListener.bind(view.canvas);

      // Converts button codes to 'left', 'right', 'middle'.
      var desc = {'0': 'left', '1': 'middle', '2': 'right'};
      function label(e) {
        return desc[e.button];
      }

      options.resetButton.addEventListener('click', function(e) {
        view.reset();
        mouseDown.left = false;
        mouseDown.right = false;
      });


      function show(title, e) {
        var pos = view.tiles.calculateCell(e);
        console.log(title + ": " + JSON.stringify(pos));
      }

      on('mousemove', function(e) {
        if (mouseDown.left) {
          view.highlightActive(e, {includeNeighbors: mouseDown.right});
        }
      });

      on('contextmenu', function(e) {
        e.preventDefault();
        if (!mouseDown.left) {
          view.toggleFlag(e);
          view.draw();
        }
      });

      on('click', function(e) {
        view.reveal(e);
      });

      on('mousedown', function(e) {
        var btn = label(e);
        mouseDown[btn] = true;

        if (mouseDown.left && mouseDown.right) {
          view.highlightActive(e, {includeNeighbors: true});
        } else if (mouseDown.left) {
          view.highlightActive(e);
        }
      });

      on('mouseup', function(e) {
        var btn = label(e);
        if (mouseDown.left && mouseDown.right) {
          view.sweep(e);
        }
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

    reset: function() {
      this.stop();
      this.deleteSubViews();
      delete this.game;
      View.call(this, this.options);
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
