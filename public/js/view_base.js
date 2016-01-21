(function() {
  'use strict';

  var View = window.View = function View(options) {
    this.options = options = options || {};

    var choice = options.menu.getElementsByClassName('active level-choice')[0];
    this.game = options.game = new this.gameType({
      level: choice.getAttribute('name')
    });

    this.storeSettings(options);
    this.addSubViews(options);
    this.resizeHTML(options);

    this.ctx = this.canvas.getContext('2d');
    this.renderInitialView(options);
  };

  View.zoom = {
    tiles: {
      'beginner': 23/16
    },
    digital: {

    }
  };

  View.statusBarSpeed = 300;
  View.dt = 0.05;

  View.prototype = ({
    gameType: window.Game,

    storeSettings: function(options) {
      this.aux = options.aux;
      this.main = options.main;
      this.menu = options.menu;
      this.body = options.body;
      this.views = options.views;
      this.resetButton = options.resetButton;
      this.timer_canvas = options.timer_canvas;
      this.score_canvas = options.score_canvas;

      this.$minesStatusBar = options.$minesStatusBar;
      this.$cellsStatusBar = options.$cellsStatusBar;

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
        $.extend(digitalOptions, {tempName: this.constructor.name, canvas: options.timer_canvas})
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
      this.canvas.style.width = this.tiles.width;
      this.main.style.width = this.tiles.width;
      this.aux.style.width = this.tiles.width;
    },

    deleteSubViews: function() {
      delete this.tiles;
      delete this.timer;
      delete this.score;
    },

    renderInitialView: function(options) {
      var ctx = this.ctx;
      ctx.fillStyle = '#88c';
      ctx.fillRect(0, 0, View.WIDTH, View.HEIGHT);
    },

    start: function(options) {
      if (!!this.game.isActive() || this.lockCt) {
        return;
      }

      this.game.begun = true;
      this.timer.start();
      this._drawTimer = setInterval(
        this.drawTimer.bind(this),
        View.dt * 1000
      );

      this.$minesStatusBar.addClass('active');
      this.$cellsStatusBar.addClass('active');
      this.updateStatusBars();
    },

    stop: function(options) {
      this.game.over = true;
      this.timer.stop();
      clearInterval(this._drawTimer);
      delete this._drawTimer;

      this.$minesStatusBar.removeClass('active');
      this.$cellsStatusBar.removeClass('active');
      this.updateStatusBars(0);
    },

    reset: function(newOptions) {
      this.timer.reset();
      this.deleteSubViews();
      delete this.game;
      this.body.classList.remove('success');
      this.body.classList.remove('failure');
      this.resetButton.classList.remove('sunglasses');
      this.resetButton.classList.remove('open-mouth');
      this.resetButton.classList.remove('frown');
      View.call(this, $.extend(this.options, newOptions));
      this.draw();

      this.$minesStatusBar.removeClass('active');
      this.$cellsStatusBar.removeClass('active');

      this.resetStatusBars();
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

    handlerBase: function(pos, callFwd) {
      if (this.game.over) {
        return;
      }

      if (!this.game.inRange(pos)) {
        return;
      }
      var callback = this.visualSweep();
      var result = callFwd(pos, callback);

      if (!!result.mine || result.won) {
        this.draw();
        this.stop();
        if (result.won) {
          this.makeWin();

        } else if (result.mine) {
          this.makeLose();
        }
      }
    },

    onWin: function(options) {
      this.resetButton.classList.add('sunglasses');
      this.updateStatusBars();
    },

    onLose: function() {
      this.resetButton.classList.add('frown');
      this.updateStatusBars();
    },

    makeWin: function(options) {
      this.onWin(options);
    },

    makeLose: function(options) {
      this.onLose(options);
    },

    sweep: function(e) {
      var game = this.game;
      this.handlerBase(e, game.sweep.bind(game));
    },

    toggleFlag: function(e) {
      var game = this.game;
      this.handlerBase(e, game.toggleFlag.bind(game));
    },

    toggleFlagOrSweep: function(e) {
      var game = this.game;
      var pos = this.tiles.calculateCell(e);
      switch (game.get(pos)) {
        case undefined:
        case 'flag':
        case '?':
          this.toggleFlag(e);
          break;

        default:
          this.sweep(e);
          break;
      }
      this.updateStatusBars();
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
      this.updateStatusBars();
    },

    draw: function() {
      this.drawScore();
      this.drawAllTiles();
      this.drawTimer();
    },

    resetStatusBars: function(callback) {
      callback = callback || function() {};
      this.updateStatusBars({millisec: 0, callback: callback});
    },

    updateStatusBars: function(options) {
      var millisec, cellPct, minePct, callback;
      options = options || {};

      millisec = options.millisec || View.statusBarSpeed;
      callback = options.callback || function() {};
      if (options.defaultValue === undefined) {
        cellPct = Math.min(1, this.game.percentCellsSwept());
        minePct = Math.min(1, this.game.percentMinesFlagged());

      } else {
        cellPct = options.defaultValue;
        minePct = options.defaultValue;
      }

      if (cellPct !== this._oldCellPct) {
        updatePct(this.$cellsStatusBar, cellPct, millisec, callback);
        this._oldCellPct = cellPct;
      }

      if (minePct !== this._oldMinePct) {
        updatePct(this.$minesStatusBar, minePct, millisec, callback);
        this._oldMinePct = minePct;
      }
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
