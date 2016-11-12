core.add_feature(new (function() {
    this.init = function() {
        var container = new createjs.Container();
        var bitmap = new createjs.Bitmap("img/flake0.png");

        container.addChild(bitmap);

        stage.addChild(container);
    };
})());
