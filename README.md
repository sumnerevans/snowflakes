# snowflakes
ACM JS Hackathon game by bungle.js

## Feature functions
Each feature can provide the following functions:

#### init()
Called once EaselJS is initialized.

#### post_init()
Called after init is called on all features and after the Containers are sorted.

#### tick(time)
Called 30 times per second. Takes an argument `time` which represents the time (in milliseconds)
since the page loaded.

#### resize(transform, old)
Called if the canvas is resized after init. Takes arguments `transform, old` which represent the
current transform and the transform before the resize.

#### key_event(key, state)
Called when a key is pressed. Takes arguments `key, state` which store a standard `KeyboardEvent`
and whether it was a press (true) / release (false), respectively.

#### get_interface()
Called in `add_feature`. Returns an object that should be exposed to other features as
`mods.[featurename]`. A function `add_event_listener(event, fn)` will be added to the object. If
`get_interface` is not present or returns undefined, an empty object will be used instead.

#### set_event_handle(handle)
Called in `add_feature`. Passes a function `handle` used to fire events on this feature. For
example, `handle('eventname', [argument1, argument2])` calls all listeners for event "eventname" on
this feature with the arguments `argument1, argument2`.
