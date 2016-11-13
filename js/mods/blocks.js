var Blocks = function() {
    this.name = 'blocks';

    var blocks = [];
    var container;
    var img = new Image();
    img.src = 'img/snow-block.png';

    this.init = function() {
        container = new createjs.Container();
        container.z = 15;

        stage.addChild(container);

        core.get_feature('floor').add_event_listener('drag', on_floor_drag);
    };

    function create_block() {
        var block = new createjs.Bitmap();
        bitmap.tickEnabled = false;

        return block;
    }

    function on_floor_drag() {
        console.log(arguments);
    }

};

Blocks.prototype = ModBase;

core.add_feature(new Blocks());
