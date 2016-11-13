var stage;
var transform = new Transform(0, 100, 0, 100, .5, 1, 1);
var mods = {};

var core = new (function() {

    var features = {};
    var initialized = false;

    var start = Date.now();

    function do_resize() {
        stage.canvas.width = window.innerWidth;
        stage.canvas.height = window.innerHeight;
        transform.update(stage.canvas.width, stage.canvas.height);
        transform.applyToContainer(stage);
    }

    function call_feature(func, args) {
        for (var i in features) {
            var feature = features[i];
            if (feature[func]) feature[func].apply(feature, args);
        }
    }

    function key_down(key) {
        call_feature('key_event', [key, true]);
    }

    function key_up(key) {
        call_feature('key_event', [key, false]);
    }

    document.onkeydown = key_down;
    document.onkeyup = key_up;

    this.resize_canvas = function () {
        var old = transform.clone();

        do_resize();

        call_feature('resize', [transform, old]);

        stage.update();
    };
    window.addEventListener('resize', this.resize_canvas, false);

    this.tick = function () {
        if (!initialized) {
            return;
        }

        call_feature("tick", [Date.now() - start]);

        stage.update();
    };

    this.canvas_init = function() {
        stage = new createjs.Stage("canvas");

        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", this.tick);

        this.set_background({color: "rgb(15, 50, 100)"});

        do_resize();

        call_feature("init");

        stage.sortChildren(function(a, b) {
            if (a.z > b.z) { return 1; }
            if (a.z < b.z) { return -1; }
            return 0;
        });

        initialized = true;

        call_feature("post_init");
    };

    var interface_proto = {
        add_event_listener: function(event, fn) {
            this.event_listeners[event] = this.event_listeners[event] || [];

            this.event_listeners[event].push(fn);
        },
        fire_event: function(event, args) {
            args.push(event);
            this.event_listeners[event].forEach(function(fn) {
                fn.apply(undefined, args);
            });
        }
    };

    this.add_feature = function(name, feature) {
        features[name] = feature;

        var inter = feature.get_interface ? (feature.get_interface() || {}) : {};
        inter.name = name;
        inter.feature = feature;
        inter.event_listeners = {};
        Object.setPrototypeOf(inter, interface_proto);
        mods[name] = inter;
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
