var window = window || this;

(function() {
  'use strict';

  var View = window.View = function View(options) {
    options = options || {};
    options.game = options.game || new Game();
    this.storeSettings(options);
    this.addSubViews(options);
    this.addListeners(options);
    this.renderInitialView(options);
  };

  View.WIDTH = 800;
  View.HEIGHT = 400;
  View.dt = 1.0;

  View.prototype = {
    storeSettings: function(options) {
      this.game = options.game;
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
        maxDigits: 5
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

    addListeners: function(options) {
      var buttons = 0;
      var view = this;

      options.resetButton.addEventListener('click', this.reset.bind(this));

      var on = this.canvas.addEventListener.bind(this.canvas);

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
    },

    renderInitialView: function(options) {
      var ctx = this.ctx;
      ctx.fillStyle = '#ddd';
      ctx.fillRect(0, 0, View.WIDTH, View.HEIGHT);
    },

    start: function() {
      this.game.begun = true;
      this.timer.start();
      this._draw = this.draw.bind(this);
      setInterval(this._draw, View.dt);
    },

    stop: function() {
      this.timer.stop();
      clearInterval(this._draw);
      delete this._draw;
    },

    reset: function() {
      this.timer.reset();
      this.game.reset();
    },

    handleLeftClick: function(e) {
      if (this.game.over) {
        return;
      } else if (!this.game.begun) {
        this.start();
      }

      var pos = this.tiles.calculateCell(e);
      var result = this.game.reveal(pos);
      this.draw();
      if (!!result.mine) {
        this.stop();
      }
      this.draw();
    },

    handleDualClick: function(e) {
      var pos = this.tiles.calculateCell(e);
      var result = this.game.sweep(pos);
      if (!!result.mine) {
        this.stop();
      }
      this.draw();
    },

    handleRightClick: function(e) {
      e.preventDefault();
      var pos = this.tiles.calculateCell(e);
      this.game.toggleFlag(pos);
      this.draw();
    },

    refreshMineCount: function() {
      var dX, dY;
      var ctx = this.ctx;
      var canvas = this.canvas;
      // Set a small border around
      ctx.save();
        ctx.translate(10, 8);
        this.score.draw(ctx);
      ctx.restore();
    },

    draw: function(options) {
      var dX, dY;
      var ctx = this.ctx;
      var canvas = this.canvas;

      // Set a small border around
      ctx.save();
        ctx.translate(10, 8);
        this.score.draw(ctx);
      ctx.restore();

      ctx.save();
        dX = -10 + canvas.width - this.timer.width;
        ctx.translate(dX, 8);
        this.timer.draw(ctx);
      ctx.restore();

      ctx.save();
        dX = this.tiles.dX = (canvas.width - this.tiles.width) / 2;
        dY = this.tiles.dY = 50;
        ctx.translate(dX, dY);
        this.tiles.draw(ctx);
      ctx.restore();
    },

  };

})();
