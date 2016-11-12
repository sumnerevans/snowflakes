var Snowflakes = function() {

    var containers = [];
    var images = [];

    var snowflake_counter = 0;

    for (var i = 0; i < 18; i++) {
        var image = new Image();
        image.src = 'img/flake{0}.png'.format(i);
        images.push(image);
    }

    this.init = function() {
        containers.push(new createjs.Container());
        containers.push(new createjs.Container());
        containers[0].z = 1;
        containers[1].z = 11;

        // Create the inital snowflakes
        for (var i = 0; i < 100; i++) {
            var flake = create_snowflake();
            flake.y = transform.provide.maxy - Math.random() * transform.provide.sizey - flake.size;
            containers[core.rand(0, 1)].addChild(flake);
        }

        for (i = 0; i < 2; i++) {
            stage.addChild(containers[i]);
        }
    };

    function init_snowflake(bitmap) {

        var rand_img_num = core.rand(0, 17);
        var scale = core.rand_float(0.02, 0.1);

        bitmap.image = images[rand_img_num];

        bitmap.x = core.rand(transform.provide.minx, transform.provide.sizex);
        bitmap.y = transform.provide.miny - scale * bitmap.image.height;
        bitmap.scaleX = bitmap.scaleY = scale;
        bitmap.regX = bitmap.image.width / 2;
        bitmap.regY = bitmap.image.height / 2;
        bitmap.size = bitmap.image.height * scale;

        bitmap.speed = {
            dx: core.rand_float(-0.2, 0.2),
            dy: core.rand_float(0.2, 0.4),
            dtheta: core.rand_float(-3, 3),
        };

    };

    function create_snowflake() {

        var bitmap = new createjs.Bitmap();
        init_snowflake(bitmap);
        bitmap.tickEnabled = false;

        bitmap.addEventListener('click', function() {
            snowflake_counter++;
            init_snowflake(bitmap);
        });

        return bitmap;
    };

    this.tick = function() {
        for (var i = 0; i < containers.length; i++) {
            var container = containers[i];

            for (var j = 0; j < container.children.length; j++) {
                var flake = container.children[j];

                // Move the flake
                flake.y += flake.speed.dy;
                flake.x += flake.speed.dx;
                flake.rotation += flake.speed.dtheta;

                // If the flake has reached the bottom of the screen, replace
                // it with one at the top.
                if (flake.y > transform.provide.maxy + flake.size) {
                    init_snowflake(container.children[j]);
                }
            }
        }
    };

    this.resize = function(current, old) {
        for (var i = 0; i < containers.length; i++) {
            containers[i].children.forEach(function(flake) {
                var x = flake.x;
                x -= old.provide.minx;
                x /= old.provide.sizex;
                x *= current.provide.sizex;
                x += current.provide.minx;
                flake.x = x;
            });
        }
    };

};

core.add_feature(new Snowflakes());
