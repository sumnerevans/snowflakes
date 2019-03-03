var Peppermints = function() {
    var container;

    var peppermint_counter = 0;

    var initial_wait = 100;
    var to_wait = initial_wait;

    var fire_event;

    var image = new Image();
    image.src = 'img/peppermint.png';

    this.init = function() {
        container = new createjs.Container();
        container.z = 10.5;

        stage.addChild(container);
    };

    this.post_init = function() {
        mods.snowflakes.add_event_listener('pop', function() {
            to_wait -= 10;
        });
    };

    this.set_event_handle = function(fire) {
        fire_event = fire;
    };

    function create_peppermint() {
        var bitmap = new createjs.Bitmap();
        bitmap.image = image;

        var scale = 10 / image.width;

        bitmap.size = image.height * scale;
        bitmap.x = core.rand(transform.provide.minx, transform.provide.maxx);
        bitmap.y = transform.provide.miny - bitmap.size;
        bitmap.scaleX = bitmap.scaleY = scale;
        bitmap.regX = image.width / 2;
        bitmap.regY = image.height / 2;

        bitmap.speed = {
            dx: core.rand_float(-0.2, 0.2),
            dy: core.rand_float(0.2, 0.4),
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

    this.tick = function() {
        if (to_wait < 0) {
            to_wait = initial_wait;
            container.addChild(create_peppermint());
        }

        for (var i in container.children) {
            var mint = container.children[i];

            // Move the mint
            mint.y += mint.speed.dy;
            mint.x += mint.speed.dx;
            mint.rotation += mint.speed.dtheta;

            // If the mint has reached the bottom of the screen, replace
            // it with one at the top.
            if (mint.y > transform.provide.maxy + mint.size) {
                container.removeChild(mint);
            }
        }
    };

    this.resize = function(current, old) {
        container.children.forEach(function(mint) {
            var pos = current.redistribute(old, mint.x, mint.y);
            mint.x = pos.x;
            mint.y = pos.y;
            var x = mint.x;
        });
    };

    this.get_interface = function() {
        return {
            get_pop_count: function() {
                return peppermint_counter;
            }
        };
    };
};

core.add_feature('peppermints', new Peppermints());
