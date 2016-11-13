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

        if (pause_motion > 0 || !vis) {
            pause_motion--;
        } else {
            if (t % 10 === 0) {
                var randDiff = core.rand(-10, 10);

                switch(true) {
                    case randDiff < 0:
                        speed -= 0.02;
                        break;
                    case randDiff === 0:
                        speed /= 2;
                        break;
                    case randDiff > 0:
                        speed += 0.02;
                        break;
                }

                speed *= Math.abs(speed) > 0.1 ? 0.9 : 1.2;
            }

            image_front.x += speed;

            // Don't let Tux get away too far
            if (image_front.x < -20 || image_front.x > transform.provide.maxx + 20) {
                 speed *= -1;
            }
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
