var Snowballs = function() {
    var container;

    var fire_event;

    var snowball = new Image();
    snowball.src = 'img/snowball.png';

    var bigball = new Image();
    bigball.src = 'img/big_snowball.png';


    var iceicle = new Image();
    iceicle.src = 'img/iceicle.png';

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
