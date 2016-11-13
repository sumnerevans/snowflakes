var stage;
var transform = new Transform(0, 100, 0, 100, .5, 1, 1);

var core = new (function() {

    var features = {};
    var initialized = false;

    function do_resize() {
        stage.canvas.width = window.innerWidth;
        stage.canvas.height = window.innerHeight;
        transform.update(stage.canvas.width, stage.canvas.height);
        transform.applyToContainer(stage);
    }

    function key_down(key) {
        $.each(features, function(name, feature) {
            if (feature.key_event) feature.key_event(key, true);
        });
    }

    function key_up(key) {
        $.each(features, function(name, feature) {
            if (feature.key_event) feature.key_event(key, false);
        });
    }

    document.onkeydown = key_down;
    document.onkeyup = key_up;

    this.resize_canvas = function () {
        var old = transform.clone();

        do_resize();

        $.each(features, function(name, feature) {
            if (feature.resize) feature.resize(transform, old);
        });

        stage.update();
    };
    window.addEventListener('resize', this.resize_canvas, false);

    this.tick = function () {
        if (!initialized) {
            return;
        }

        $.each(features, function(name, feature) {
            if (feature.tick) feature.tick();
        });
        stage.update();
    };

    this.canvas_init = function() {
        stage = new createjs.Stage("canvas");

        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", this.tick);

        this.set_background({color: "#ff0800"});

        do_resize();

        $.each(features, function(name, feature) {
            if (feature.init) feature.init();
        });

        stage.sortChildren(function(a, b) {
            if (a.z > b.z) { return 1; }
            if (a.z < b.z) { return -1; }
            return 0;
        });

        initialized = true;
    };

    var feature_num = 0;
    this.add_feature = function(feature) {
        features[feature.name || feature_num.toString()] = feature;
        feature_num++;
    };

    this.get_feature = function(feature_name) {
        var return_feature = null;
        $.each(features, function(name, feature) {
            if (name === feature_name) {
                return_feature = feature;
                return false;
            }
        });

        return return_feature;
    };

    this.rand = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    this.rand_float = function(min, max) {
        return Math.random() * (max - min) + min;
    };

    this.set_background = function(back) {
        if (back.color) stage.canvas.style.backgroundColor = back.color;
    };
})();
