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

    this.get_interface = function() { return inter; };

    this.set_event_handle = function(fire) { fire_event = fire; };

    function on_drag() {
        fire_event('drag', Array.prototype.slice.call(arguments));
    }

    function on_drag_stop() {
        fire_event('dragstop', Array.prototype.slice.call(arguments));
    }

};

core.add_feature('floor', new Floor());
