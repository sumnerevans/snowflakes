var CandyCane = function() {
    var container;
    var current_t;
    var drag_start;

    var candy_cane_img = new Image();
    candy_cane_img.src = 'img/candycane.png';

    this.init = function() {
        container = new createjs.Container();
        container.z = 10.25;

        stage.addChild(container);
    };

    this.post_init = function() {
        mods.penguin.add_event_listener('drag', on_penguin_drag);
        mods.penguin.add_event_listener('dragstop', on_penguin_dragstop);
    };

    function create_candy_cane(settings) {
        var candy_cane = new createjs.Bitmap();
        candy_cane.image = candy_cane_img;
        candy_cane.tickEnabled = false;

        candy_cane.size = 7;
        var scale = candy_cane.size / candy_cane_img.width;
        candy_cane.x = settings.x;
        candy_cane.y = settings.y;
        candy_cane.scaleX = candy_cane.scaleY = scale;
        candy_cane.regX = candy_cane_img.width / 2;
        candy_cane.regY = candy_cane_img.height / 2;

        candy_cane.speed = {
            dx: settings.dx,
            dy: settings.dy,
            dtheta: core.rand_float(-5, 5),
        };

        return candy_cane;
    }

    function on_penguin_drag(event) {
        if (!drag_start) {
            drag_start = transform.apply(event.rawX, event.rawY);
        }
    }

    function on_penguin_dragstop(event) {
        if (drag_start) {
            var drag_end = transform.apply(event.rawX, event.rawY);
            var dx = drag_end.x - drag_start.x;
            var dy = drag_end.y - drag_start.y;
            var mag = Math.sqrt(dx * dx + dy * dy);
            dx /= mag;
            dy /= mag;

            var speed = Math.min(mag / 10, 3);
            dx *= speed;
            dy *= speed;

            container.addChild(create_candy_cane({
                x: drag_end.x,
                y: drag_end.y,
                dx: dx,
                dy: dy,
            }));

            drag_start = undefined;
        }
    }

    this.tick = function(t) {
        for (var i in container.children) {
            var item = container.children[i];

            // Move the mint
            item.speed.dy += 0.1;
            item.y += item.speed.dy;
            item.x += item.speed.dx;
            item.rotation += item.speed.dtheta;
        }
    };
};

core.add_feature('candycane', new CandyCane());
