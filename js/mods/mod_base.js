var ModBase = new (function() {
    this.event_listeners = {};

    this.add_event_listener = function(event, fn, scope) {
        this.event_listeners[event] = this.event_listeners[event] || [];

        this.event_listeners[event].push({
            fn: fn,
            scope: scope,
        });
    };

    this.fire_event = function(event, args) {
        args.push(event);
        this.event_listeners[event].forEach(function(event_listener) {
            event_listener.fn.apply(event_listener.scope, args);
        });
    };
})();

