function Transform(minx, maxx, miny, maxy, alignx, aligny, fit) {
	var a = this.request = {};
	a.minx = minx;
	a.maxx = maxx;
	a.miny = miny;
	a.maxy = maxy;
	a.alignx = alignx;
	a.aligny = aligny;
	a.fit = fit;

	this.provide = {};
	this.canvas = {};
}
Transform.prototype.update = function(width, height) {
	var p = this.provide = {};
	var c = this.canvas = {};
	var a = this.request;

	c.width = width;
	c.height = height;

	// fit/fill in window and fix stretching
	var scalex = (a.maxx - a.minx) / c.width;
	var scaley = (a.maxy - a.miny) / c.height;

	if (scalex > scaley) {
		c.scale = scalex * a.fit + scaley * (1 - a.fit);
	} else {
		c.scale = scaley * a.fit + scalex * (1 - a.fit);
	}

	p.centerx = a.minx * (1. - a.alignx) + a.maxx * a.alignx;
	p.centery = a.miny * (1. - a.aligny) + a.maxy * a.aligny;

	p.sizex = c.scale * c.width;
	p.sizey = c.scale * c.height;

	p.minx = p.centerx - p.sizex * a.alignx;
	p.maxx = p.centerx + p.sizex * (1. - a.alignx);
	p.miny = p.centery - p.sizey * a.aligny;
	p.maxy = p.centery + p.sizey * (1. - a.aligny);
};

Transform.prototype.applyToContainer = function(container) {
	var scale = this.canvas.scale;
	var tx = this.provide.minx / scale;
	var ty = this.provide.miny / scale;
	container.setTransform(-tx, -ty, 1 / scale, 1 / scale);
};

Transform.prototype.apply = function(sx, sy) {
	return {
		x: this.provide.minx + (sx / this.canvas.width) * this.provide.sizex,
		y: this.provide.miny + (sy / this.canvas.height) * this.provide.sizey
	};
};
Transform.prototype.unapply = function(sx, sy) {
	return {
		x: (sx - this.provide.minx) / this.provide.sizex * this.canvas.width,
		y: (sy - this.provide.miny) / this.provide.sizey * this.canvas.height
	};
};
Transform.prototype.redistribute = function(old, oldx, oldy) {
	var x = oldx;
    x -= old.provide.minx;
    x /= old.provide.sizex;
    x *= this.provide.sizex;
    x += this.provide.minx;

    var y = oldy;
    y -= old.provide.miny;
    y /= old.provide.sizey;
    y *= this.provide.sizey;
    y += this.provide.miny;

	return {
		x: x,
		y: y
	};
};
Transform.prototype.clone = function() {
	var out = new Transform(
		this.request.minx,
		this.request.maxx,
		this.request.miny,
		this.request.maxy,
		this.request.alignx,
		this.request.aligny,
		this.request.fit);
	out.update(this.canvas.width, this.canvas.height);
	return out;
}
