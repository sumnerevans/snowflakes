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
	var p = this.provide;
	var c = this.canvas;
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

Transform.prototype.fromScreen = function(sx, sy) {
	return {
		x: this.provide.minx + (sx / this.canvas.width) * this.provide.sizex,
		y: this.provide.miny + (sy / this.canvas.height) * this.provide.sizey
	};
};
