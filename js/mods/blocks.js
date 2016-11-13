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
        block.dragging = true;
        block.tickEnabled = false;

        var scale = core.rand_float(0.09, 0.11);

        block.scaleX = block.scaleY = scale;
        block.regX = block.image.width / 2;
        block.regY = block.image.height / 2;
        block.size = block.image.heigth * scale;

        return block;
    }

    function on_block_drag(event) {
        if (!dragging) {
            dragging = create_block(event.rawX, event.rawY);
            blocks.push(dragging);
            container.addChild(dragging);
        }

        move_block(event.rawX, event.rawY);
    }

    function on_block_dragstop(event) {
        dragging.dragging = false;
        dragging.start_fall = current_t;
        dragging.start_fall_y = dragging.y;
        dragging.falling = true;

        dragging.on('pressmove', function(e) {
            dragging = e.currentTarget;
            dragging.dragging = true;
            dragging.falling = false;
            on_block_drag(arguments);
        });
        dragging.on('pressup', on_block_dragstop);

        dragging = null;
    }

    function move_block(rawX, rawY) {
        dragging.x = (rawX / transform.canvas.width) * transform.provide.sizex;
        dragging.y = (rawY / transform.canvas.height) * transform.provide.sizey -
            dragging.image.height * 2 * dragging.scaleY;
    }

    this.tick = function(t) {
        blocks.forEach(function(block) {
            if (!block.dragging && block.falling) {
                block.y += 0.0098 * (t - block.start_fall);

                // Stop falling when it hits the gound
                if (block.y + (block.scaleY * block.image.height) >= transform.provide.sizey - mods.floor.height) {
                    block.falling = false;
                    block.y = (transform.provide.sizey - mods.floor.height) - (block.scaleY * block.image.height) / 1.5;
                }

                blocks.forEach(function(b) {
                    if (b === block || b.falling ||
                        b.x + b.image.width * b.scaleX < block.x ||
                        b.x > block.x + block.image.width * block.scaleX ||
                        block.start_fall_y + (block.scaleY * block.image.height)> b.y) {
                            return;
                    }

                    if (block.y + (block.scaleY * block.image.height) >= b.y) {
                        block.falling = false;
                        block.y = b.y - (block.scaleY * block.image.height);
                    }
                });
            }
        });
        current_t = t;
    };

};

core.add_feature('blocks', new Blocks());
