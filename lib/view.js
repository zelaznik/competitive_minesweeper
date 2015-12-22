var window = window || this;

(function() {
  var View = window.View = function View(options) {
    this.game = options.game;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext('2d');

    var digitalOptions = {
      img: options.files.digits,
      width: 52, height: 92,
      dstWidth: 9, dstHeight: 12,
      game: options.game,
      ctx: options.ctx
    };
    var timer = this.timer = new Timer(digitalOptions);
    var score = this.score = new Score(digitalOptions);
  };

  View.WIDTH = 600;
  View.HEIGHT = 400;
  View.dt = 0.02;

  View.prototype = {
    start: function() {
      this.timer.start();
      setInterval(this.draw.bind(this), View.dt);
    },

    draw: function() {
      var ctx = this.ctx;
      var canvas = this.canvas;

      ctx.fillStyle = '#008';
      ctx.clearRect(0, 0, View.WIDTH, View.HEIGHT);
      ctx.fillRect(0, 0, View.WIDTH, View.HEIGHT);

      // Set a small border around
      this.score.draw(ctx);
      ctx.save()
        var dX = canvas.width - this.timer.width;
        ctx.translate(dX, 0);
        this.timer.draw(ctx);
      ctx.restore();

    }
  };

})();
