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
  View.dt = 0.01;

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

      options.resetButton.addEventListener('click', this.reset.bind(this));

      var cnvs = this.canvas;
      var on = cnvs.addEventListener.bind(cnvs);

      var printPosition;
      on('mousedown', function(e) {
        buttons++;
      });

      on('mouseup', function(e) {
        buttons--;
        if (buttons > 0) {
          this.handleDualClick(e);
        }
      }.bind(this));

      on('click',
        this.handleLeftClick.bind(this)
      );

      on('contextmenu',
        this.handleRightClick.bind(this)
      );

      this._listenersAdded = true;
    },

    renderInitialView: function(options) {
      var ctx = this.ctx;
      ctx.fillStyle = '#008';
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
      var t=0, dt=0.7;
      var di, ctx, delay;
      return function(coord) {
        // t += dt;
        // view.addTimeout(function() {
          view.drawTile(coord);
          view.drawScore();
        // }, t);
      };
    },

    handlerBase: function(e, callFwd) {
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
