var Floor = function() {
    var container;
    var bitmap = new createjs.Bitmap("img/floor.png");
    bitmap.tickEnabled = false;

    var inter = {};
    var fire_event;

    this.init = function() {
        container = new createjs.Container();
        container.z = 20;

        this.resize();
        container.addChild(bitmap);

        stage.addChild(container);
    };

    this.post_init = function() {
        mods.candycane.add_hittable(function(candy_cane) {
            return inter.hit_test(candy_cane.x, candy_cane.y);
        });

        mods.snowballs.add_hittable(function(ball) {
            return inter.hit_test(ball.x, ball.y);
        });
    }

    this.resize = function() {
        bitmap.x = transform.provide.minx;

        var scale = transform.provide.sizex / bitmap.image.width;
        bitmap.scaleX = scale;
        bitmap.scaleY = scale;

        bitmap.y = transform.provide.maxy - bitmap.image.height * scale;

        bitmap.on('pressmove', on_drag);
        bitmap.on('pressup', on_drag_stop);

        inter.height = bitmap.image.height * scale;
    };

    inter.hit_test = function(x, y) {
        var pt = container.localToLocal(x, y, bitmap);
        var hit = bitmap.hitTest(pt.x, pt.y);
        return hit;
    };

    this.get_interface = function() {
        return inter;
    };

    this.set_event_handle = function(fire) {
        fire_event = fire;
    };

    function on_drag(e) {
        fire_event('drag', Array.prototype.slice.call(arguments));
    }

    function on_drag_stop() {
        fire_event('dragstop', Array.prototype.slice.call(arguments));
    }

};

core.add_feature('floor', new Floor());
