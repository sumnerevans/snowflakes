var Floor = function() {
    this.extends = ModBase;
    this.name = 'floor';

    var container;
    var bitmap = new createjs.Bitmap("img/floor.png");
    bitmap.tickEnabled = false;

    this.name = "floor";

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

        this.expose.height = bitmap.image.height * scale;
    };

    function on_drag() {
        this.fire_event('drag', ['awesome']);
    };

    this.expose = {};
};

Floor.prototype = ModBase;

core.add_feature(new Floor());
