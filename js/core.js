var stage;
var transform = new Transform(0, 100, 0, 100, .5, 1, 1);

function resize_canvas() {
	stage.canvas.width = window.innerWidth;
	stage.canvas.height = window.innerHeight;
	transform.update(canvas.width, canvas.height);
	transform.applyToContainer(stage);
	stage.update();
}
window.addEventListener('resize', resize_canvas, false);

function tick() {
    stage.update();
}

function canvas_init() {
	stage = new createjs.Stage("canvas");

	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", tick);

	stage.canvas.style.backgroundColor = "#ff0800";

	var circle = new createjs.Shape();
	circle.graphics.beginFill("#FFFAFA").drawCircle(0, 0, 50);
	circle.x = 50;
	circle.y = 50;
	stage.addChild(circle);

	resize_canvas();
}