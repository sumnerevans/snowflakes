var Blocks = function() {
    var blocks = [];
    var container;
    var img = new Image();
    img.src = 'img/snow-block.png';

    this.init = function() {
        container = new createjs.Container();
        container.z = 15;

        stage.addChild(container);
    };

    this.post_init = function() {
        mods.floor.add_event_listener('drag', on_floor_drag);
    }

    function create_block() {
        var block = new createjs.Bitmap();
        bitmap.tickEnabled = false;

        return block;
    }

    function on_floor_drag() {
        console.log(arguments);
    }
};

core.add_feature('blocks', new Blocks());
