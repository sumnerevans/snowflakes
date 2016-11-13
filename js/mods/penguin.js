var Penguin = function () {
    var container;
    var image_front = new Image();
    image_front.src = 'img/tux.png';

    var tallness;
    var scale;
    var fire_event;

    this.init = function () {
        container = new createjs.Container();
        container.z = 10;

        this.resize();

        stage.addChild(container);
    };

    function create_penguin() {
        var pen = new createjs.Bitmap(image_front);
        pen.speed = 0.2;
        pen.x = -15;
        pen.pause_motion = 0;
        pen.tickEnabled = false;
        pen.regX = 277;
        pen.regY = 600;
        pen.recalc = function() {
            this.scaleX = scale;
            this.scaleY = scale;

            this.y = transform.provide.maxy
            - mods.floor.height * .1
            - tallness
            + this.regY * scale;
        };
        pen.recalc();

        pen.on('pressmove', on_drag);
        pen.on('pressup', on_drag_stop);

        container.addChild(pen);
    }

    this.post_init = function () {
        mods.peppermints.add_event_listener('pop', create_penguin);

        mods.snowballs.add_event_listener('check_hit', function(ball, send) {
            for (var i in container.children) {
                var pen = container.children[i];

                var pt = container.localToLocal(ball.x, ball.y, pen);
                if(pen.hitTest(pt.x, pt.y)) {
                    console.log('ouch!');
                    return send(pen);
                }
            }
        });
    };

    this.resize = function () {
        scale = 13 / image_front.width;
        tallness = scale * image_front.height;
        container.children.forEach(function(p) { p.recalc(); });
    };

    this.tick = function (t) {
        for (var i in container.children) {
            var pen = container.children[i];

            pen.rotation = 6 * Math.sin(0.013 * t);

            if (pen.pause_motion > 0) {
                pen.pause_motion--;
            } else {
                if (t % 10 === 0) {
                    if (Math.random() < 0.05) pen.speed /= 2;
                    else pen.speed += (pen.speed < 0)? -0.02:0.02;
                    pen.speed *= Math.abs(pen.speed) > 0.1 ? 0.9 : 1.1;
                }
                /* Allow direction changes inside our snow bank
                 * range at certain multiples of our position */
                var p = (pen.x
                    - transform.provide.minx
                    - (0.12 * transform.provide.sizex))
                    / (0.76 * transform.provide.sizex);
                if (p > 0 && p < 1 && Math.floor(1000*p) % 150 == 0) {
                    /* Do a bernoulli trial with probability 0.3 of success
                     * to change directions */
                    if (Math.random() < 0.3) pen.speed *= -0.25;
                }
                pen.x += pen.speed;

                // Don't let Tux get away too far
                if ((p > 1 && pen.speed > 0) || (p < 0 && pen.speed < 0)) pen.speed *= -0.25;
            }
        }
    };

    this.get_interface = function() {
        return {};
    };

    this.set_event_handle = function(fire) { fire_event = fire; };

    function on_drag() {
        fire_event('drag', Array.prototype.slice.call(arguments));
    }

    function on_drag_stop() {
        fire_event('dragstop', Array.prototype.slice.call(arguments));
    }

};

core.add_feature('penguin', new Penguin());
