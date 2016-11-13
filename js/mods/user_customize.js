var UserCustomize = function() {
    this.name = 'usercustomize';

    var hex = "0123456789ABCDEF";

    function rand_color() {
        var color = "#";
        for (var i = 0; i < 6; i++) {
            color += hex.charAt(core.rand(0, 16));
        }
        return color;
    }

    this.name = "user_customize";

    this.key_event = function(key, state) {
        if (state) {
            switch(key.key) {
                case "c":
                    core.set_background({color: rand_color()});
                    break;
                case "d":
                    core.set_background({color: prompt("Background color:\nex: red, #FF0000, rgb(255, 0, 0)", stage.canvas.style.backgroundColor)});
                    break;
            }
        }
    };
};

UserCustomize.prototype = ModBase;

core.add_feature(new UserCustomize());
