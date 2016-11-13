var Blocks = function() {
    var blocks = [];
    var container;
    var dragging;
    var current_t;

    var block_img = new Image();
    block_img.src = 'img/snow-block.png';

    this.init = function() {
        container = new createjs.Container();
        container.z = 15;

        stage.addChild(container);
    };

    this.post_init = function() {
        mods.floor.add_event_listener('drag', on_block_drag);
        mods.floor.add_event_listener('dragstop', on_block_dragstop);
    };

    function create_block(x, y) {
        var block = new createjs.Bitmap();
        block.image = block_img;
        block.tickEnabled = false;

        var scale = core.rand_float(0.09, 0.11);

        block.scaleX = block.scaleY = scale;
        block.regX = block.image.width / 2;
        block.regY = block.image.height / 2;
        block.size = block.image.heigth * scale;

        block.on('pressmove', function() {
            dragging = this;
            on_block_drag.apply(undefined, arguments);
        });
        block.on('pressup', on_block_dragstop);

        return block;
    }

    function on_block_drag(event) {
        if (!dragging) {
            dragging = create_block(event.rawX, event.rawY);
            blocks.push(dragging);
            container.addChild(dragging);
        }

        console.log(arguments);
        move_block(event.rawX, event.rawY);
    }

    function on_block_dragstop(event) {
        dragging.start_fall = current_t;
        dragging.start_fall_y = dragging.y;
        dragging.falling = true;
        dragging = null;
    }

    function move_block(rawX, rawY) {
        var pos = transform.apply(rawX, rawY);
        dragging.x = pos.x;
        dragging.y = pos.y;
    }

    this.tick = function(t) {
        blocks.forEach(function(block) {
            if (block.falling) {
                block.y += 0.0098 * (t - block.start_fall);

                // Stop falling when it hits the gound
                var bottom = block.y + block.scaleY * block.regY;
                if (bottom > transform.provide.maxy - mods.floor.height && mods.floor.hit_test(block.x, bottom)) {
                    block.falling = false;
                }

                blocks.forEach(function(b) {
                    if (b === block || b.falling ||
                        b.x + b.image.width * b.scaleX < block.x ||
                        b.x > block.x + block.image.width * block.scaleX ||
                        block.start_fall_y + (block.scaleY * block.image.height)> b.y) {
                            return;
                    }

                    var btop = b.y - b.scaleY * b.regY;
                    if (bottom >= btop) {
                        block.falling = false;
                        block.y = btop - block.scaleY * block.regY;
                    }
                });
            }
        });
        current_t = t;
    };

};

core.add_feature('blocks', new Blocks());
