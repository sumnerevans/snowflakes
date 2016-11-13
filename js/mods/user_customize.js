var UserCustomize = function() {
    var hex = "0123456789ABCDEF"

    function rand_color() {
        var color = "#";
        for (var i = 0; i < 6; i++) {
            color += hex.charAt(core.rand(0, 16));
        }
        return color;
    }

    this.key_event = function(key, state) {
        if (state && key.key == "c") {
            core.set_background({color: rand_color()})
        }
    };
};

core.add_feature(new UserCustomize());
