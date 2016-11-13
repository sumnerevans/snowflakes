var Floor = function() {
    var container;
    var bitmap = new createjs.Bitmap("img/floor.png");
    bitmap.tickEnabled = false;

    var inter = {};

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

        inter.height = bitmap.image.height * scale;
    };

    this.get_interface = function() { return inter; };

    function on_drag() {
        mods.floor.fire_event('drag', ['awesome']);
    };
};

core.add_feature('floor', new Floor());
