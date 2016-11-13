var Blocks = function() {
    var container;
    var dragging;
    var current_t;

    var inter = {};

    var block_img = new Image();
    block_img.src = 'img/snow-block.png';

    var block_img_broken = new Image();
    block_img_broken.src = 'img/snow-block-broken.png';

    this.init = function() {
        container = new createjs.Container();
        container.z = 15;

        stage.addChild(container);
    };

    this.post_init = function() {
        mods.floor.add_event_listener('drag', on_block_drag);
        mods.floor.add_event_listener('dragstop', on_block_dragstop);

        mods.snowballs.add_hittable(function(ball) {
            for (var i in container.children) {
                var block = container.children[i];
                var pt = container.localToLocal(ball.x, ball.y, block);

                if (block.hitTest(pt.x, pt.y)) {
                    block.hit_count++;

                    if (block.hit_count === 1) {
                        block.image = block_img_broken;
                    } else if (block.hit_count === 2) {
                        break_block(block);
                    }

                    return true;
                }
            }
        });
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
        block.on('click', function(e) {
            if (core.mouse_button === 'right') { return; }
            break_block(block);
        });

        block.unsupport = function(t) {
            t = t || 5;
            block.supports.forEach(function(b) {
                if (b) b.collapse_in = t;
            });
            block.supports = [];
            block.supported_by = undefined;
        };

        block.supports = [];
        block.collapse_in = -1;
        block.hit_count = 0;

        return block;
    }

    function break_block(block) {
        block.supports.forEach(function(b) {
            b.collapse_in = 0;
        });

        container.removeChild(block);

    }

    var first_drag = true;
    function on_block_drag(event) {
        if (core.mouse_button === 'left') { return; }
        if (!dragging) {
            dragging = create_block(event.rawX, event.rawY);
            container.addChild(dragging);
        }

        if (first_drag) {
            first_drag = false;

            if (dragging.supported_by) {
                var index = dragging.supported_by.supports.indexOf(dragging);
                dragging.supported_by.supports.splice(index, 1);
            }
            dragging.unsupport();
        }
        move_block(event.rawX, event.rawY);
    }

    function on_block_dragstop(event) {
        if (core.mouse_button === 'left') { return; }
        dragging.start_fall = current_t;
        dragging.start_fall_y = dragging.y;
        dragging.falling = true;
        dragging = null;
        first_drag = true;
    }

    function move_block(rawX, rawY) {
        var pos = transform.apply(rawX, rawY);
        dragging.x = pos.x;
        dragging.y = pos.y;
    }

    this.tick = function(t) {
        container.children.forEach(function(block) {
            if (block.collapse_in >= 0) {
                if (block.collapse_in === 0) {
                    block.falling = true;
                    block.start_fall = current_t;
                    block.start_fall_y = block.y;
                    block.unsupport();
                }

                block.collapse_in--;
            }

            if (block.falling) {
                block.y += 0.0098 * (t - block.start_fall);

                // Stop falling when it hits the gound
                var bottom = block.y + block.scaleY * block.regY;
                if (bottom > transform.provide.maxy - mods.floor.height && mods.floor.hit_test(block.x, bottom)) {
                    block.falling = false;
                }

                // Make blocks rest on one another
                container.children.forEach(function(b) {
                    if (b === block || b.falling ||
                        b.x + b.image.width * b.scaleX < block.x ||
                        b.x > block.x + block.image.width * block.scaleX ||
                        block.start_fall_y + (block.scaleY * block.image.height)> b.y) {
                            return;
                    }

                    var btop = b.y - b.scaleY * b.regY;
                    if (bottom >= btop) {
                        b.supports.push(block);
                        block.supported_by = b;
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
