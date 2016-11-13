var Snowballs = function() {
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

    this.set_event_handle = function(fire) { fire_event = fire; };

    function create_peppermint() {
        var bitmap = new createjs.Bitmap();
        bitmap.image = image;

        var scale = 10 / image.width;

        bitmap.x = core.rand(transform.provide.minx, transform.provide.sizex);
        bitmap.y = transform.provide.miny - scale * image.height;
        bitmap.scaleX = bitmap.scaleY = scale;
        bitmap.regX = image.width / 2;
        bitmap.regY = image.height / 2;
        bitmap.size = image.height * scale;

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
        for (var i in container.children) {
            var ball = container.children[i];

            // Move the mint
            ball.speed.dy += .1;
            ball.y += ball.speed.dy;
            ball.x += ball.speed.dx;
            ball.rotation += ball.speed.dtheta;

            // If the mint has reached the bottom of the screen, replace
            // it with one at the top.
            if (ball.y > transform.provide.maxy - mods.floor.height * .2) {
                container.removeChild(mint);
                fire_event('hit', [ball]);
            }
        }
    };
};

core.add_feature('snowballs', new Snowballs());
