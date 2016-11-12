var Penguin = function () {
    var image_front = new createjs.Bitmap('img/tux.png');
    image_front.tickEnabled = false;

    this.init = function () {
        container = new createjs.Container();
        this.resize();
        container.addChild(image_front);
        container.z = 10;
        stage.addChild(container);
    };

    this.resize = function () {
        var scale = transform.provide.sizex / image_front.image.width / 10;
        image_front.x =
            (transform.provide.sizex - transform.provide.minx)/2
            - (image_front.image.width * scale)/2
            + transform.provide.minx;
        image_front.scaleX = scale;
        image_front.scaleY = scale;
        image_front.y = transform.provide.maxy
            - (image_front.image.height + 200) * scale;
    };
};

core.add_feature(new Penguin());
