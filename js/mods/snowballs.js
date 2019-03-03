var Snowballs = function() {
    var container;

    var fire_event;

    var drag_start;

    var snowball_img = new Image();
    snowball_img.src = 'img/snowball.png';

    var peppermint_counter = 0;

    var hittable = [];

    /*
    var bigball = new Image();
    bigball.src = 'img/big_snowball.png';

    var iceicle = new Image();
    iceicle.src = 'img/iceicle.png';
    */

    function create_snowball(image, settings) {
        var bitmap = new createjs.Bitmap();
        bitmap.image = image;

        bitmap.size = 6;
        var scale = bitmap.size / image.width;
        bitmap.x = settings.x;
        bitmap.y = settings.y;
        bitmap.scaleX = bitmap.scaleY = scale;
        bitmap.regX = image.width / 2;
        bitmap.regY = image.height / 2;

        bitmap.speed = {
            dx: settings.dx,
            dy: settings.dy,
            dtheta: core.rand_float(-3, 3),
        };

        bitmap.tickEnabled = false;

        bitmap.addEventListener('click', function(event) {
            peppermint_counter++;
            fire_event('pop', [event, bitmap, peppermint_counter]);
            container.removeChild(bitmap);
        });

        return bitmap;

    }

    function on_drag(event) {
        if (core.mouse_button === 'right') {
            return;
        }

        if (!drag_start) {
            drag_start = transform.apply(event.rawX, event.rawY);
        }
    }

    function on_dragstop(event) {
        if (core.mouse_button === 'right') {
            return;
        }

        if (drag_start) {
            var drag_end = transform.apply(event.rawX, event.rawY);
            var dx = drag_end.x - drag_start.x;
            var dy = drag_end.y - drag_start.y;
            drag_start = undefined;
            var mag = Math.sqrt(dx * dx + dy * dy);
            if (mag < 0.0001) return;

            dx /= mag;
            dy /= mag;

            var speed = Math.min(mag / 10, 10);
            dx *= speed;
            dy *= speed;

            container.addChild(create_snowball(snowball_img, {
                x: drag_end.x,
                y: drag_end.y,
                dx: dx,
                dy: dy,
            }));
        }
    }

    this.init = function() {
        container = new createjs.Container();
        container.z = 10.5;

        stage.addChild(container);
    };

    this.post_init = function() {
        mods.floor.add_event_listener('drag', on_drag);
        mods.floor.add_event_listener('dragstop', on_dragstop);
    };

    this.set_event_handle = function(fire) {
        fire_event = fire;
    };

    this.tick = function() {
        for (var i in container.children) {
            var item = container.children[i];

            // Move the mint
            item.speed.dy += .1;
            item.y += item.speed.dy;
            item.x += item.speed.dx;
            item.rotation += item.speed.dtheta;

            var radius = item.size / 2;

            for (var i in hittable) {
                if (hittable[i](item)) {
                    container.removeChild(item);
                    fire_event('hit', [item]);
                }
            }

            if (item.x - radius > transform.provide.maxx || item.x + radius < transform.provide.minx || item.y - radius > transform.provide.maxy) {
                container.removeChild(item);
            }
        }
    };

    this.get_interface = function() {
        return {
            add_hittable: function(fn) {
                hittable.push(fn);
            },
        };
    };
};

core.add_feature('snowballs', new Snowballs());
