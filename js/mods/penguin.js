var Penguin = function () {
    var image_front = new createjs.Bitmap('img/tux.png');
    image_front.tickEnabled = false;
    image_front.regX = 277;
    image_front.regY = 600;

    var tallness;
    var vis = false;

    this.init = function () {
        container = new createjs.Container();
        this.resize();
        container.z = 10;

        stage.addChild(container);
    };

    this.resize = function () {
        var scale = 13 / image_front.image.width;
        image_front.x = transform.provide.minx + transform.provide.sizex * .5;
        image_front.scaleX = scale;
        image_front.scaleY = scale;

        tallness = scale * image_front.image.height;
        image_front.y = transform.provide.maxy
                        - mods.floor.height * .2
                        - tallness
                        + image_front.regY * scale;
    };

    this.tick = function (t) {
        image_front.rotation = 6*Math.sin(0.013*t);
    };

    this.get_interface = function() {
        return {
            spawn: function() { 
                if (!vis) {
                    container.addChild(image_front);
                    vis = true;
                }
            }
        };
    };
};

core.add_feature('penguin', new Penguin());
