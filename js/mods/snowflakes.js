var Snowflakes = function() {

    var container;
    var images = [];

    this.create_snowflake = function() {
        var rand_img_num = core.rand(1, 16);
        var bitmap = new createjs.Bitmap(images[rand_img_num]);
        var scale = core.rand_float(0.02, 0.1);

        bitmap.x = core.rand(transform.provide.minx, transform.provide.sizex);
        bitmap.y = transform.provide.miny - Math.random() * transform.provide.sizey;
        bitmap.scaleX = scale;
        bitmap.scaleY = scale;

        return bitmap;
    };

    this.init = function() {
        container = new createjs.Container();
        container.z = -1;

        // Load the images
        for (var i = 1; i <= 17; i++) {
            var image = new Image();
            image.src = 'img/flake{0}.png'.format(i);
            images.push(image);
        }

        for (var i = 0; i < 100; i++) {
            container.addChild(this.create_snowflake());
        }

        stage.addChild(container);
    };

    this.tick = function() {
        // TODO: Spawn more
        container.children = container.children.filter(function(flake) {
            flake.y += 0.2;
            return flake.y < transform.provide.maxy;
        });
    };
};

core.add_feature(new Snowflakes());
