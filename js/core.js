var stage;
var transform = new Transform(0, 100, 0, 100, .5, 1, 1);

var core = new (function() {

    var features = [];
    var initialized = false;

    function do_resize() {
        stage.canvas.width = window.innerWidth;
        stage.canvas.height = window.innerHeight;
        transform.update(stage.canvas.width, stage.canvas.height);
        transform.applyToContainer(stage);
    }

    this.resize_canvas = function () {
        do_resize();

        features.forEach(function(feature) {
            if (feature.resize) feature.resize();
        });

        stage.update();
    };
    window.addEventListener('resize', this.resize_canvas, false);

    this.tick = function () {
        if (!initialized) {
            return;
        }

        features.forEach(function(feature) {
            if (feature.tick) feature.tick();
        });
        stage.update();
    };

    this.canvas_init = function() {
        stage = new createjs.Stage("canvas");

        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", this.tick);

        stage.canvas.style.backgroundColor = "#ff0800";

        do_resize();

        features.forEach(function(feature) {
            if (feature.init) feature.init();
        });

        stage.sortChildren(function(a, b) {
            if (a.z > b.z) { return 1; }
            if (a.z < b.z) { return -1; }
            return 0;
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
