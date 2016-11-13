var Penguin = function () {
    var image_front = new createjs.Bitmap('img/tux.png');
    image_front.tickEnabled = false;
    image_front.regX = 277;
    image_front.regY = 600;

    var tallness;
    var pause_motion = 0;
    var vis = false;
    var speed = 0;

    this.init = function () {
        container = new createjs.Container();
        this.resize();
        container.z = 10;

        stage.addChild(container);
    };

    this.post_init = function () {
        mods.peppermints.add_event_listener('pop', on_snowflake_pop);
    };

    this.resize = function () {
        var scale = 13 / image_front.image.width;
        image_front.x = transform.provide.minx + transform.provide.sizex * .5;
        image_front.scaleX = scale;
        image_front.scaleY = scale;

        tallness = scale * image_front.image.height;
        image_front.y = transform.provide.maxy
            - mods.floor.height * .1
            - tallness
            + image_front.regY * scale;
    };

    this.tick = function (t) {
        image_front.rotation = 6 * Math.sin(0.013 * t);

        if (pause_motion > 0 || !vis) {
            pause_motion--;
        }
        else {
            if (t % 10 === 0) {
                if (Math.random() < 0.05) speed /= 2;
                else speed += (speed < 0)? -0.02:0.02;
                speed *= Math.abs(speed) > 0.1 ? 0.9 : 1.1;
            }
            /* Allow direction changes inside our snow bank
             * range at certain multiples of our position */
            var p = (image_front.x
                - transform.provide.minx
                - (0.12 * transform.provide.sizex))
                / (0.76 * transform.provide.sizex);
            if (p > 0 && p < 1 && Math.floor(1000*p) % 150 == 0) {
                /* Do a bernoulli trial with probability 0.3 of success
                 * to change directions */
                if (Math.random() < 0.3) speed *= -1;
            }
            image_front.x += speed;

            // Don't let Tux get away too far
            if ((p > 1 && speed > 0) || (p < 0 && speed < 0)) speed *= -1;
        }
    };

    this.get_interface = function() {
        return {};
    };

    function on_snowflake_pop(event, flake, snowflake_counter) {
        if (!vis) {
            vis = true;
            container.addChild(image_front);
            speed = 0.2;
            image_front.x = -15;
        }

        if (snowflake_counter % 12 === 0 && pause_motion <= 0) {
            pause_motion = 200;
        }
    }
};

core.add_feature('penguin', new Penguin());
