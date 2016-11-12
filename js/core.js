var stage;
var transform = new Transform(0, 100, 0, 100, .5, 1, 1);

var core = new (function() {

    var features = [];
    var initialized = false;

    this.resize_canvas = function () {
        stage.canvas.width = window.innerWidth;
        stage.canvas.height = window.innerHeight;
        transform.update(stage.canvas.width, stage.canvas.height);
        transform.applyToContainer(stage);
        stage.update();
    };
    window.addEventListener('resize', this.resize_canvas, false);

    this.tick = function () {
        if (!initialized) {
            return;
        }

        features.forEach(function(feature) {
            if (feature.tick) {
                feature.tick();
            }
        });
        stage.update();
    };

    this.canvas_init = function() {
        stage = new createjs.Stage("canvas");

        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", this.tick);

        stage.canvas.style.backgroundColor = "#ff0800";
        /*
        var circle = new createjs.Shape();
        circle.graphics.beginFill("#FFFAFA").drawCircle(0, 0, 50);
        circle.x = 50;
        circle.y = 50;
        stage.addChild(circle);
        */

        this.resize_canvas();

        features.forEach(function(feature) {
            if (feature.init) {
                feature.init();
            }
        });

        initialized = true;
    };

    this.add_feature = function(feature) {
        features.push(feature);
    };

    this.rand = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    this.rand_float = function(min, max) {
        return Math.random() * (max - min) + min;
    };

})();
