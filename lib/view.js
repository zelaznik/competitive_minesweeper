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

      var timer = this.timer = new Timer(digitalOptions);
      var score = this.score = new Score(digitalOptions);

      var tileOptions = {
        img: options.files.tiles,
        srcWidth: 32, srcHeight: 32,
        dstWidth: 20, dstHeight: 20,
        game: options.game,
        canvas: options.canvas,
        ctx: options.ctx
      };
      var tiles = this.tiles = new Tiles(tileOptions);
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

      var buttons = 0;
      var view = this;

      function buttonsView() {
        return buttons;
      }

      options.resetButton.addEventListener('click', function(e) {
        view.reset();
      });

      var hist = {};
      var includeNeighbors;
      var c = this.canvas;
      var on = c.addEventListener.bind(c);
      var desc = {'1': 'left', '2': 'right', '3': 'right'};
      var leftDown = 0, rightDown = 0;

      on('contextmenu', function(e) {
        e.preventDefault();
        view.highlightActive(e);
      });

      on('click', function(e) {
        view.handleLeftClick(e);
      });


      on('mousedown', function(e) {
        var btn, callback;

        buttons++;
        btn = desc[(e.buttons || e.which)];
        if (btn === 'left') {
          leftDown = Date.now();
        } else if (btn === 'right') {
          rightDown = Date.now();
        }

        if (leftDown) {
          if (rightDown) {
            view.highlightActive(e, {includeNeighbors: true});
          } else {
            view.highlightActive(e);
          }

        } else if (btn === 'right') {
          view.handleRightClick(e);
        }
      });

      on('mouseup', function(e) {
        var btn, callback;
        buttons--;
        btn = desc[(e.buttons || e.which)];
        if (buttons > 0) {
          view.handleDualClick(e);
        } else if (btn === 'left') {
          view.handleLeftClick(e);
        }
        if (buttons === 0) {
          view.draw();
        }

        leftDown = false;
        rightDown = false;
      });

      this._listenersAdded = true;
    },

    highlightActive: function(e, options) {
      var includeNeighbors = options && !!options.includeNeighbors;

      var pos = this.tiles.calculateCell(e);
      this.game.validate(pos);

      this.tiles.drawSingle(pos, this.ctx, {active: true});

      if (!includeNeighbors) {
        this.tiles.drawSingle(pos, this.ctx, {active: true});
      } else {
        for (var dr=-1; dr<2; dr++) {
          for (var dc=-1; dc<2; dc++) {
            var coord = {r: pos.r + dr, c: pos.c + dc};
            if (this.game.inRange(coord)) {
              this.tiles.drawSingle(coord, this.ctx, {active: true});
            }
          } // next col
        } //next row
      } // end neighbors clause
      this.deactivate(pos);
    },

    deactivate: function(pos) {
      if (!pos) {return ;}

      var prevNeighbors = [
        [-2,-2], [-2,-1], [-2, 0], [-2, 1], [-2, 2],
        [-1,-2],                            [-1, 2],
        [ 0,-2],                            [ 0, 2],
        [ 1,-2],                            [ 1, 2],
        [ 2,-2], [ 2,-1], [ 2, 0], [ 2, 1], [ 2, 2]
      ];

      for (var i in prevNeighbors) {
        var n = prevNeighbors[i];
        var coord = {r: pos.r + n[0], c: pos.c + n[1]};
        if (this.game.inRange(coord)) {
          this.tiles.drawSingle(coord, this.ctx);
        }
      }
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
            view.drawTile(coord, ctx);
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
      this.game.validate(pos);
      this.deactivate();
      var callback = this.visualSweep();
      var result = callFwd(pos, callback);

      if (!!result.mine || result.won) {
        this.draw();
        this.stop();
      }
    },

    handleLeftClick: function(e) {
      var game = this.game;
      if (game.over) {
        return;
      } else if (!game.begun) {
        this.start();
      }
      this.handlerBase(e, game.reveal.bind(game));
    },

    handleDualClick: function(e) {
      var game = this.game;
      this.handlerBase(e, game.sweep.bind(game));
    },

    handleRightClick: function(e) {
      e.preventDefault();
      var game = this.game;
      this.handlerBase(e, game.toggleFlag.bind(game));
    },

    refreshMineCount: function() {
      var ctx = this.ctx;
      var canvas = this.canvas;
      // Set a small border around
      ctx.save();
        ctx.translate(10, 8);
        this.score.draw(ctx);
      ctx.restore();
    },

    draw: function() {
      this.drawScore();
      this.drawAllTiles();
      this.drawTimer();
    },

    drawScore: function() {
      // Set a small border around
      this.ctx.save();
        this.ctx.translate(10, 8);
        this.score.draw(this.ctx);
      this.ctx.restore();
    },

    drawTile: function(coord) {
      this.tiles.drawSingle(coord, this.ctx);
    },

    drawTimer: function() {
      this.ctx.save();
        var dX = -10 + canvas.width - this.timer.width;
        this.ctx.translate(dX, 8);
        this.timer.draw(this.ctx);
      this.ctx.restore();
    },

    drawAllTiles: function() {
      this.ctx.save();
        var dX = this.tiles.dX = (canvas.width - this.tiles.width) / 2;
        var dY = this.tiles.dY = 50;
        this.ctx.translate(dX, dY);
        this.tiles.draw(this.ctx);
      this.ctx.restore();
    }
  });

})();
