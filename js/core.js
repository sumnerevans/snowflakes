var stage;
var transform = new Transform(0, 100, 0, 100, .5, 1, 1);

var core = new (function() {

    var features = [];

    this.resize_canvas = function () {
        stage.canvas.width = window.innerWidth;
        stage.canvas.height = window.innerHeight;
        transform.update(stage.canvas.width, stage.canvas.height);
        transform.applyToContainer(stage);
        stage.update();
    };
    window.addEventListener('resize', this.resize_canvas, false);

    this.tick = function () {
        stage.update();
    };

    this.canvas_init = function() {
        stage = new createjs.Stage("canvas");

        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", this.tick);

        stage.canvas.style.backgroundColor = "#ff0800";
        /*
        var circle = new createjs.Shape();
        circle.graphics.beginFill("#FFFAFA").drawCircle(0, 0, 50);
        circle.x = 50;
        circle.y = 50;
        stage.addChild(circle);
        */

        features.forEach(function(feature) {
            if (feature.init) {
                feature.init();
            }
        });

        this.resize_canvas();
    };

    this.add_feature = function(feature) {
        features.push(feature);
    };

})();
