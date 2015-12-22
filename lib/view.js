var window = window || this;

(function() {
  'use strict';

  var View = window.View = function View(options) {
    this.storeSettings(options);
    this.addSubViews(options);
    this.canvas.addEventListener('click',
      this.handleLeftClick.bind(this)
    );
  };

  View.WIDTH = 800;
  View.HEIGHT = 400;
  View.dt = 0.02;

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
        ctx: options.ctx
      };
      var tiles = this.tiles = new Tiles(tileOptions);
    },

    start: function() {
      this.timer.start();
      setInterval(this.draw.bind(this), View.dt);
    },

    handleLeftClick: function(e) {
      var pos = this.tiles.calculateCell(e);
    },

    handleRightClick: function(e) {
      var pos = this.tiles.calculateCell(e);
    },

    draw: function() {
      var dX, dY;
      var ctx = this.ctx;
      var canvas = this.canvas;

      ctx.fillStyle = '#ddd';
      ctx.clearRect(0, 0, View.WIDTH, View.HEIGHT);
      ctx.fillRect(0, 0, View.WIDTH, View.HEIGHT);

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

    }
  };

})();
