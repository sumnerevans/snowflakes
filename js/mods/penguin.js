var Penguin = function () {
    var image_front = new createjs.Bitmap('img/tux.png');
    image_front.tickEnabled = false;
    image_front.regX = 277;
    image_front.regY = 600;

    var tallness;
    var pause_motion = 0;
    var t_offset = 0;
    var t_current = 0;

    this.init = function () {
        container = new createjs.Container();
        this.resize();
        container.addChild(image_front);
        container.z = 10;
        stage.addChild(container);
    };

    this.post_init = function() {
        mods.snowflakes.add_event_listener('pop', on_snowflake_pop);
    };

    this.resize = function () {
        var scale = 13 / image_front.image.width;
        image_front.x = transform.provide.minx + transform.provide.sizex * .5;
        image_front.scaleX = scale;
        image_front.scaleY = scale;

        tallness = scale * image_front.image.height;
        image_front.y = transform.provide.maxy
            - mods.floor.height * .2
            - tallness
            + image_front.regY * scale;
    };

    this.tick = function (t) {
        image_front.rotation = 6 * Math.sin(0.013 * t);

        if (pause_motion > 0) {
            var dt = t - t_current;
            pause_motion--;
            t_offset += dt;
        } else {
            image_front.x = 20 + (50 * Math.sin(0.0001 * (t - t_offset)));
        }

        t_current = t;
    };

    function on_snowflake_pop(event, flake, snowflake_counter) {
        if (snowflake_counter % 12 === 0 && pause_motion <= 0) {
            pause_motion = 200;
        }
    }
};

core.add_feature('penguin', new Penguin());
