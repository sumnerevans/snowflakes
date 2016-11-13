# snowflakes
ACM JS Hackathon game by bungle.js

## Feature functions
Each feature can provide the following functions:
#### init()
Called once EaselJS is initialized.
#### post_init()
Called after init is called on all features and after the Containers are sorted.
#### tick(time)
Called 30 times per second. Takes an argument `time` which represents the time (in milliseconds) since the page loaded.
#### resize(transform, old)
Called if the canvas is resized after init. Takes arguments `transform, old` which represent the current transform and the transform before the resize.
## Feature exposure
Each feature must also provide a string `name`. Then other features will be able to access the provided object `expose` at `mods.[name]`. For example, this is used by `snowflakes.js` to provide `mods.snowflakes.add_pop_listener(func)`.
