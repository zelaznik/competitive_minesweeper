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

      var c = view.canvas;
      var on = c.addEventListener.bind(c);
      var off = c.removeEventListener.bind(c);

      var hist = {};
      var desc = {'1': 'left', '2': 'right', '3': 'right'};

      on('contextmenu', function(e) {
        e.preventDefault();
        view.handleRightClick(e);
      });

      on('mousedown', function(e) {
        var btn = desc[(e.which || e.buttons)];
        var prev = {
          left: hist.left,
          right: hist.right
        };
        var now = {
          left: hist.left || btn === 'left',
          right: hist.right || btn === 'right'
        };
        hist[btn] = true;
        if (now.left && now.right) {
          view.highlightCellAndNeighbors(e);
        } else if (now.left) {
          view.highlightActive(e);
        }
      });

      on('mouseup', function(e) {
        var btn = desc[(e.which || e.buttons)];
        var prev = {
          left: hist.left,
          right: hist.right
        };
        var now = {
          left: hist.left || btn === 'left',
          right: hist.right || btn === 'right'
        };

        hist.left = false;
        hist.right = false;

        if (prev.left && prev.right) {
          view.handleDualClick(e);
        } else if (prev.left && btn === 'left') {
          view.handleLeftClick(e);
        }

      });

      this._listenersAdded = true;
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

    addTimeout: function(callback, t) {
      if (!this._timeouts) {
        this._timeouts = [];
      }
      var f = setTimeout(callback, t);
      this._timeouts.push(f);
    },

    resetTimeouts: function() {
      if (this._timeouts) {
        this._timeouts.forEach(clearTimeout);
      }
      this._timeouts = [];
    },

    visualSweep: function() {
      var view = this;
      var ctx = view.ctx;
      function callback(coord) {
          view.drawTile(coord, ctx);
          view.drawScore(ctx);
      }
      return callback;
    },

    highlightActive: function(e) {
      var pos = this.tiles.calculateCell(e);
      this.game.validate(pos);
      this.tiles.drawSingle(pos, this.ctx, {active: true});
    },

    highlightCellAndNeighbors: function(e) {
      var pos = this.tiles.calculateCell(e);
      this.game.validate(pos);
      this.tiles.drawSingle(pos, this.ctx, {active: true});
      this.neighbors(pos).forEach(function(val, coord) {
        this.tiles.drawSingle(coord, this.ctx, {active: true});
      }.bind(this));

    },

    handlerBase: function(e, callFwd) {
      if (this.game.over) {
        return;
      }

      var pos = this.tiles.calculateCell(e);
      this.game.validate(pos);
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
      this.resetTimeouts();
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
