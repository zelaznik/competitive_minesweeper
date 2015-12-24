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
  View.dt = 0.005;

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

      this._listenersAdded = true;
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
      setInterval(this._draw, View.dt * 1000);
    },

    stop: function() {
      this.timer.stop();
      clearInterval(this._draw);
      this.tiles.setFalseFlags();
      delete this._draw;
    },

    reset: function() {
      this.stop();
      this.deleteSubViews();
      delete this.game;
      View.call(this, this.options);
      this.draw();
    },

    handleLeftClick: function(e) {
      if (this.game.over) {
        return;
      } else if (!this.game.begun) {
        this.start();
      }
      var pos = this.tiles.calculateCell(e);
      var view = this;
      var dt = 0;
      var result = this.game.reveal(pos, function(coord) {
        dt += 1.3;
        setTimeout(function() {
          view.drawSingle(coord, view.ctx);
        }, dt);
      });

      if (!!result.mine) {
        this.draw();
        this.stop();
      }
    },

    handleDualClick: function(e) {
      if (this.game.over) {
        return;
      }
      var pos = this.tiles.calculateCell(e);
      var result = this.game.sweep(pos);
      if (!!result.mine) {
        this.draw();
        this.stop();
      }
    },

    handleRightClick: function(e) {
      e.preventDefault();
      if (this.game.over) {
        return;
      }
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

    draw: function() {
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

  });

})();
