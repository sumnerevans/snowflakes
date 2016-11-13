var CandyCane = function() {
    var candy_canes = [];
    var container;
    var dragging;
    var current_t;

    var candy_cane_img = new Image();
    candy_cane_img.src = 'img/candycane.png';

    this.init = function() {
        container = new createjs.Container();
        container.z = 10.25;

        stage.addChild(container);
    };

    this.post_init = function() {
        mods.blocks.add_event_listener('block_created', on_block_created);
    };

    function create_new_candy_cane() {
        var candy_cane = new createjs.Bitmap();
        candy_cane.image = candy_cane_img;
        candy_cane.tickEnabled = false;

        var scale = 0.1;
        candy_cane.scaleX = candy_cane.scaleY = scale;
        candy_cane.regX = candy_cane.image.width / 2;
        candy_cane.regY = candy_cane.image.height / 2;
        candy_cane.size = candy_cane.image.height * scale;
        candy_cane.start_fall = current_t;
        candy_cane.falling = true;
        candy_cane.x = core.rand_float(transform.provide.minx, transform.provide.maxx);
        candy_cane.y = transform.provide.miny - candy_cane.image.height * scale;

        return candy_cane;
    }

    function on_block_created(block, num_blocks) {
        if (num_blocks % 2 === 0 && num_blocks > 1) {
            candy_canes.push(create_new_candy_cane());
        }
    }

    this.tick = function(t) {
        candy_canes.forEach(function(candy_cane) {
            if (candy_cane.falling) {
                candy_cane.y -= 0.0098 * (t - candy_cane.start_fall);
            }

            var bottom = candy_cane.y + candy_cane.scaleY * candy_cane.regY;
            if (bottom > transform.provide.maxy - mods.floor.height && mods.floor.hit_test(candy_cane.x, bottom)) {
                candy_cane.falling = false;
            }
        });

        current_t = t;
    };
};

core.add_feature('candycane', new CandyCane());
