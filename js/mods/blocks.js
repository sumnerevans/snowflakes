var Blocks = function() {

    var img = new Image();
    img.src = 'img/snow-block.png';

    var blocks = [];

    var container;

    this.init = function() {
        container = new createjs.Container();
        container.z = 15;

        stage.addChild(container);
    };

    function create_block() {
        var block = new createjs.Bitmap();
        bitmap.tickEnabled = false;
    }

};

core.add_feature(new Blocks());
