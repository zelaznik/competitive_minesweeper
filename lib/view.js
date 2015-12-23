var window = window || this;

(function() {
  'use strict';

  var View = window.View = function View(options) {
    this.storeSettings(options);
    this.addSubViews(options);
    var leftButtonDown = false;
    var document = options.document;

    var map = [];
    function keystrokelogger(e) {
      e = e || event;
      map[e.keyCode] = (e.type == 'keydown');
    }

    document.addEventListener('mousedown', function(event) {
      if (event.which === 1) {
        mouseClicks.left = true;
      }
      if (event.which === 3) {
        mouseClicks.right = true;
      }
    });

    document.addEventListener('mouseup', function(event) {
      mouseClicks.left = false;
      mouseClicks.right = false;
    });

    this.canvas.addEventListener('click', this.handleLeftClick.bind(this));

    this.canvas.addEventListener('contextmenu', function(e) {
      event.preventDefault();
      if (mouseClicks.left) {
        ALERT("DUAL");
        this.handleDualClick(e);
      } else {
        this.handleRightClick(e);
      }
      mouseClicks.left = false;
      mouseClicks.right = false;
    }.bind(this), false);

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
        ctx: options.ctx
      };

      var timer = this.timer = new Timer(digitalOptions);
      var score = this.score = new Score(digitalOptions);

      var tileOptions = {
        img: options.files.tiles,
        srcWidth: 128, srcHeight: 128,
        dstWidth: 20, dstHeight: 20,
        game: options.game,
        canvas: options.canvas,
        ctx: options.ctx
      };
      var tiles = this.tiles = new Tiles(tileOptions);
    },

    renderInitialView: function(options) {
      var ctx = this.ctx;
      ctx.fillStyle = '#ddd';
      ctx.fillRect(0, 0, View.WIDTH, View.HEIGHT);
    },

    start: function() {
      this.timer.start();
      this._draw = this.draw.bind(this);
      setInterval(this._draw, View.dt);
    },

    stop: function() {
      this.game.stop();
      this.timer.stop();
      clearInterval(this._draw);
      delete this._draw;
    },

    handleLeftClick: function(e) {
      var view = this;
      var ctx = view.ctx;
      var tiles = view.tiles;
      var pos = view.tiles.calculateCell(e);
      var result = view.game.reveal(pos);
      this.draw();
      if (!!result.mines) {
        alert("GAME OVER!");
        this.stop();
      }
      this.draw();
    },

    handleDualClick: function(e) {
      if (e) { e.preventDefaut(); }
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
