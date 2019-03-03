var UserCustomize = function() {
    function rand_color() {
        return "#" + ("000000" + core.rand(0, 1 << 24 - 1).toString(16)).slice(-6);
    }

    this.key_event = function(key, state) {
        if (state) {
            switch (key.key) {
                case "c":
                    core.set_background({
                        color: rand_color(),
                    });
                    break;
                case "d":
                    core.set_background({
                        color: prompt("Background color:\nex: red, #FF0000, rgb(255, 0, 0)", stage.canvas.style.backgroundColor),
                    });
                    break;
            }
        }
    };
};

core.add_feature('usercustomize', new UserCustomize());
