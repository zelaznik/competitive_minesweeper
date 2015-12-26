var window = window || this;

(function() {
  'use strict';

  var View = window.View = function View(options) {
    this.options = options = options || {};
    this.game = options.game = new Game(options.gameSettings);
    this.storeSettings(options);
    this.addSubViews(options);
    this.addListeners(options);
    this.renderInitialView(options);
  };

  View.WIDTH = 800;
  View.HEIGHT = 400;
  View.dt = 0.05;

  View.prototype = ({
    storeSettings: function(options) {
      this.canvas = options.canvas;
      this.canvas.height = View.HEIGHT;
      this.canvas.width = View.WIDTH;
      this.ctx = this.canvas.getContext('2d');
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

      this.timer = new Timer(digitalOptions);
      this.score = new Score(digitalOptions);

      this.tiles = new Tiles({
        img: options.files.tiles,
        srcWidth: 16, srcHeight: 16,
        dstWidth: 16, dstHeight: 16,
        game: options.game,
        canvas: options.canvas,
        ctx: options.ctx
      });
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

      var activeCell;
      var view = this;
      var desc = {'0': 'left', '1': 'middle', '2': 'right'};
      var mouseDown = {left: false, right: false};
      var on = view.canvas.addEventListener.bind(view.canvas);

      options.resetButton.addEventListener('click', function(e) {
        view.reset();
        mouseDown.left = false;
        mouseDown.right = false;
      });

      function label(e) {
        return desc[e.button];
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
        view.draw();
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
      var includeNeighbors = options && !!options.includeNeighbors;

      var pos = this.tiles.calculateCell(e);
      this.draw();

      if (!this.game.inRange(pos)) {
        return;
      }

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
      var result = this.game[callFwd](pos, callback);

      if (!!result.mine || result.won) {
        this.draw();
        this.stop();
      }
    },

    sweep: function(e) {
      this.handlerBase(e, 'sweep');
    },

    toggleFlag: function(e) {
      this.handlerBase(e, 'toggleFlag');
    },

    reveal: function(e) {
      var game = this.game;
      if (game.over) {
        return;
      } else if (!game.begun) {
        this.start();
      }
      this.handlerBase(e, 'reveal');
    },

    draw: function() {
      this.drawScore();
      this.drawAllTiles();
      this.drawTimer();
    },

    drawScore: function() {
      var ctx = this.ctx;
      ctx.save();
        ctx.translate(10, 8);
        this.score.draw(ctx);
      ctx.restore();
    },

    drawTimer: function() {
      this.ctx.save();
        var dX = -10 + canvas.width - this.timer.width;
        this.ctx.translate(dX, 8);
        this.timer.draw(this.ctx);
      this.ctx.restore();
    },

    drawAllTiles: function() {
      var dX, dY, t = this.tiles;
      this.ctx.save();
        dX = t.dX = t.dX || (this.canvas.width - t.width) / 2;
        dY = t.dY = t.dY || 50;
        this.ctx.translate(dX, dY);
        this.tiles.draw(this.ctx);
      this.ctx.restore();
    }
  });

})();
