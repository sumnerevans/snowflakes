var stage;
var canvas = document.getElementById('canvas'); 
var transform = new Transform(0, 100, 0, 100, .5, 1, 1);

function resize_canvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
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
	createjs.Ticker.addEventListener("tick", tick);

	var circle = new createjs.Shape();
	circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
	circle.x = 50;
	circle.y = 50;
	stage.addChild(circle);

	resize_canvas();
}