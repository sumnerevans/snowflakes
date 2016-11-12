var Snowflakes = function() {

    var container;
    var images = [];

    for (var i = 0; i < 18; i++) {
        var image = new Image();
        image.src = 'img/flake{0}.png'.format(i);
        images.push(image);
    }

    this.create_snowflake = function() {
        var rand_img_num = core.rand(0, 17),
            bitmap = new createjs.Bitmap(images[rand_img_num]),
            scale = core.rand_float(0.02, 0.1);

        bitmap.tickEnabled = false;
        bitmap.x = core.rand(transform.provide.minx, transform.provide.sizex);
        bitmap.y = transform.provide.miny - scale * bitmap.image.height;
        bitmap.scaleX = bitmap.scaleY = scale;
        bitmap.regX = bitmap.image.width / 2;
        bitmap.regY = bitmap.image.height / 2;

        bitmap.speed = {
            dx: core.rand_float(-0.2, 0.2),
            dy: core.rand_float(0.2, 0.4),
            dtheta: core.rand_float(-3, 3),
        };

        return bitmap;
    };

    this.init = function() {
        container = new createjs.Container();
        container.z = -1;

        // Create the inital snowflakes
        for (var i = 0; i < 100; i++) {
            var flake = this.create_snowflake();
            flake.y = transform.provide.maxy - Math.random() * transform.provide.sizey;
            container.addChild(flake);
        }

        stage.addChild(container);
    };

    this.tick = function() {
        for (var i = 0; i < container.children.length; i++) {
            var flake = container.children[i];

            // Move the flake
            flake.y += flake.speed.dy;
            flake.x += flake.speed.dx;
            flake.rotation += flake.speed.dtheta;

            // If the flake has reached the bottom of the screen, replace it with one at the top.
            if (flake.y > transform.provide.maxy) {
                container.children[i] = this.create_snowflake();
            }
        }
    };

    this.resize = function(current, old) {
        container.children.forEach(function(flake) {
            var x = flake.x;
            x -= old.provide.minx;
            x /= old.provide.sizex;
            x *= current.provide.sizex;
            x += current.provide.minx;
            flake.x = x;
        });
    }
};

core.add_feature(new Snowflakes());
