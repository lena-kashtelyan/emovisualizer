/**
 * EaselJS
 * Visit http://easeljs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2011 Grant Skinner
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 **/
(function(m) {
    function e() {
        throw "UID cannot be instantiated";
    }
    e._nextID = 0;
    e.get = function() {
        return e._nextID++
    };
    m.UID = e
})(window);
(function(m) {
    function e() {
        throw "Ticker cannot be instantiated.";
    }
    e._listeners = [];
    e._pauseable = [];
    e._paused = false;
    e._inited = false;
    e._startTime = 0;
    e._pausedTime = 0;
    e._ticks = 0;
    e._pausedTickers = 0;
    e._interval = 50;
    e._intervalID = null;
    e._lastTime = 0;
    e._times = [];
    e.addListener = function(c, a) {
        if (!e._inited) {
            e._inited = true;
            e.setInterval(e._interval)
        }
        this.removeListener(c);
        e._pauseable[e._listeners.length] = a == null ? true : a;
        e._listeners.push(c)
    };
    e.removeListener = function(c) {
        if (e._listeners != null) {
            c = e._listeners.indexOf(c);
            if (c != -1) {
                e._listeners.splice(c, 1);
                e._pauseable.splice(c, 1)
            }
        }
    };
    e.removeAllListeners = function() {
        e._listeners = [];
        e._pauseable = []
    };
    e.setInterval = function(c) {
        e._intervalID != null && clearInterval(e._intervalID);
        e._lastTime = e._getTime();
        e._interval = c;
        e._intervalID = setInterval(e._tick, c)
    };
    e.getInterval = function() {
        return e._interval
    };
    e.getFPS = function() {
        return 1E3 / e._interval
    };
    e.setFPS = function(c) {
        e.setInterval(1E3 / c)
    };
    e.getMeasuredFPS = function(c) {
        if (e._times.length < 2) return -1;
        if (c == null) c = e.getFPS() >> 1;
        c =
            Math.min(e._times.length - 1, c);
        return 1E3 / ((e._times[0] - e._times[c]) / c)
    };
    e.setPaused = function(c) {
        e._paused = c
    };
    e.getPaused = function() {
        return e._paused
    };
    e.getTime = function(c) {
        return e._getTime() - e._startTime - (c ? e._pausedTime : 0)
    };
    e.getTicks = function(c) {
        return e._ticks - (c ? e._pausedTickers : 0)
    };
    e._tick = function() {
        e._ticks++;
        var c = e.getTime(false),
            a = c - e._lastTime,
            b = e._paused;
        if (b) {
            e._pausedTickers++;
            e._pausedTime += a
        }
        e._lastTime = c;
        for (var d = e._pauseable, f = e._listeners, g = f ? f.length : 0, h = 0; h < g; h++) {
            var i = d[h],
                j = f[h];
            j == null || b && i || j.tick == null || j.tick(a)
        }
        e._times.unshift(c);
        e._times.length > 100 && e._times.pop()
    };
    e._getTime = function() {
        return (new Date).getTime()
    };
    e._startTime = e._getTime();
    m.Ticker = e
})(window);
(function(m) {
    function e(a, b, d) {
        this.initialize(a, b, d)
    }
    var c = e.prototype;
    c.stageX = 0;
    c.stageY = 0;
    c.type = null;
    c.onMouseMove = null;
    c.onMouseUp = null;
    c.initialize = function(a, b, d) {
        this.type = a;
        this.stageX = b;
        this.stageY = d
    };
    c.clone = function() {
        return new e(this.type, this.stageX, this.stageY)
    };
    c.toString = function() {
        return "[MouseEvent (type=" + this.type + " stageX=" + this.stageX + " stageY=" + this.stageY + ")]"
    };
    m.MouseEvent = e
})(window);
(function(m) {
    function e(a, b, d, f, g, h) {
        this.initialize(a, b, d, f, g, h)
    }
    var c = e.prototype;
    e.identity = null;
    e.DEG_TO_RAD = Math.PI / 180;
    c.a = 1;
    c.b = 0;
    c.c = 0;
    c.d = 1;
    c.tx = 0;
    c.ty = 0;
    c.alpha = 1;
    c.shadow = null;
    c.compositeOperation = null;
    c.initialize = function(a, b, d, f, g, h) {
        if (a != null) this.a = a;
        if (b != null) this.b = b;
        if (d != null) this.c = d;
        if (f != null) this.d = f;
        if (g != null) this.tx = g;
        if (h != null) this.ty = h
    };
    c.prepend = function(a, b, d, f, g, h) {
        var i = this.tx;
        if (a != 1 || b != 0 || d != 0 || f != 1) {
            var j = this.a,
                l = this.c;
            this.a = j * a + this.b * d;
            this.b = j * b + this.b *
                f;
            this.c = l * a + this.d * d;
            this.d = l * b + this.d * f
        }
        this.tx = i * a + this.ty * d + g;
        this.ty = i * b + this.ty * f + h
    };
    c.append = function(a, b, d, f, g, h) {
        var i = this.a,
            j = this.b,
            l = this.c,
            k = this.d;
        this.a = a * i + b * l;
        this.b = a * j + b * k;
        this.c = d * i + f * l;
        this.d = d * j + f * k;
        this.tx = g * i + h * l + this.tx;
        this.ty = g * j + h * k + this.ty
    };
    c.prependMatrix = function(a) {
        this.prepend(a.a, a.b, a.c, a.d, a.tx, a.ty);
        this.prependProperties(a.alpha, a.shadow, a.compositeOperation)
    };
    c.appendMatrix = function(a) {
        this.append(a.a, a.b, a.c, a.d, a.tx, a.ty);
        this.appendProperties(a.alpha, a.shadow,
            a.compositeOperation)
    };
    c.prependTransform = function(a, b, d, f, g, h, i, j, l) {
        if (g % 360) {
            var k = g * e.DEG_TO_RAD;
            g = Math.cos(k);
            k = Math.sin(k)
        } else {
            g = 1;
            k = 0
        }
        if (j || l) {
            this.tx -= j;
            this.ty -= l
        }
        if (h || i) {
            h *= e.DEG_TO_RAD;
            i *= e.DEG_TO_RAD;
            this.prepend(g * d, k * d, -k * f, g * f, 0, 0);
            this.prepend(Math.cos(i), Math.sin(i), -Math.sin(h), Math.cos(h), a, b)
        } else this.prepend(g * d, k * d, -k * f, g * f, a, b)
    };
    c.appendTransform = function(a, b, d, f, g, h, i, j, l) {
        if (g % 360) {
            var k = g * e.DEG_TO_RAD;
            g = Math.cos(k);
            k = Math.sin(k)
        } else {
            g = 1;
            k = 0
        }
        if (h || i) {
            h *= e.DEG_TO_RAD;
            i *=
                e.DEG_TO_RAD;
            this.append(Math.cos(i), Math.sin(i), -Math.sin(h), Math.cos(h), a, b);
            this.append(g * d, k * d, -k * f, g * f, 0, 0)
        } else this.append(g * d, k * d, -k * f, g * f, a, b);
        if (j || l) {
            this.tx -= j * this.a + l * this.c;
            this.ty -= j * this.b + l * this.d
        }
    };
    c.rotate = function(a) {
        var b = Math.cos(a);
        a = Math.sin(a);
        var d = this.a,
            f = this.c,
            g = this.tx;
        this.a = d * b - this.b * a;
        this.b = d * a + this.b * b;
        this.c = f * b - this.d * a;
        this.d = f * a + this.d * b;
        this.tx = g * b - this.ty * a;
        this.ty = g * a + this.ty * b
    };
    c.skew = function(a, b) {
        a *= e.DEG_TO_RAD;
        b *= e.DEG_TO_RAD;
        this.append(Math.cos(b),
            Math.sin(b), -Math.sin(a), Math.cos(a), 0, 0)
    };
    c.scale = function(a, b) {
        this.a *= a;
        this.d *= b;
        this.tx *= a;
        this.ty *= b
    };
    c.translate = function(a, b) {
        this.tx += a;
        this.ty += b
    };
    c.identity = function() {
        this.alpha = this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
        this.shadow = this.compositeOperation = null
    };
    c.invert = function() {
        var a = this.a,
            b = this.b,
            d = this.c,
            f = this.d,
            g = this.tx,
            h = a * f - b * d;
        this.a = f / h;
        this.b = -b / h;
        this.c = -d / h;
        this.d = a / h;
        this.tx = (d * this.ty - f * g) / h;
        this.ty = -(a * this.ty - b * g) / h
    };
    c.decompose = function(a) {
        if (a == null) a = {};
        a.x =
            this.tx;
        a.y = this.ty;
        a.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
        a.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);
        var b = Math.atan2(-this.c, this.d),
            d = Math.atan2(this.b, this.a);
        if (b == d) {
            a.rotation = d / e.DEG_TO_RAD;
            if (this.a < 0 && this.d >= 0) a.rotation += a.rotation <= 0 ? 180 : -180;
            a.skewX = a.skewY = 0
        } else {
            a.skewX = b / e.DEG_TO_RAD;
            a.skewY = d / e.DEG_TO_RAD
        }
        return a
    };
    c.appendProperties = function(a, b, d) {
        this.alpha *= a;
        this.shadow = b || this.shadow;
        this.compositeOperation = d || this.compositeOperation
    };
    c.prependProperties = function(a,
        b, d) {
        this.alpha *= a;
        this.shadow = this.shadow || b;
        this.compositeOperation = this.compositeOperation || d
    };
    c.clone = function() {
        var a = new e(this.a, this.b, this.c, this.d, this.tx, this.ty);
        a.shadow = this.shadow;
        a.alpha = this.alpha;
        a.compositeOperation = this.compositeOperation;
        return a
    };
    c.toString = function() {
        return "[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]"
    };
    e.identity = new e(1, 0, 0, 1, 0, 0);
    m.Matrix2D = e
})(window);
(function(m) {
    function e(a, b) {
        this.initialize(a, b)
    }
    var c = e.prototype;
    c.x = 0;
    c.y = 0;
    c.initialize = function(a, b) {
        this.x = a == null ? 0 : a;
        this.y = b == null ? 0 : b
    };
    c.clone = function() {
        return new e(this.x, this.y)
    };
    c.toString = function() {
        return "[Point (x=" + this.x + " y=" + this.y + ")]"
    };
    m.Point = e
})(window);
(function(m) {
    function e(a, b, d, f) {
        this.initialize(a, b, d, f)
    }
    var c = e.prototype;
    c.x = 0;
    c.y = 0;
    c.width = 0;
    c.height = 0;
    c.initialize = function(a, b, d, f) {
        this.x = a == null ? 0 : a;
        this.y = b == null ? 0 : b;
        this.width = d == null ? 0 : d;
        this.height = f == null ? 0 : f
    };
    c.clone = function() {
        return new e(this.x, this.y, this.width, this.height)
    };
    c.toString = function() {
        return "[Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")]"
    };
    m.Rectangle = e
})(window);
(function(m) {
    function e(a, b, d, f) {
        this.initialize(a, b, d, f)
    }
    var c = e.prototype;
    e.identity = null;
    c.color = null;
    c.offsetX = 0;
    c.offsetY = 0;
    c.blur = 0;
    c.initialize = function(a, b, d, f) {
        this.color = a;
        this.offsetX = b;
        this.offsetY = d;
        this.blur = f
    };
    c.toString = function() {
        return "[Shadow]"
    };
    c.clone = function() {
        return new e(this.color, this.offsetX, this.offsetY, this.blur)
    };
    e.identity = new e(null, 0, 0, 0);
    m.Shadow = e
})(window);
(function(m) {
    function e(a, b, d, f) {
        this.initialize(a, b, d, f)
    }
    var c = e.prototype;
    c.image = null;
    c.frameWidth = 0;
    c.frameHeight = 0;
    c.frameData = null;
    c.loop = true;
    c.totalFrames = 0;
    c.initialize = function(a, b, d, f) {
        this.image = a;
        this.frameWidth = b;
        this.frameHeight = d;
        this.frameData = f
    };
    c.toString = function() {
        return "[SpriteSheet]"
    };
    c.clone = function() {
        var a = new e(this.image, this.frameWidth, this.frameHeight, this.frameData);
        a.loop = this.loop;
        a.totalFrames = this.totalFrames;
        return a
    };
    m.SpriteSheet = e
})(window);
(function(m) {
    function e(b, d) {
        this.f = b;
        this.params = d
    }

    function c(b) {
        this.initialize(b)
    }
    e.prototype.exec = function(b) {
        this.f.apply(b, this.params)
    };
    var a = c.prototype;
    c.getRGB = function(b, d, f, g) {
        return g == null ? "rgb(" + b + "," + d + "," + f + ")" : "rgba(" + b + "," + d + "," + f + "," + g + ")"
    };
    c.getHSL = function(b, d, f, g) {
        return g == null ? "hsl(" + b % 360 + "," + d + "%," + f + "%)" : "hsla(" + b % 360 + "," + d + "%," + f + "%," + g + ")"
    };
    c.STROKE_CAPS_MAP = ["butt", "round", "square"];
    c.STROKE_JOINTS_MAP = ["miter", "round", "bevel"];
    c._canvas = document.createElement("canvas");
    c._ctx = c._canvas.getContext("2d");
    c.beginCmd = new e(c._ctx.beginPath, []);
    c.fillCmd = new e(c._ctx.fill, []);
    c.strokeCmd = new e(c._ctx.stroke, []);
    a._strokeInstructions = null;
    a._strokeStyleInstructions = null;
    a._fillInstructions = null;
    a._instructions = null;
    a._oldInstructions = null;
    a._activeInstructions = null;
    a._active = false;
    a._dirty = false;
    a.initialize = function(b) {
        this.clear();
        this._ctx = c._ctx;
        with(this) eval(b)
    };
    a.draw = function(b) {
        this._dirty && this._updateInstructions();
        for (var d = this._instructions, f = 0, g = d.length; f <
            g; f++) d[f].exec(b)
    };
    a.moveTo = function(b, d) {
        this._activeInstructions.push(new e(this._ctx.moveTo, [b, d]));
        return this
    };
    a.lineTo = function(b, d) {
        this._dirty = this._active = true;
        this._activeInstructions.push(new e(this._ctx.lineTo, [b, d]));
        return this
    };
    a.arcTo = function(b, d, f, g, h) {
        this._dirty = this._active = true;
        this._activeInstructions.push(new e(this._ctx.arcTo, [b, d, f, g, h]));
        return this
    };
    a.arc = function(b, d, f, g, h, i) {
        this._dirty = this._active = true;
        if (i == null) i = false;
        this._activeInstructions.push(new e(this._ctx.arc, [b, d, f, g, h, i]));
        return this
    };
    a.quadraticCurveTo = function(b, d, f, g) {
        this._dirty = this._active = true;
        this._activeInstructions.push(new e(this._ctx.quadraticCurveTo, [b, d, f, g]));
        return this
    };
    a.bezierCurveTo = function(b, d, f, g, h, i) {
        this._dirty = this._active = true;
        this._activeInstructions.push(new e(this._ctx.bezierCurveTo, [b, d, f, g, h, i]));
        return this
    };
    a.rect = function(b, d, f, g) {
        this._dirty = this._active = true;
        this._activeInstructions.push(new e(this._ctx.rect, [b, d, f - 1, g]));
        return this
    };
    a.closePath = function() {
        if (this._active) {
            this._dirty =
                true;
            this._activeInstructions.push(new e(this._ctx.closePath, []))
        }
        return this
    };
    a.clear = function() {
        this._instructions = [];
        this._oldInstructions = [];
        this._activeInstructions = [];
        this._strokeInstructions = this._fillInstructions = this._strokeStyleInstructions = null;
        this._active = this._dirty = false;
        return this
    };
    a.beginFill = function(b) {
        this._active && this._newPath();
        this._fillInstructions = b ? [new e(this._setProp, ["fillStyle", b])] : null;
        return this
    };
    a.beginLinearGradientFill = function(b, d, f, g, h, i) {
        this._active && this._newPath();
        f = this._ctx.createLinearGradient(f, g, h, i);
        g = 0;
        for (h = b.length; g < h; g++) f.addColorStop(d[g], b[g]);
        this._fillInstructions = [new e(this._setProp, ["fillStyle", f])];
        return this
    };
    a.beginRadialGradientFill = function(b, d, f, g, h, i, j, l) {
        this._active && this._newPath();
        f = this._ctx.createRadialGradient(f, g, h, i, j, l);
        g = 0;
        for (h = b.length; g < h; g++) f.addColorStop(d[g], b[g]);
        this._fillInstructions = [new e(this._setProp, ["fillStyle", f])];
        return this
    };
    a.beginBitmapFill = function(b, d) {
        this._active && this._newPath();
        var f = this._ctx.createPattern(b,
            d || "");
        this._fillInstructions = [new e(this._setProp, ["fillStyle", f])];
        return this
    };
    a.endFill = function() {
        this.beginFill(null);
        return this
    };
    a.setStrokeStyle = function(b, d, f, g) {
        this._active && this._newPath();
        this._strokeStyleInstructions = [new e(this._setProp, ["lineWidth", b == null ? "1" : b]), new e(this._setProp, ["lineCap", d == null ? "butt" : isNaN(d) ? d : c.STROKE_CAPS_MAP[d]]), new e(this._setProp, ["lineJoin", f == null ? "miter" : isNaN(f) ? f : c.STROKE_JOINTS_MAP[f]]), new e(this._setProp, ["miterLimit", g == null ? "10" : g])];
        return this
    };
    a.beginStroke = function(b) {
        this._active && this._newPath();
        this._strokeInstructions = b ? [new e(this._setProp, ["strokeStyle", b])] : null;
        return this
    };
    a.beginLinearGradientStroke = function(b, d, f, g, h, i) {
        this._active && this._newPath();
        f = this._ctx.createLinearGradient(f, g, h, i);
        g = 0;
        for (h = b.length; g < h; g++) f.addColorStop(d[g], b[g]);
        this._strokeInstructions = [new e(this._setProp, ["strokeStyle", f])];
        return this
    };
    a.beginRadialGradientStroke = function(b, d, f, g, h, i, j, l) {
        this._active && this._newPath();
        f = this._ctx.createRadialGradient(f,
            g, h, i, j, l);
        g = 0;
        for (h = b.length; g < h; g++) f.addColorStop(d[g], b[g]);
        this._strokeInstructions = [new e(this._setProp, ["strokeStyle", f])];
        return this
    };
    a.beginBitmapStroke = function(b, d) {
        this._active && this._newPath();
        var f = this._ctx.createPattern(b, d || "");
        this._strokeInstructions = [new e(this._setProp, ["strokeStyle", f])];
        return this
    };
    a.endStroke = function() {
        this.beginStroke(null);
        return this
    };
    a.curveTo = a.quadraticCurveTo;
    a.drawRect = a.rect;
    a.drawRoundRect = function(b, d, f, g, h) {
        this.drawRoundRectComplex(b, d, f, g,
            h, h, h, h);
        return this
    };
    a.drawRoundRectComplex = function(b, d, f, g, h, i, j, l) {
        this._dirty = this._active = true;
        this._activeInstructions.push(new e(this._ctx.moveTo, [b + h, d]), new e(this._ctx.lineTo, [b + f - i, d]), new e(this._ctx.arc, [b + f - i, d + i, i, -Math.PI / 2, 0, false]), new e(this._ctx.lineTo, [b + f, d + g - j]), new e(this._ctx.arc, [b + f - j, d + g - j, j, 0, Math.PI / 2, false]), new e(this._ctx.lineTo, [b + l, d + g]), new e(this._ctx.arc, [b + l, d + g - l, l, Math.PI / 2, Math.PI, false]), new e(this._ctx.lineTo, [b, d + h]), new e(this._ctx.arc, [b + h, d + h, h, Math.PI,
            Math.PI * 3 / 2, false
        ]));
        return this
    };
    a.drawCircle = function(b, d, f) {
        this.arc(b, d, f, 0, Math.PI * 2);
        return this
    };
    a.drawEllipse = function(b, d, f, g) {
        this._dirty = this._active = true;
        var h = f / 2 * 0.5522848,
            i = g / 2 * 0.5522848,
            j = b + f,
            l = d + g;
        f = b + f / 2;
        g = d + g / 2;
        this._activeInstructions.push(new e(this._ctx.moveTo, [b, g]), new e(this._ctx.bezierCurveTo, [b, g - i, f - h, d, f, d]), new e(this._ctx.bezierCurveTo, [f + h, d, j, g - i, j, g]), new e(this._ctx.bezierCurveTo, [j, g + i, f + h, l, f, l]), new e(this._ctx.bezierCurveTo, [f - h, l, b, g + i, b, g]));
        return this
    };
    a.drawPolyStar =
        function(b, d, f, g, h, i) {
            this._dirty = this._active = true;
            if (h == null) h = 0;
            h = 1 - h;
            if (i == null) i = 0;
            else i /= 180 / Math.PI;
            var j = Math.PI / g;
            this._activeInstructions.push(new e(this._ctx.moveTo, [b + Math.cos(i) * f, d + Math.sin(i) * f]));
            for (var l = 0; l < g; l++) {
                i += j;
                h != 1 && this._activeInstructions.push(new e(this._ctx.lineTo, [b + Math.cos(i) * f * h, d + Math.sin(i) * f * h]));
                i += j;
                this._activeInstructions.push(new e(this._ctx.lineTo, [b + Math.cos(i) * f, d + Math.sin(i) * f]))
            }
            return this
        };
    a.clone = function() {
        var b = new c;
        b._instructions = this._instructions.slice();
        b._activeIntructions = this._activeInstructions.slice();
        b._oldInstructions = this._oldInstructions.slice();
        b._fillInstructions = this._fillInstructions.slice();
        b._strokeInstructions = this._strokeInstructions.slice();
        b._strokeStyleInstructions = this._strokeStyleInstructions.slice();
        b._active = this._active;
        b._dirty = this._dirty;
        b._assets = this._assets;
        return b
    };
    a.toString = function() {
        return "[Graphics]"
    };
    a.mt = a.moveTo;
    a.lt = a.lineTo;
    a.at = a.arcTo;
    a.bt = a.bezierCurveTo;
    a.qt = a.quadraticCurveTo;
    a.a = a.arc;
    a.r = a.rect;
    a.cp =
        a.closePath;
    a.c = a.clear;
    a.f = a.beginFill;
    a.lf = a.beginLinearGradientFill;
    a.rf = a.beginRadialGradientFill;
    a.bf = a.beginBitmapFill;
    a.ef = a.endFill;
    a.ss = a.setStrokeStyle;
    a.s = a.beginStroke;
    a.ls = a.beginLinearGradientStroke;
    a.rs = a.beginRadialGradientStroke;
    a.bs = a.beginBitmapStroke;
    a.es = a.endStroke;
    a.dr = a.drawRect;
    a.rr = a.drawRoundRect;
    a.rc = a.drawRoundRectComplex;
    a.dc = a.drawCircle;
    a.de = a.drawEllipse;
    a.dp = a.drawPolyStar;
    a._updateInstructions = function() {
        this._instructions = this._oldInstructions.slice();
        this._instructions.push(c.beginCmd);
        this._fillInstructions && this._instructions.push.apply(this._instructions, this._fillInstructions);
        if (this._strokeInstructions) {
            this._instructions.push.apply(this._instructions, this._strokeInstructions);
            this._strokeStyleInstructions && this._instructions.push.apply(this._instructions, this._strokeStyleInstructions)
        }
        this._instructions.push.apply(this._instructions, this._activeInstructions);
        this._fillInstructions && this._instructions.push(c.fillCmd);
        this._strokeInstructions && this._instructions.push(c.strokeCmd)
    };
    a._newPath = function() {
        this._dirty && this._updateInstructions();
        this._oldInstructions = this._instructions;
        this._activeInstructions = [];
        this._active = this._dirty = false
    };
    a._setProp = function(b, d) {
        this[b] = d
    };
    m.Graphics = c
})(window);
(function(m) {
    function e() {
        this.initialize()
    }
    var c = e.prototype;
    e.suppressCrossDomainErrors = false;
    e._hitTestCanvas = document.createElement("canvas");
    e._hitTestCanvas.width = e._hitTestCanvas.height = 1;
    e._hitTestContext = e._hitTestCanvas.getContext("2d");
    e._workingMatrix = new Matrix2D;
    c.alpha = 1;
    c.cacheCanvas = null;
    c.id = -1;
    c.mouseEnabled = true;
    c.name = null;
    c.parent = null;
    c.regX = 0;
    c.regY = 0;
    c.rotation = 0;
    c.scaleX = 1;
    c.scaleY = 1;
    c.skewX = 0;
    c.skewY = 0;
    c.shadow = null;
    c.visible = true;
    c.x = 0;
    c.y = 0;
    c.compositeOperation = null;
    c.snapToPixel =
        false;
    c.onPress = null;
    c.onClick = null;
    c._cacheOffsetX = 0;
    c._cacheOffsetY = 0;
    c._cacheDraw = false;
    c._activeContext = null;
    c._restoreContext = false;
    c._revertShadow = false;
    c._revertX = 0;
    c._revertY = 0;
    c._revertAlpha = 1;
    c.initialize = function() {
        this.id = UID.get();
        this.children = []
    };
    c.isVisible = function() {
        return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0
    };
    c.draw = function(a, b) {
        if (b || !this.cacheCanvas) return false;
        a.translate(this._cacheOffsetX, this._cacheOffsetY);
        a.drawImage(this.cacheCanvas, 0, 0);
        a.translate(-this._cacheOffsetX, -this._cacheOffsetY);
        return true
    };
    c.cache = function(a, b, d, f) {
        var g;
        if (this.cacheCanvas == null) this.cacheCanvas = document.createElement("canvas");
        g = this.cacheCanvas.getContext("2d");
        this.cacheCanvas.width = d;
        this.cacheCanvas.height = f;
        g.setTransform(1, 0, 0, 1, -a, -b);
        g.clearRect(0, 0, d + 1, f + 1);
        this.draw(g, true);
        this._cacheOffsetX = a;
        this._cacheOffsetY = b
    };
    c.updateCache = function(a) {
        if (this.cacheCanvas == null) throw "cache() must be called before updateCache()";
        var b = this.cacheCanvas.getContext("2d");
        b.setTransform(1,
            0, 0, 1, -this._cacheOffsetX, -this._cacheOffsetY);
        if (a) b.globalCompositeOperation = a;
        else b.clearRect(0, 0, this.cacheCanvas.width + 1, this.cacheCanvas.height + 1);
        this.draw(b, true);
        if (a) b.globalCompositeOperation = "source-over"
    };
    c.uncache = function() {
        this.cacheCanvas = null;
        this.cacheOffsetX = this.cacheOffsetY = 0
    };
    c.getStage = function() {
        for (var a = this; a.parent;) a = a.parent;
        if (a instanceof Stage) return a;
        return null
    };
    c.localToGlobal = function(a, b) {
        var d = this.getConcatenatedMatrix();
        if (d == null) return null;
        d.append(1,
            0, 0, 1, a, b);
        return new Point(d.tx, d.ty)
    };
    c.globalToLocal = function(a, b) {
        var d = this.getConcatenatedMatrix();
        if (d == null) return null;
        d.invert();
        d.append(1, 0, 0, 1, a, b);
        return new Point(d.tx, d.ty)
    };
    c.localToLocal = function(a, b, d) {
        a = this.localToGlobal(a, b);
        return d.globalToLocal(a.x, a.y)
    };
    c.getConcatenatedMatrix = function(a) {
        if (a) a.identity();
        else a = new Matrix2D;
        for (var b = this;;) {
            a.prependTransform(b.x, b.y, b.scaleX, b.scaleY, b.rotation, b.skewX, b.skewY, b.regX, b.regY);
            a.prependProperties(b.alpha, b.shadow, b.compositeOperation);
            if ((c = b.parent) == null) break;
            b = c
        }
        return a
    };
    c.hitTest = function(a, b) {
        var d = e._hitTestContext,
            f = e._hitTestCanvas;
        d.setTransform(1, 0, 0, 1, -a, -b);
        this.draw(d);
        d = this._testHit(d);
        f.width = 0;
        f.width = 1;
        return d
    };
    c.clone = function() {
        var a = new e;
        this.cloneProps(a);
        return a
    };
    c.toString = function() {
        return "[DisplayObject (name=" + this.name + ")]"
    };
    c.cloneProps = function(a) {
        a.alpha = this.alpha;
        a.name = this.name;
        a.regX = this.regX;
        a.regY = this.regY;
        a.rotation = this.rotation;
        a.scaleX = this.scaleX;
        a.scaleY = this.scaleY;
        a.shadow = this.shadow;
        a.skewX = this.skewX;
        a.skewY = this.skewY;
        a.visible = this.visible;
        a.x = this.x;
        a.y = this.y;
        a.mouseEnabled = this.mouseEnabled;
        a.compositeOperation = this.compositeOperation
    };
    c.applyShadow = function(a, b) {
        a.shadowColor = b.color;
        a.shadowOffsetX = b.offsetX;
        a.shadowOffsetY = b.offsetY;
        a.shadowBlur = b.blur
    };
    c._testHit = function(a) {
        try {
            var b = a.getImageData(0, 0, 1, 1).data[3] > 1
        } catch (d) {
            if (!e.suppressCrossDomainErrors) throw "An error has occured. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images.";
        }
        return b
    };
    m.DisplayObject = e
})(window);
(function(m) {
    function e() {
        this.initialize()
    }
    var c = e.prototype = new DisplayObject;
    c.children = null;
    c.DisplayObject_initialize = c.initialize;
    c.initialize = function() {
        this.DisplayObject_initialize();
        this.children = []
    };
    c.isVisible = function() {
        return this.visible && this.alpha > 0 && this.children.length && this.scaleX != 0 && this.scaleY != 0
    };
    c.DisplayObject_draw = c.draw;
    c.draw = function(a, b, d) {
        if (!d) {
            d = new Matrix2D;
            d.appendProperties(this.alpha, this.shadow, this.compositeOperation)
        }
        if (this.DisplayObject_draw(a, b)) return true;
        b = this.children.length;
        for (var f = this.children.slice(0), g = 0; g < b; g++) {
            var h = f[g];
            h.tick && h.tick();
            if (h.isVisible()) {
                var i = d.clone();
                i.appendTransform(h.x, h.y, h.scaleX, h.scaleY, h.rotation, h.skewX, h.skewY, h.regX, h.regY);
                i.appendProperties(h.alpha, h.shadow, h.compositeOperation);
                if (!(h instanceof e)) {
                    a.setTransform(i.a, i.b, i.c, i.d, i.tx, i.ty);
                    a.globalAlpha = i.alpha;
                    a.globalCompositeOperation = i.compositeOperation || "source-over";
                    i.shadow && this.applyShadow(a, i.shadow)
                }
                h.draw(a, false, i)
            }
        }
        return true
    };
    c.addChild =
        function(a) {
            var b = arguments.length;
            if (b > 1) {
                for (var d = 0; d < b; d++) this.addChild(arguments[d]);
                return arguments[b - 1]
            }
            a.parent && a.parent.removeChild(a);
            a.parent = this;
            this.children.push(a);
            return a
        };
    c.addChildAt = function(a, b) {
        var d = arguments.length;
        if (d > 2) {
            b = arguments[f - 1];
            for (var f = 0; f < d - 1; f++) this.addChildAt(arguments[f], b + f);
            return arguments[d - 2]
        }
        a.parent && a.parent.removeChild(a);
        a.parent = this;
        this.children.splice(b, 0, a);
        return a
    };
    c.removeChild = function(a) {
        var b = arguments.length;
        if (b > 1) {
            for (var d = true,
                    f = 0; f < b; f++) d = d && this.removeChild(arguments[f]);
            return d
        }
        return this.removeChildAt(this.children.indexOf(a))
    };
    c.removeChildAt = function(a) {
        var b = arguments.length;
        if (b > 1) {
            for (var d = [], f = 0; f < b; f++) d[f] = arguments[f];
            d.sort(function(h, i) {
                return i - h
            });
            var g = true;
            for (f = 0; f < b; f++) g = g && this.removeChildAt(d[f]);
            return g
        }
        if (a < 0 || a > this.children.length - 1) return false;
        b = this.children[a];
        if (b != null) b.parent = null;
        this.children.splice(a, 1);
        return true
    };
    c.removeAllChildren = function() {
        for (; this.children.length;) this.removeChildAt(0)
    };
    c.getChildAt = function(a) {
        return this.children[a]
    };
    c.sortChildren = function(a) {
        this.children.sort(a)
    };
    c.getChildIndex = function(a) {
        return this.children.indexOf(a)
    };
    c.getNumChildren = function() {
        return this.children.length
    };
    c.contains = function(a) {
        for (; a;) {
            if (a == this) return true;
            a = a.parent
        }
        return false
    };
    c.getObjectsUnderPoint = function(a, b) {
        var d = [],
            f = this.localToGlobal(a, b);
        this._getObjectsUnderPoint(f.x, f.y, d);
        return d
    };
    c.getObjectUnderPoint = function(a, b) {
        var d = this.localToGlobal(a, b);
        return this._getObjectsUnderPoint(d.x,
            d.y)
    };
    c.clone = function() {
        var a = new e;
        this.cloneProps(a);
        return a
    };
    c.toString = function() {
        return "[Container (name=" + this.name + ")]"
    };
    c._getObjectsUnderPoint = function(a, b, d, f) {
        var g = DisplayObject._hitTestContext,
            h = DisplayObject._hitTestCanvas,
            i = DisplayObject._workingMatrix,
            j = f && (this.onPress || this.onClick),
            l = Stage._snapToPixelEnabled;
        if (this.cacheCanvas) {
            this.getConcatenatedMatrix(i);
            g.setTransform(i.a, i.b, i.c, i.d, i.tx - a, i.ty - b);
            g.globalAlpha = i.alpha;
            this.draw(g);
            if (this._testHit(g)) {
                h.width = 0;
                h.width =
                    1;
                if (j) return this
            } else return null
        }
        for (var k = this.children.length - 1; k >= 0; k--) {
            var n = this.children[k];
            if (n.isVisible() && n.mouseEnabled)
                if (n instanceof e)
                    if (j) {
                        if (n = n._getObjectsUnderPoint(a, b)) return n
                    } else {
                        n = n._getObjectsUnderPoint(a, b, d, f);
                        if (!d && n) return n
                    }
            else if (!f || f && (n.onPress || n.onClick)) {
                n.getConcatenatedMatrix(i);
                l && n.snapToPixel && i.a == 1 && i.b == 0 && i.c == 0 && i.d == 1 ? g.setTransform(i.a, i.b, i.c, i.d, i.tx - a + 0.5 | 0, i.ty - b + 0.5 | 0) : g.setTransform(i.a, i.b, i.c, i.d, i.tx - a, i.ty - b);
                g.globalAlpha = i.alpha;
                n.draw(g);
                if (this._testHit(g)) {
                    h.width = 0;
                    h.width = 1;
                    if (d) d.push(n);
                    else return n
                }
            }
        }
        return null
    };
    m.Container = e
})(window);
(function(m) {
    function e(a) {
        this.initialize(a)
    }
    var c = e.prototype = new Container;
    e._snapToPixelEnabled = false;
    c.autoClear = true;
    c.canvas = null;
    c.mouseX = null;
    c.mouseY = null;
    c.onMouseMove = null;
    c.onMouseUp = null;
    c.onMouseDown = null;
    c.snapToPixelEnabled = false;
    c._tmpCanvas = null;
    c._activeMouseEvent = null;
    c._activeMouseTarget = null;
    c.Container_initialize = c.initialize;
    c.initialize = function(a) {
        this.Container_initialize();
        this.canvas = a;
        this.mouseChildren = true;
        var b = this;
        if (m.addEventListener) m.addEventListener("mouseup",
            function(d) {
                b._handleMouseUp(d)
            }, false);
        else document.addEventListener && document.addEventListener("mouseup", function(d) {
            b._handleMouseUp(d)
        }, false);
        a.addEventListener("mousemove", function(d) {
            b._handleMouseMove(d)
        }, false);
        a.addEventListener("mousedown", function(d) {
            b._handleMouseDown(d)
        }, false)
    };
    c.update = function() {
        if (this.canvas) {
            this.autoClear && this.clear();
            e._snapToPixelEnabled = this.snapToPixelEnabled;
            this.draw(this.canvas.getContext("2d"), false, this.getConcatenatedMatrix(DisplayObject._workingMatrix))
        }
    };
    c.tick = c.update;
    c.clear = function() {
        if (this.canvas) {
            var a = this.canvas.getContext("2d");
            a.setTransform(1, 0, 0, 1, 0, 0);
            a.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }
    };
    c.toDataURL = function(a, b) {
        b || (b = "image/png");
        var d = this.canvas.getContext("2d"),
            f = this.canvas.width,
            g = this.canvas.height,
            h;
        if (a) {
            h = d.getImageData(0, 0, f, g);
            var i = d.globalCompositeOperation;
            d.globalCompositeOperation = "destination-over";
            d.fillStyle = a;
            d.fillRect(0, 0, f, g)
        }
        var j = this.canvas.toDataURL(b);
        if (a) {
            d.clearRect(0, 0, f, g);
            d.putImageData(h,
                0, 0);
            d.globalCompositeOperation = i
        }
        return j
    };
    c.clone = function() {
        var a = new e(null);
        this.cloneProps(a);
        return a
    };
    c.toString = function() {
        return "[Stage (name=" + this.name + ")]"
    };
    c._handleMouseMove = function(a) {
        if (this.canvas) {
            if (!a) a = m.event;
            this.mouseX = a.pageX - this.canvas.offsetLeft;
            this.mouseY = a.pageY - this.canvas.offsetTop;
            a = new MouseEvent("onMouseMove", this.mouseX, this.mouseY);
            if (this.onMouseMove) this.onMouseMove(a);
            if (this._activeMouseEvent && this._activeMouseEvent.onMouseMove) this._activeMouseEvent.onMouseMove(a)
        } else this.mouseX =
            this.mouseY = null
    };
    c._handleMouseUp = function() {
        var a = new MouseEvent("onMouseUp", this.mouseX, this.mouseY);
        if (this.onMouseUp) this.onMouseUp(a);
        if (this._activeMouseEvent && this._activeMouseEvent.onMouseUp instanceof Function) this._activeMouseEvent.onMouseUp(a);
        if (this._activeMouseTarget && this._activeMouseTarget.onClick && this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, true) == this._activeMouseTarget) this._activeMouseTarget.onClick(new MouseEvent("onClick", this.mouseX, this.mouseY));
        this._activeMouseEvent =
            this.activeMouseTarget = null
    };
    c._handleMouseDown = function() {
        if (this.onMouseDown) this.onMouseDown(new MouseEvent("onMouseDown", this.mouseX, this.mouseY));
        var a = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, true);
        if (a) {
            if (a.onPress instanceof Function) {
                var b = new MouseEvent("onPress", this.mouseX, this.mouseY);
                a.onPress(b);
                if (b.onMouseMove || b.onMouseUp) this._activeMouseEvent = b
            }
            this._activeMouseTarget = a
        }
    };
    m.Stage = e
})(window);
(function(m) {
    function e(a) {
        this.initialize(a)
    }
    var c = e.prototype = new DisplayObject;
    c.image = null;
    c.snapToPixel = true;
    c.DisplayObject_initialize = c.initialize;
    c.initialize = function(a) {
        this.DisplayObject_initialize();
        this.image = a
    };
    c.isVisible = function() {
        return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.image && (this.image.complete || this.image.getContext)
    };
    c.DisplayObject_draw = c.draw;
    c.draw = function(a, b) {
        if (this.DisplayObject_draw(a, b)) return true;
        a.drawImage(this.image, 0, 0);
        return true
    };
    c.cache = function() {};
    c.uncache = function() {};
    c.clone = function() {
        var a = new e(this.image);
        this.cloneProps(a);
        return a
    };
    c.toString = function() {
        return "[Bitmap (name=" + this.name + ")]"
    };
    m.Bitmap = e
})(window);
(function(m) {
    function e(a) {
        this.initialize(a)
    }
    var c = e.prototype = new DisplayObject;
    c.callback = null;
    c.currentFrame = -1;
    c.currentSequence = null;
    c.currentEndFrame = null;
    c.currentStartFrame = null;
    c.nextSequence = null;
    c.paused = false;
    c.spriteSheet = null;
    c.snapToPixel = true;
    c.DisplayObject_initialize = c.initialize;
    c.initialize = function(a) {
        this.DisplayObject_initialize();
        this.spriteSheet = a
    };
    c.isVisible = function() {
        var a = this.spriteSheet ? this.spriteSheet.image : null;
        return this.visible && this.alpha > 0 && this.scaleX != 0 &&
            this.scaleY != 0 && a && this.currentFrame >= 0 && (a.complete || a.getContext)
    };
    c.DisplayObject_draw = c.draw;
    c.draw = function(a, b) {
        if (this.DisplayObject_draw(a, b)) return true;
        var d = this.spriteSheet.image,
            f = this.spriteSheet.frameWidth,
            g = this.spriteSheet.frameHeight,
            h = d.width / f | 0,
            i = d.height / g | 0;
        if (this.currentEndFrame != null) {
            if (this.currentFrame > this.currentEndFrame) {
                if (this.nextSequence) this._goto(this.nextSequence);
                else {
                    this.paused = true;
                    this.currentFrame = this.currentEndFrame
                }
                this.callback && this.callback(this)
            }
        } else if (this.spriteSheet.frameData) this.paused =
            true;
        else {
            i = this.spriteSheet.totalFrames || h * i;
            if (this.currentFrame >= i) {
                if (this.spriteSheet.loop) this.currentFrame = 0;
                else {
                    this.currentFrame = i;
                    this.paused = true
                }
                this.callback && this.callback(this)
            }
        }
        this.currentFrame >= 0 && a.drawImage(d, f * (this.currentFrame % h), g * (this.currentFrame / h | 0), f, g, 0, 0, f, g);
        return true
    };
    c.tick = function() {
        this.paused || this.currentFrame++
    };
    c.cache = function() {};
    c.uncache = function() {};
    c.gotoAndPlay = function(a) {
        this.paused = false;
        this._goto(a)
    };
    c.gotoAndStop = function(a) {
        this.paused = true;
        this._goto(a)
    };
    c.clone = function() {
        var a = new e(this.spriteSheet);
        this.cloneProps(a);
        return a
    };
    c.toString = function() {
        return "[BitmapSequence (name=" + this.name + ")]"
    };
    c.DisplayObject_cloneProps = c.cloneProps;
    c.cloneProps = function(a) {
        this.DisplayObject_cloneProps(a);
        a.callback = this.callback;
        a.currentFrame = this.currentFrame;
        a.currentStartFrame = this.currentStartFrame;
        a.currentEndFrame = this.currentEndFrame;
        a.currentSequence = this.currentSequence;
        a.nextSequence = this.nextSequence;
        a.paused = this.paused;
        a.frameData =
            this.frameData
    };
    c._goto = function(a) {
        if (isNaN(a))
            if (a == this.currentSequence) this.currentFrame = this.currentStartFrame;
            else {
                var b = this.spriteSheet.frameData[a];
                if (b instanceof Array) {
                    this.currentFrame = this.currentStartFrame = b[0];
                    this.currentSequence = a;
                    this.currentEndFrame = b[1];
                    if (this.currentEndFrame == null) this.currentEndFrame = this.currentStartFrame;
                    if (this.currentEndFrame == null) this.currentEndFrame = this.currentFrame;
                    this.nextSequence = b[2];
                    if (this.nextSequence == null) this.nextSequence = this.currentSequence;
                    else if (this.nextSequence == false) this.nextSequence = null
                } else {
                    this.currentSequence = this.nextSequence = null;
                    this.currentEndFrame = this.currentFrame = this.currentStartFrame = b
                }
            }
        else {
            this.currentSequence = this.nextSequence = this.currentEndFrame = null;
            this.currentStartFrame = 0;
            this.currentFrame = a
        }
    };
    m.BitmapSequence = e
})(window);
(function(m) {
    function e(a) {
        this.initialize(a)
    }
    var c = e.prototype = new DisplayObject;
    c.graphics = null;
    c.DisplayObject_initialize = c.initialize;
    c.initialize = function(a) {
        this.DisplayObject_initialize();
        this.graphics = a ? a : new Graphics
    };
    c.isVisible = function() {
        return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.graphics
    };
    c.DisplayObject_draw = c.draw;
    c.draw = function(a, b) {
        if (this.DisplayObject_draw(a, b)) return true;
        this.graphics.draw(a);
        return true
    };
    c.clone = function() {
        var a = new e(this.graphics);
        this.cloneProps(a);
        return a
    };
    c.toString = function() {
        return "[Shape (name=" + this.name + ")]"
    };
    m.Shape = e
})(window);
(function(m) {
    function e(b, d, f) {
        this.initialize(b, d, f)
    }
    var c = e.prototype = new DisplayObject,
        a = document.createElement("canvas");
    e._workingContext = a.getContext("2d");
    c.text = "";
    c.font = null;
    c.color = null;
    c.textAlign = null;
    c.textBaseline = null;
    c.maxWidth = null;
    c.outline = false;
    c.lineHeight = null;
    c.lineWidth = null;
    c.DisplayObject_initialize = c.initialize;
    c.initialize = function(b, d, f) {
        this.DisplayObject_initialize();
        this.text = b;
        this.font = d;
        this.color = f ? f : "#000"
    };
    c.isVisible = function() {
        return Boolean(this.visible &&
            this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.text != null && this.text != "")
    };
    c.DisplayObject_draw = c.draw;
    c.draw = function(b, d) {
        if (this.DisplayObject_draw(b, d)) return true;
        if (this.outline) b.strokeStyle = this.color;
        else b.fillStyle = this.color;
        b.font = this.font;
        b.textAlign = this.textAlign ? this.textAlign : "start";
        b.textBaseline = this.textBaseline ? this.textBaseline : "alphabetic";
        for (var f = String(this.text).split(/(?:\r\n|\r|\n)/), g = this.lineHeight == null ? this.getMeasuredLineHeight() : this.lineHeight, h = 0, i = 0,
                j = f.length; i < j; i++) {
            var l = b.measureText(f[i]).width;
            if (this.lineWidth == null || l < this.lineWidth) this._drawTextLine(b, f[i], h);
            else {
                l = f[i].split(/(\s)/);
                for (var k = l[0], n = 1, p = l.length; n < p; n += 2)
                    if (b.measureText(k + l[n] + l[n + 1]).width > this.lineWidth) {
                        this._drawTextLine(b, k, h);
                        h += g;
                        k = l[n + 1]
                    } else k += l[n] + l[n + 1];
                this._drawTextLine(b, k, h)
            }
            h += g
        }
        return true
    };
    c.getMeasuredWidth = function() {
        return this._getWorkingContext().measureText(this.text).width
    };
    c.getMeasuredLineHeight = function() {
        return this._getWorkingContext().measureText("M").width *
            1.2
    };
    c.clone = function() {
        var b = new e(this.text, this.font, this.color);
        this.cloneProps(b);
        return b
    };
    c.toString = function() {
        return "[Text (text=" + (this.text.length > 20 ? this.text.substr(0, 17) + "..." : this.text) + ")]"
    };
    c.DisplayObject_cloneProps = c.cloneProps;
    c.cloneProps = function(b) {
        this.DisplayObject_cloneProps(b);
        b.textAlign = this.textAlign;
        b.textBaseline = this.textBaseline;
        b.maxWidth = this.maxWidth;
        b.outline = this.outline;
        b.lineHeight = this.lineHeight;
        b.lineWidth = this.lineWidth
    };
    c._getWorkingContext = function() {
        var b =
            e._workingContext;
        b.font = this.font;
        b.textAlign = this.textAlign ? this.textAlign : "start";
        b.textBaseline = this.textBaseline ? this.textBaseline : "alphabetic";
        return b
    };
    c._drawTextLine = function(b, d, f) {
        this.outline ? b.strokeText(d, 0, f, this.maxWidth) : b.fillText(d, 0, f, this.maxWidth)
    };
    m.Text = e
})(window);
(function(m) {
    function e() {
        throw "SpriteSheetUtils cannot be instantiated";
    }
    e._workingCanvas = document.createElement("canvas");
    e._workingContext = e._workingCanvas.getContext("2d");
    e.flip = function(c, a) {
        var b = c.image,
            d = c.frameData,
            f = c.frameWidth,
            g = c.frameHeight,
            h = b.width / f | 0,
            i = b.height / g | 0,
            j = h * i,
            l = {},
            k, n;
        for (n in d) {
            k = d[n];
            if (k instanceof Array) k = k.slice(0);
            l[n] = k
        }
        var p = [],
            q = 0,
            o = 0;
        for (n in a) {
            k = a[n];
            k = d[k[0]];
            if (k != null) {
                if (k instanceof Array) {
                    var s = k[0],
                        r = k[1];
                    if (r == null) r = s
                } else s = r = k;
                p[o] = n;
                p[o + 1] = s;
                p[o + 2] = r;
                q += r - s + 1;
                o += 4
            }
        }
        d = e._workingCanvas;
        d.width = b.width;
        d.height = Math.ceil(i + q / h) * g;
        q = e._workingContext;
        q.drawImage(b, 0, 0, h * f, i * g, 0, 0, h * f, i * g);
        i = j - 1;
        for (o = 0; o < p.length; o += 4) {
            n = p[o];
            s = p[o + 1];
            r = p[o + 2];
            k = a[n];
            j = k[1] ? -1 : 1;
            for (var u = k[2] ? -1 : 1, v = j == -1 ? f : 0, w = u == -1 ? g : 0, t = s; t <= r; t++) {
                i++;
                q.save();
                q.translate(i % h * f + v, (i / h | 0) * g + w);
                q.scale(j, u);
                q.drawImage(b, t % h * f, (t / h | 0) * g, f, g, 0, 0, f, g);
                q.restore()
            }
            l[n] = [i - (r - s), i, k[3]]
        }
        b = new Image;
        b.src = d.toDataURL("image/png");
        return new SpriteSheet(b.width > 0 ? b : d, f, g, l)
    };
    e.frameDataToString = function(c) {
        var a = "",
            b = 0,
            d = 0,
            f = 0,
            g, h;
        for (h in c) {
            f++;
            g = c[h];
            if (g instanceof Array) {
                var i = g[0],
                    j = g[1];
                if (j == null) j = i;
                g = g[2];
                if (g == null) g = h
            } else {
                i = j = g;
                g = h
            }
            a += "\n\t" + h + ", start=" + i + ", end=" + j + ", next=" + g;
            if (g == false) a += " (stop)";
            else if (g == h) a += " (loop)";
            if (j > b) b = j;
            if (i < d) d = i
        }
        return f + " sequences, min=" + d + ", max=" + b + a
    };
    e.extractFrame = function(c, a) {
        var b = c.image,
            d = c.frameWidth,
            f = c.frameHeight,
            g = b.width / d | 0;
        if (isNaN(a)) {
            var h = c.frameData[a];
            a = h instanceof Array ? h[0] : h
        }
        h = e._workingCanvas;
        h.width = d;
        h.height = f;
        e._workingContext.drawImage(b, a % g * d, (a / g | 0) * f, d, f, 0, 0, d, f);
        b = new Image;
        b.src = h.toDataURL("image/png");
        return b
    };
    m.SpriteSheetUtils = e
})(window);
/**
 * EaselJS
 * Visit http://easeljs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2011 Grant Skinner
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 **/
(function(m) {
    function e() {
        throw "UID cannot be instantiated";
    }
    e._nextID = 0;
    e.get = function() {
        return e._nextID++
    };
    m.UID = e
})(window);
(function(m) {
    function e() {
        throw "Ticker cannot be instantiated.";
    }
    e._listeners = [];
    e._pauseable = [];
    e._paused = false;
    e._inited = false;
    e._startTime = 0;
    e._pausedTime = 0;
    e._ticks = 0;
    e._pausedTickers = 0;
    e._interval = 50;
    e._intervalID = null;
    e._lastTime = 0;
    e._times = [];
    e.addListener = function(c, a) {
        if (!e._inited) {
            e._inited = true;
            e.setInterval(e._interval)
        }
        this.removeListener(c);
        e._pauseable[e._listeners.length] = a == null ? true : a;
        e._listeners.push(c)
    };
    e.removeListener = function(c) {
        if (e._listeners != null) {
            c = e._listeners.indexOf(c);
            if (c != -1) {
                e._listeners.splice(c, 1);
                e._pauseable.splice(c, 1)
            }
        }
    };
    e.removeAllListeners = function() {
        e._listeners = [];
        e._pauseable = []
    };
    e.setInterval = function(c) {
        e._intervalID != null && clearInterval(e._intervalID);
        e._lastTime = e._getTime();
        e._interval = c;
        e._intervalID = setInterval(e._tick, c)
    };
    e.getInterval = function() {
        return e._interval
    };
    e.getFPS = function() {
        return 1E3 / e._interval
    };
    e.setFPS = function(c) {
        e.setInterval(1E3 / c)
    };
    e.getMeasuredFPS = function(c) {
        if (e._times.length < 2) return -1;
        if (c == null) c = e.getFPS() >> 1;
        c =
            Math.min(e._times.length - 1, c);
        return 1E3 / ((e._times[0] - e._times[c]) / c)
    };
    e.setPaused = function(c) {
        e._paused = c
    };
    e.getPaused = function() {
        return e._paused
    };
    e.getTime = function(c) {
        return e._getTime() - e._startTime - (c ? e._pausedTime : 0)
    };
    e.getTicks = function(c) {
        return e._ticks - (c ? e._pausedTickers : 0)
    };
    e._tick = function() {
        e._ticks++;
        var c = e.getTime(false),
            a = c - e._lastTime,
            b = e._paused;
        if (b) {
            e._pausedTickers++;
            e._pausedTime += a
        }
        e._lastTime = c;
        for (var d = e._pauseable, f = e._listeners, g = f ? f.length : 0, h = 0; h < g; h++) {
            var i = d[h],
                j = f[h];
            j == null || b && i || j.tick == null || j.tick(a)
        }
        e._times.unshift(c);
        e._times.length > 100 && e._times.pop()
    };
    e._getTime = function() {
        return (new Date).getTime()
    };
    e._startTime = e._getTime();
    m.Ticker = e
})(window);
(function(m) {
    function e(a, b, d) {
        this.initialize(a, b, d)
    }
    var c = e.prototype;
    c.stageX = 0;
    c.stageY = 0;
    c.type = null;
    c.onMouseMove = null;
    c.onMouseUp = null;
    c.initialize = function(a, b, d) {
        this.type = a;
        this.stageX = b;
        this.stageY = d
    };
    c.clone = function() {
        return new e(this.type, this.stageX, this.stageY)
    };
    c.toString = function() {
        return "[MouseEvent (type=" + this.type + " stageX=" + this.stageX + " stageY=" + this.stageY + ")]"
    };
    m.MouseEvent = e
})(window);
(function(m) {
    function e(a, b, d, f, g, h) {
        this.initialize(a, b, d, f, g, h)
    }
    var c = e.prototype;
    e.identity = null;
    e.DEG_TO_RAD = Math.PI / 180;
    c.a = 1;
    c.b = 0;
    c.c = 0;
    c.d = 1;
    c.tx = 0;
    c.ty = 0;
    c.alpha = 1;
    c.shadow = null;
    c.compositeOperation = null;
    c.initialize = function(a, b, d, f, g, h) {
        if (a != null) this.a = a;
        if (b != null) this.b = b;
        if (d != null) this.c = d;
        if (f != null) this.d = f;
        if (g != null) this.tx = g;
        if (h != null) this.ty = h
    };
    c.prepend = function(a, b, d, f, g, h) {
        var i = this.tx;
        if (a != 1 || b != 0 || d != 0 || f != 1) {
            var j = this.a,
                l = this.c;
            this.a = j * a + this.b * d;
            this.b = j * b + this.b *
                f;
            this.c = l * a + this.d * d;
            this.d = l * b + this.d * f
        }
        this.tx = i * a + this.ty * d + g;
        this.ty = i * b + this.ty * f + h
    };
    c.append = function(a, b, d, f, g, h) {
        var i = this.a,
            j = this.b,
            l = this.c,
            k = this.d;
        this.a = a * i + b * l;
        this.b = a * j + b * k;
        this.c = d * i + f * l;
        this.d = d * j + f * k;
        this.tx = g * i + h * l + this.tx;
        this.ty = g * j + h * k + this.ty
    };
    c.prependMatrix = function(a) {
        this.prepend(a.a, a.b, a.c, a.d, a.tx, a.ty);
        this.prependProperties(a.alpha, a.shadow, a.compositeOperation)
    };
    c.appendMatrix = function(a) {
        this.append(a.a, a.b, a.c, a.d, a.tx, a.ty);
        this.appendProperties(a.alpha, a.shadow,
            a.compositeOperation)
    };
    c.prependTransform = function(a, b, d, f, g, h, i, j, l) {
        if (g % 360) {
            var k = g * e.DEG_TO_RAD;
            g = Math.cos(k);
            k = Math.sin(k)
        } else {
            g = 1;
            k = 0
        }
        if (j || l) {
            this.tx -= j;
            this.ty -= l
        }
        if (h || i) {
            h *= e.DEG_TO_RAD;
            i *= e.DEG_TO_RAD;
            this.prepend(g * d, k * d, -k * f, g * f, 0, 0);
            this.prepend(Math.cos(i), Math.sin(i), -Math.sin(h), Math.cos(h), a, b)
        } else this.prepend(g * d, k * d, -k * f, g * f, a, b)
    };
    c.appendTransform = function(a, b, d, f, g, h, i, j, l) {
        if (g % 360) {
            var k = g * e.DEG_TO_RAD;
            g = Math.cos(k);
            k = Math.sin(k)
        } else {
            g = 1;
            k = 0
        }
        if (h || i) {
            h *= e.DEG_TO_RAD;
            i *=
                e.DEG_TO_RAD;
            this.append(Math.cos(i), Math.sin(i), -Math.sin(h), Math.cos(h), a, b);
            this.append(g * d, k * d, -k * f, g * f, 0, 0)
        } else this.append(g * d, k * d, -k * f, g * f, a, b);
        if (j || l) {
            this.tx -= j * this.a + l * this.c;
            this.ty -= j * this.b + l * this.d
        }
    };
    c.rotate = function(a) {
        var b = Math.cos(a);
        a = Math.sin(a);
        var d = this.a,
            f = this.c,
            g = this.tx;
        this.a = d * b - this.b * a;
        this.b = d * a + this.b * b;
        this.c = f * b - this.d * a;
        this.d = f * a + this.d * b;
        this.tx = g * b - this.ty * a;
        this.ty = g * a + this.ty * b
    };
    c.skew = function(a, b) {
        a *= e.DEG_TO_RAD;
        b *= e.DEG_TO_RAD;
        this.append(Math.cos(b),
            Math.sin(b), -Math.sin(a), Math.cos(a), 0, 0)
    };
    c.scale = function(a, b) {
        this.a *= a;
        this.d *= b;
        this.tx *= a;
        this.ty *= b
    };
    c.translate = function(a, b) {
        this.tx += a;
        this.ty += b
    };
    c.identity = function() {
        this.alpha = this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
        this.shadow = this.compositeOperation = null
    };
    c.invert = function() {
        var a = this.a,
            b = this.b,
            d = this.c,
            f = this.d,
            g = this.tx,
            h = a * f - b * d;
        this.a = f / h;
        this.b = -b / h;
        this.c = -d / h;
        this.d = a / h;
        this.tx = (d * this.ty - f * g) / h;
        this.ty = -(a * this.ty - b * g) / h
    };
    c.decompose = function(a) {
        if (a == null) a = {};
        a.x =
            this.tx;
        a.y = this.ty;
        a.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
        a.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);
        var b = Math.atan2(-this.c, this.d),
            d = Math.atan2(this.b, this.a);
        if (b == d) {
            a.rotation = d / e.DEG_TO_RAD;
            if (this.a < 0 && this.d >= 0) a.rotation += a.rotation <= 0 ? 180 : -180;
            a.skewX = a.skewY = 0
        } else {
            a.skewX = b / e.DEG_TO_RAD;
            a.skewY = d / e.DEG_TO_RAD
        }
        return a
    };
    c.appendProperties = function(a, b, d) {
        this.alpha *= a;
        this.shadow = b || this.shadow;
        this.compositeOperation = d || this.compositeOperation
    };
    c.prependProperties = function(a,
        b, d) {
        this.alpha *= a;
        this.shadow = this.shadow || b;
        this.compositeOperation = this.compositeOperation || d
    };
    c.clone = function() {
        var a = new e(this.a, this.b, this.c, this.d, this.tx, this.ty);
        a.shadow = this.shadow;
        a.alpha = this.alpha;
        a.compositeOperation = this.compositeOperation;
        return a
    };
    c.toString = function() {
        return "[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]"
    };
    e.identity = new e(1, 0, 0, 1, 0, 0);
    m.Matrix2D = e
})(window);
(function(m) {
    function e(a, b) {
        this.initialize(a, b)
    }
    var c = e.prototype;
    c.x = 0;
    c.y = 0;
    c.initialize = function(a, b) {
        this.x = a == null ? 0 : a;
        this.y = b == null ? 0 : b
    };
    c.clone = function() {
        return new e(this.x, this.y)
    };
    c.toString = function() {
        return "[Point (x=" + this.x + " y=" + this.y + ")]"
    };
    m.Point = e
})(window);
(function(m) {
    function e(a, b, d, f) {
        this.initialize(a, b, d, f)
    }
    var c = e.prototype;
    c.x = 0;
    c.y = 0;
    c.width = 0;
    c.height = 0;
    c.initialize = function(a, b, d, f) {
        this.x = a == null ? 0 : a;
        this.y = b == null ? 0 : b;
        this.width = d == null ? 0 : d;
        this.height = f == null ? 0 : f
    };
    c.clone = function() {
        return new e(this.x, this.y, this.width, this.height)
    };
    c.toString = function() {
        return "[Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")]"
    };
    m.Rectangle = e
})(window);
(function(m) {
    function e(a, b, d, f) {
        this.initialize(a, b, d, f)
    }
    var c = e.prototype;
    e.identity = null;
    c.color = null;
    c.offsetX = 0;
    c.offsetY = 0;
    c.blur = 0;
    c.initialize = function(a, b, d, f) {
        this.color = a;
        this.offsetX = b;
        this.offsetY = d;
        this.blur = f
    };
    c.toString = function() {
        return "[Shadow]"
    };
    c.clone = function() {
        return new e(this.color, this.offsetX, this.offsetY, this.blur)
    };
    e.identity = new e(null, 0, 0, 0);
    m.Shadow = e
})(window);
(function(m) {
    function e(a, b, d, f) {
        this.initialize(a, b, d, f)
    }
    var c = e.prototype;
    c.image = null;
    c.frameWidth = 0;
    c.frameHeight = 0;
    c.frameData = null;
    c.loop = true;
    c.totalFrames = 0;
    c.initialize = function(a, b, d, f) {
        this.image = a;
        this.frameWidth = b;
        this.frameHeight = d;
        this.frameData = f
    };
    c.toString = function() {
        return "[SpriteSheet]"
    };
    c.clone = function() {
        var a = new e(this.image, this.frameWidth, this.frameHeight, this.frameData);
        a.loop = this.loop;
        a.totalFrames = this.totalFrames;
        return a
    };
    m.SpriteSheet = e
})(window);
(function(m) {
    function e(b, d) {
        this.f = b;
        this.params = d
    }

    function c(b) {
        this.initialize(b)
    }
    e.prototype.exec = function(b) {
        this.f.apply(b, this.params)
    };
    var a = c.prototype;
    c.getRGB = function(b, d, f, g) {
        return g == null ? "rgb(" + b + "," + d + "," + f + ")" : "rgba(" + b + "," + d + "," + f + "," + g + ")"
    };
    c.getHSL = function(b, d, f, g) {
        return g == null ? "hsl(" + b % 360 + "," + d + "%," + f + "%)" : "hsla(" + b % 360 + "," + d + "%," + f + "%," + g + ")"
    };
    c.STROKE_CAPS_MAP = ["butt", "round", "square"];
    c.STROKE_JOINTS_MAP = ["miter", "round", "bevel"];
    c._canvas = document.createElement("canvas");
    c._ctx = c._canvas.getContext("2d");
    c.beginCmd = new e(c._ctx.beginPath, []);
    c.fillCmd = new e(c._ctx.fill, []);
    c.strokeCmd = new e(c._ctx.stroke, []);
    a._strokeInstructions = null;
    a._strokeStyleInstructions = null;
    a._fillInstructions = null;
    a._instructions = null;
    a._oldInstructions = null;
    a._activeInstructions = null;
    a._active = false;
    a._dirty = false;
    a.initialize = function(b) {
        this.clear();
        this._ctx = c._ctx;
        with(this) eval(b)
    };
    a.draw = function(b) {
        this._dirty && this._updateInstructions();
        for (var d = this._instructions, f = 0, g = d.length; f <
            g; f++) d[f].exec(b)
    };
    a.moveTo = function(b, d) {
        this._activeInstructions.push(new e(this._ctx.moveTo, [b, d]));
        return this
    };
    a.lineTo = function(b, d) {
        this._dirty = this._active = true;
        this._activeInstructions.push(new e(this._ctx.lineTo, [b, d]));
        return this
    };
    a.arcTo = function(b, d, f, g, h) {
        this._dirty = this._active = true;
        this._activeInstructions.push(new e(this._ctx.arcTo, [b, d, f, g, h]));
        return this
    };
    a.arc = function(b, d, f, g, h, i) {
        this._dirty = this._active = true;
        if (i == null) i = false;
        this._activeInstructions.push(new e(this._ctx.arc, [b, d, f, g, h, i]));
        return this
    };
    a.quadraticCurveTo = function(b, d, f, g) {
        this._dirty = this._active = true;
        this._activeInstructions.push(new e(this._ctx.quadraticCurveTo, [b, d, f, g]));
        return this
    };
    a.bezierCurveTo = function(b, d, f, g, h, i) {
        this._dirty = this._active = true;
        this._activeInstructions.push(new e(this._ctx.bezierCurveTo, [b, d, f, g, h, i]));
        return this
    };
    a.rect = function(b, d, f, g) {
        this._dirty = this._active = true;
        this._activeInstructions.push(new e(this._ctx.rect, [b, d, f - 1, g]));
        return this
    };
    a.closePath = function() {
        if (this._active) {
            this._dirty =
                true;
            this._activeInstructions.push(new e(this._ctx.closePath, []))
        }
        return this
    };
    a.clear = function() {
        this._instructions = [];
        this._oldInstructions = [];
        this._activeInstructions = [];
        this._strokeInstructions = this._fillInstructions = this._strokeStyleInstructions = null;
        this._active = this._dirty = false;
        return this
    };
    a.beginFill = function(b) {
        this._active && this._newPath();
        this._fillInstructions = b ? [new e(this._setProp, ["fillStyle", b])] : null;
        return this
    };
    a.beginLinearGradientFill = function(b, d, f, g, h, i) {
        this._active && this._newPath();
        f = this._ctx.createLinearGradient(f, g, h, i);
        g = 0;
        for (h = b.length; g < h; g++) f.addColorStop(d[g], b[g]);
        this._fillInstructions = [new e(this._setProp, ["fillStyle", f])];
        return this
    };
    a.beginRadialGradientFill = function(b, d, f, g, h, i, j, l) {
        this._active && this._newPath();
        f = this._ctx.createRadialGradient(f, g, h, i, j, l);
        g = 0;
        for (h = b.length; g < h; g++) f.addColorStop(d[g], b[g]);
        this._fillInstructions = [new e(this._setProp, ["fillStyle", f])];
        return this
    };
    a.beginBitmapFill = function(b, d) {
        this._active && this._newPath();
        var f = this._ctx.createPattern(b,
            d || "");
        this._fillInstructions = [new e(this._setProp, ["fillStyle", f])];
        return this
    };
    a.endFill = function() {
        this.beginFill(null);
        return this
    };
    a.setStrokeStyle = function(b, d, f, g) {
        this._active && this._newPath();
        this._strokeStyleInstructions = [new e(this._setProp, ["lineWidth", b == null ? "1" : b]), new e(this._setProp, ["lineCap", d == null ? "butt" : isNaN(d) ? d : c.STROKE_CAPS_MAP[d]]), new e(this._setProp, ["lineJoin", f == null ? "miter" : isNaN(f) ? f : c.STROKE_JOINTS_MAP[f]]), new e(this._setProp, ["miterLimit", g == null ? "10" : g])];
        return this
    };
    a.beginStroke = function(b) {
        this._active && this._newPath();
        this._strokeInstructions = b ? [new e(this._setProp, ["strokeStyle", b])] : null;
        return this
    };
    a.beginLinearGradientStroke = function(b, d, f, g, h, i) {
        this._active && this._newPath();
        f = this._ctx.createLinearGradient(f, g, h, i);
        g = 0;
        for (h = b.length; g < h; g++) f.addColorStop(d[g], b[g]);
        this._strokeInstructions = [new e(this._setProp, ["strokeStyle", f])];
        return this
    };
    a.beginRadialGradientStroke = function(b, d, f, g, h, i, j, l) {
        this._active && this._newPath();
        f = this._ctx.createRadialGradient(f,
            g, h, i, j, l);
        g = 0;
        for (h = b.length; g < h; g++) f.addColorStop(d[g], b[g]);
        this._strokeInstructions = [new e(this._setProp, ["strokeStyle", f])];
        return this
    };
    a.beginBitmapStroke = function(b, d) {
        this._active && this._newPath();
        var f = this._ctx.createPattern(b, d || "");
        this._strokeInstructions = [new e(this._setProp, ["strokeStyle", f])];
        return this
    };
    a.endStroke = function() {
        this.beginStroke(null);
        return this
    };
    a.curveTo = a.quadraticCurveTo;
    a.drawRect = a.rect;
    a.drawRoundRect = function(b, d, f, g, h) {
        this.drawRoundRectComplex(b, d, f, g,
            h, h, h, h);
        return this
    };
    a.drawRoundRectComplex = function(b, d, f, g, h, i, j, l) {
        this._dirty = this._active = true;
        this._activeInstructions.push(new e(this._ctx.moveTo, [b + h, d]), new e(this._ctx.lineTo, [b + f - i, d]), new e(this._ctx.arc, [b + f - i, d + i, i, -Math.PI / 2, 0, false]), new e(this._ctx.lineTo, [b + f, d + g - j]), new e(this._ctx.arc, [b + f - j, d + g - j, j, 0, Math.PI / 2, false]), new e(this._ctx.lineTo, [b + l, d + g]), new e(this._ctx.arc, [b + l, d + g - l, l, Math.PI / 2, Math.PI, false]), new e(this._ctx.lineTo, [b, d + h]), new e(this._ctx.arc, [b + h, d + h, h, Math.PI,
            Math.PI * 3 / 2, false
        ]));
        return this
    };
    a.drawCircle = function(b, d, f) {
        this.arc(b, d, f, 0, Math.PI * 2);
        return this
    };
    a.drawEllipse = function(b, d, f, g) {
        this._dirty = this._active = true;
        var h = f / 2 * 0.5522848,
            i = g / 2 * 0.5522848,
            j = b + f,
            l = d + g;
        f = b + f / 2;
        g = d + g / 2;
        this._activeInstructions.push(new e(this._ctx.moveTo, [b, g]), new e(this._ctx.bezierCurveTo, [b, g - i, f - h, d, f, d]), new e(this._ctx.bezierCurveTo, [f + h, d, j, g - i, j, g]), new e(this._ctx.bezierCurveTo, [j, g + i, f + h, l, f, l]), new e(this._ctx.bezierCurveTo, [f - h, l, b, g + i, b, g]));
        return this
    };
    a.drawPolyStar =
        function(b, d, f, g, h, i) {
            this._dirty = this._active = true;
            if (h == null) h = 0;
            h = 1 - h;
            if (i == null) i = 0;
            else i /= 180 / Math.PI;
            var j = Math.PI / g;
            this._activeInstructions.push(new e(this._ctx.moveTo, [b + Math.cos(i) * f, d + Math.sin(i) * f]));
            for (var l = 0; l < g; l++) {
                i += j;
                h != 1 && this._activeInstructions.push(new e(this._ctx.lineTo, [b + Math.cos(i) * f * h, d + Math.sin(i) * f * h]));
                i += j;
                this._activeInstructions.push(new e(this._ctx.lineTo, [b + Math.cos(i) * f, d + Math.sin(i) * f]))
            }
            return this
        };
    a.clone = function() {
        var b = new c;
        b._instructions = this._instructions.slice();
        b._activeIntructions = this._activeInstructions.slice();
        b._oldInstructions = this._oldInstructions.slice();
        b._fillInstructions = this._fillInstructions.slice();
        b._strokeInstructions = this._strokeInstructions.slice();
        b._strokeStyleInstructions = this._strokeStyleInstructions.slice();
        b._active = this._active;
        b._dirty = this._dirty;
        b._assets = this._assets;
        return b
    };
    a.toString = function() {
        return "[Graphics]"
    };
    a.mt = a.moveTo;
    a.lt = a.lineTo;
    a.at = a.arcTo;
    a.bt = a.bezierCurveTo;
    a.qt = a.quadraticCurveTo;
    a.a = a.arc;
    a.r = a.rect;
    a.cp =
        a.closePath;
    a.c = a.clear;
    a.f = a.beginFill;
    a.lf = a.beginLinearGradientFill;
    a.rf = a.beginRadialGradientFill;
    a.bf = a.beginBitmapFill;
    a.ef = a.endFill;
    a.ss = a.setStrokeStyle;
    a.s = a.beginStroke;
    a.ls = a.beginLinearGradientStroke;
    a.rs = a.beginRadialGradientStroke;
    a.bs = a.beginBitmapStroke;
    a.es = a.endStroke;
    a.dr = a.drawRect;
    a.rr = a.drawRoundRect;
    a.rc = a.drawRoundRectComplex;
    a.dc = a.drawCircle;
    a.de = a.drawEllipse;
    a.dp = a.drawPolyStar;
    a._updateInstructions = function() {
        this._instructions = this._oldInstructions.slice();
        this._instructions.push(c.beginCmd);
        this._fillInstructions && this._instructions.push.apply(this._instructions, this._fillInstructions);
        if (this._strokeInstructions) {
            this._instructions.push.apply(this._instructions, this._strokeInstructions);
            this._strokeStyleInstructions && this._instructions.push.apply(this._instructions, this._strokeStyleInstructions)
        }
        this._instructions.push.apply(this._instructions, this._activeInstructions);
        this._fillInstructions && this._instructions.push(c.fillCmd);
        this._strokeInstructions && this._instructions.push(c.strokeCmd)
    };
    a._newPath = function() {
        this._dirty && this._updateInstructions();
        this._oldInstructions = this._instructions;
        this._activeInstructions = [];
        this._active = this._dirty = false
    };
    a._setProp = function(b, d) {
        this[b] = d
    };
    m.Graphics = c
})(window);
(function(m) {
    function e() {
        this.initialize()
    }
    var c = e.prototype;
    e.suppressCrossDomainErrors = false;
    e._hitTestCanvas = document.createElement("canvas");
    e._hitTestCanvas.width = e._hitTestCanvas.height = 1;
    e._hitTestContext = e._hitTestCanvas.getContext("2d");
    e._workingMatrix = new Matrix2D;
    c.alpha = 1;
    c.cacheCanvas = null;
    c.id = -1;
    c.mouseEnabled = true;
    c.name = null;
    c.parent = null;
    c.regX = 0;
    c.regY = 0;
    c.rotation = 0;
    c.scaleX = 1;
    c.scaleY = 1;
    c.skewX = 0;
    c.skewY = 0;
    c.shadow = null;
    c.visible = true;
    c.x = 0;
    c.y = 0;
    c.compositeOperation = null;
    c.snapToPixel =
        false;
    c.onPress = null;
    c.onClick = null;
    c._cacheOffsetX = 0;
    c._cacheOffsetY = 0;
    c._cacheDraw = false;
    c._activeContext = null;
    c._restoreContext = false;
    c._revertShadow = false;
    c._revertX = 0;
    c._revertY = 0;
    c._revertAlpha = 1;
    c.initialize = function() {
        this.id = UID.get();
        this.children = []
    };
    c.isVisible = function() {
        return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0
    };
    c.draw = function(a, b) {
        if (b || !this.cacheCanvas) return false;
        a.translate(this._cacheOffsetX, this._cacheOffsetY);
        a.drawImage(this.cacheCanvas, 0, 0);
        a.translate(-this._cacheOffsetX, -this._cacheOffsetY);
        return true
    };
    c.cache = function(a, b, d, f) {
        var g;
        if (this.cacheCanvas == null) this.cacheCanvas = document.createElement("canvas");
        g = this.cacheCanvas.getContext("2d");
        this.cacheCanvas.width = d;
        this.cacheCanvas.height = f;
        g.setTransform(1, 0, 0, 1, -a, -b);
        g.clearRect(0, 0, d + 1, f + 1);
        this.draw(g, true);
        this._cacheOffsetX = a;
        this._cacheOffsetY = b
    };
    c.updateCache = function(a) {
        if (this.cacheCanvas == null) throw "cache() must be called before updateCache()";
        var b = this.cacheCanvas.getContext("2d");
        b.setTransform(1,
            0, 0, 1, -this._cacheOffsetX, -this._cacheOffsetY);
        if (a) b.globalCompositeOperation = a;
        else b.clearRect(0, 0, this.cacheCanvas.width + 1, this.cacheCanvas.height + 1);
        this.draw(b, true);
        if (a) b.globalCompositeOperation = "source-over"
    };
    c.uncache = function() {
        this.cacheCanvas = null;
        this.cacheOffsetX = this.cacheOffsetY = 0
    };
    c.getStage = function() {
        for (var a = this; a.parent;) a = a.parent;
        if (a instanceof Stage) return a;
        return null
    };
    c.localToGlobal = function(a, b) {
        var d = this.getConcatenatedMatrix();
        if (d == null) return null;
        d.append(1,
            0, 0, 1, a, b);
        return new Point(d.tx, d.ty)
    };
    c.globalToLocal = function(a, b) {
        var d = this.getConcatenatedMatrix();
        if (d == null) return null;
        d.invert();
        d.append(1, 0, 0, 1, a, b);
        return new Point(d.tx, d.ty)
    };
    c.localToLocal = function(a, b, d) {
        a = this.localToGlobal(a, b);
        return d.globalToLocal(a.x, a.y)
    };
    c.getConcatenatedMatrix = function(a) {
        if (a) a.identity();
        else a = new Matrix2D;
        for (var b = this;;) {
            a.prependTransform(b.x, b.y, b.scaleX, b.scaleY, b.rotation, b.skewX, b.skewY, b.regX, b.regY);
            a.prependProperties(b.alpha, b.shadow, b.compositeOperation);
            if ((c = b.parent) == null) break;
            b = c
        }
        return a
    };
    c.hitTest = function(a, b) {
        var d = e._hitTestContext,
            f = e._hitTestCanvas;
        d.setTransform(1, 0, 0, 1, -a, -b);
        this.draw(d);
        d = this._testHit(d);
        f.width = 0;
        f.width = 1;
        return d
    };
    c.clone = function() {
        var a = new e;
        this.cloneProps(a);
        return a
    };
    c.toString = function() {
        return "[DisplayObject (name=" + this.name + ")]"
    };
    c.cloneProps = function(a) {
        a.alpha = this.alpha;
        a.name = this.name;
        a.regX = this.regX;
        a.regY = this.regY;
        a.rotation = this.rotation;
        a.scaleX = this.scaleX;
        a.scaleY = this.scaleY;
        a.shadow = this.shadow;
        a.skewX = this.skewX;
        a.skewY = this.skewY;
        a.visible = this.visible;
        a.x = this.x;
        a.y = this.y;
        a.mouseEnabled = this.mouseEnabled;
        a.compositeOperation = this.compositeOperation
    };
    c.applyShadow = function(a, b) {
        a.shadowColor = b.color;
        a.shadowOffsetX = b.offsetX;
        a.shadowOffsetY = b.offsetY;
        a.shadowBlur = b.blur
    };
    c._testHit = function(a) {
        try {
            var b = a.getImageData(0, 0, 1, 1).data[3] > 1
        } catch (d) {
            if (!e.suppressCrossDomainErrors) throw "An error has occured. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images.";
        }
        return b
    };
    m.DisplayObject = e
})(window);
(function(m) {
    function e() {
        this.initialize()
    }
    var c = e.prototype = new DisplayObject;
    c.children = null;
    c.DisplayObject_initialize = c.initialize;
    c.initialize = function() {
        this.DisplayObject_initialize();
        this.children = []
    };
    c.isVisible = function() {
        return this.visible && this.alpha > 0 && this.children.length && this.scaleX != 0 && this.scaleY != 0
    };
    c.DisplayObject_draw = c.draw;
    c.draw = function(a, b, d) {
        if (!d) {
            d = new Matrix2D;
            d.appendProperties(this.alpha, this.shadow, this.compositeOperation)
        }
        if (this.DisplayObject_draw(a, b)) return true;
        b = this.children.length;
        for (var f = this.children.slice(0), g = 0; g < b; g++) {
            var h = f[g];
            h.tick && h.tick();
            if (h.isVisible()) {
                var i = d.clone();
                i.appendTransform(h.x, h.y, h.scaleX, h.scaleY, h.rotation, h.skewX, h.skewY, h.regX, h.regY);
                i.appendProperties(h.alpha, h.shadow, h.compositeOperation);
                if (!(h instanceof e)) {
                    a.setTransform(i.a, i.b, i.c, i.d, i.tx, i.ty);
                    a.globalAlpha = i.alpha;
                    a.globalCompositeOperation = i.compositeOperation || "source-over";
                    i.shadow && this.applyShadow(a, i.shadow)
                }
                h.draw(a, false, i)
            }
        }
        return true
    };
    c.addChild =
        function(a) {
            var b = arguments.length;
            if (b > 1) {
                for (var d = 0; d < b; d++) this.addChild(arguments[d]);
                return arguments[b - 1]
            }
            a.parent && a.parent.removeChild(a);
            a.parent = this;
            this.children.push(a);
            return a
        };
    c.addChildAt = function(a, b) {
        var d = arguments.length;
        if (d > 2) {
            b = arguments[f - 1];
            for (var f = 0; f < d - 1; f++) this.addChildAt(arguments[f], b + f);
            return arguments[d - 2]
        }
        a.parent && a.parent.removeChild(a);
        a.parent = this;
        this.children.splice(b, 0, a);
        return a
    };
    c.removeChild = function(a) {
        var b = arguments.length;
        if (b > 1) {
            for (var d = true,
                    f = 0; f < b; f++) d = d && this.removeChild(arguments[f]);
            return d
        }
        return this.removeChildAt(this.children.indexOf(a))
    };
    c.removeChildAt = function(a) {
        var b = arguments.length;
        if (b > 1) {
            for (var d = [], f = 0; f < b; f++) d[f] = arguments[f];
            d.sort(function(h, i) {
                return i - h
            });
            var g = true;
            for (f = 0; f < b; f++) g = g && this.removeChildAt(d[f]);
            return g
        }
        if (a < 0 || a > this.children.length - 1) return false;
        b = this.children[a];
        if (b != null) b.parent = null;
        this.children.splice(a, 1);
        return true
    };
    c.removeAllChildren = function() {
        for (; this.children.length;) this.removeChildAt(0)
    };
    c.getChildAt = function(a) {
        return this.children[a]
    };
    c.sortChildren = function(a) {
        this.children.sort(a)
    };
    c.getChildIndex = function(a) {
        return this.children.indexOf(a)
    };
    c.getNumChildren = function() {
        return this.children.length
    };
    c.contains = function(a) {
        for (; a;) {
            if (a == this) return true;
            a = a.parent
        }
        return false
    };
    c.getObjectsUnderPoint = function(a, b) {
        var d = [],
            f = this.localToGlobal(a, b);
        this._getObjectsUnderPoint(f.x, f.y, d);
        return d
    };
    c.getObjectUnderPoint = function(a, b) {
        var d = this.localToGlobal(a, b);
        return this._getObjectsUnderPoint(d.x,
            d.y)
    };
    c.clone = function() {
        var a = new e;
        this.cloneProps(a);
        return a
    };
    c.toString = function() {
        return "[Container (name=" + this.name + ")]"
    };
    c._getObjectsUnderPoint = function(a, b, d, f) {
        var g = DisplayObject._hitTestContext,
            h = DisplayObject._hitTestCanvas,
            i = DisplayObject._workingMatrix,
            j = f && (this.onPress || this.onClick),
            l = Stage._snapToPixelEnabled;
        if (this.cacheCanvas) {
            this.getConcatenatedMatrix(i);
            g.setTransform(i.a, i.b, i.c, i.d, i.tx - a, i.ty - b);
            g.globalAlpha = i.alpha;
            this.draw(g);
            if (this._testHit(g)) {
                h.width = 0;
                h.width =
                    1;
                if (j) return this
            } else return null
        }
        for (var k = this.children.length - 1; k >= 0; k--) {
            var n = this.children[k];
            if (n.isVisible() && n.mouseEnabled)
                if (n instanceof e)
                    if (j) {
                        if (n = n._getObjectsUnderPoint(a, b)) return n
                    } else {
                        n = n._getObjectsUnderPoint(a, b, d, f);
                        if (!d && n) return n
                    }
            else if (!f || f && (n.onPress || n.onClick)) {
                n.getConcatenatedMatrix(i);
                l && n.snapToPixel && i.a == 1 && i.b == 0 && i.c == 0 && i.d == 1 ? g.setTransform(i.a, i.b, i.c, i.d, i.tx - a + 0.5 | 0, i.ty - b + 0.5 | 0) : g.setTransform(i.a, i.b, i.c, i.d, i.tx - a, i.ty - b);
                g.globalAlpha = i.alpha;
                n.draw(g);
                if (this._testHit(g)) {
                    h.width = 0;
                    h.width = 1;
                    if (d) d.push(n);
                    else return n
                }
            }
        }
        return null
    };
    m.Container = e
})(window);
(function(m) {
    function e(a) {
        this.initialize(a)
    }
    var c = e.prototype = new Container;
    e._snapToPixelEnabled = false;
    c.autoClear = true;
    c.canvas = null;
    c.mouseX = null;
    c.mouseY = null;
    c.onMouseMove = null;
    c.onMouseUp = null;
    c.onMouseDown = null;
    c.snapToPixelEnabled = false;
    c._tmpCanvas = null;
    c._activeMouseEvent = null;
    c._activeMouseTarget = null;
    c.Container_initialize = c.initialize;
    c.initialize = function(a) {
        this.Container_initialize();
        this.canvas = a;
        this.mouseChildren = true;
        var b = this;
        if (m.addEventListener) m.addEventListener("mouseup",
            function(d) {
                b._handleMouseUp(d)
            }, false);
        else document.addEventListener && document.addEventListener("mouseup", function(d) {
            b._handleMouseUp(d)
        }, false);
        a.addEventListener("mousemove", function(d) {
            b._handleMouseMove(d)
        }, false);
        a.addEventListener("mousedown", function(d) {
            b._handleMouseDown(d)
        }, false)
    };
    c.update = function() {
        if (this.canvas) {
            this.autoClear && this.clear();
            e._snapToPixelEnabled = this.snapToPixelEnabled;
            this.draw(this.canvas.getContext("2d"), false, this.getConcatenatedMatrix(DisplayObject._workingMatrix))
        }
    };
    c.tick = c.update;
    c.clear = function() {
        if (this.canvas) {
            var a = this.canvas.getContext("2d");
            a.setTransform(1, 0, 0, 1, 0, 0);
            a.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }
    };
    c.toDataURL = function(a, b) {
        b || (b = "image/png");
        var d = this.canvas.getContext("2d"),
            f = this.canvas.width,
            g = this.canvas.height,
            h;
        if (a) {
            h = d.getImageData(0, 0, f, g);
            var i = d.globalCompositeOperation;
            d.globalCompositeOperation = "destination-over";
            d.fillStyle = a;
            d.fillRect(0, 0, f, g)
        }
        var j = this.canvas.toDataURL(b);
        if (a) {
            d.clearRect(0, 0, f, g);
            d.putImageData(h,
                0, 0);
            d.globalCompositeOperation = i
        }
        return j
    };
    c.clone = function() {
        var a = new e(null);
        this.cloneProps(a);
        return a
    };
    c.toString = function() {
        return "[Stage (name=" + this.name + ")]"
    };
    c._handleMouseMove = function(a) {
        if (this.canvas) {
            if (!a) a = m.event;
            this.mouseX = a.pageX - this.canvas.offsetLeft;
            this.mouseY = a.pageY - this.canvas.offsetTop;
            a = new MouseEvent("onMouseMove", this.mouseX, this.mouseY);
            if (this.onMouseMove) this.onMouseMove(a);
            if (this._activeMouseEvent && this._activeMouseEvent.onMouseMove) this._activeMouseEvent.onMouseMove(a)
        } else this.mouseX =
            this.mouseY = null
    };
    c._handleMouseUp = function() {
        var a = new MouseEvent("onMouseUp", this.mouseX, this.mouseY);
        if (this.onMouseUp) this.onMouseUp(a);
        if (this._activeMouseEvent && this._activeMouseEvent.onMouseUp instanceof Function) this._activeMouseEvent.onMouseUp(a);
        if (this._activeMouseTarget && this._activeMouseTarget.onClick && this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, true) == this._activeMouseTarget) this._activeMouseTarget.onClick(new MouseEvent("onClick", this.mouseX, this.mouseY));
        this._activeMouseEvent =
            this.activeMouseTarget = null
    };
    c._handleMouseDown = function() {
        if (this.onMouseDown) this.onMouseDown(new MouseEvent("onMouseDown", this.mouseX, this.mouseY));
        var a = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, true);
        if (a) {
            if (a.onPress instanceof Function) {
                var b = new MouseEvent("onPress", this.mouseX, this.mouseY);
                a.onPress(b);
                if (b.onMouseMove || b.onMouseUp) this._activeMouseEvent = b
            }
            this._activeMouseTarget = a
        }
    };
    m.Stage = e
})(window);
(function(m) {
    function e(a) {
        this.initialize(a)
    }
    var c = e.prototype = new DisplayObject;
    c.image = null;
    c.snapToPixel = true;
    c.DisplayObject_initialize = c.initialize;
    c.initialize = function(a) {
        this.DisplayObject_initialize();
        this.image = a
    };
    c.isVisible = function() {
        return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.image && (this.image.complete || this.image.getContext)
    };
    c.DisplayObject_draw = c.draw;
    c.draw = function(a, b) {
        if (this.DisplayObject_draw(a, b)) return true;
        a.drawImage(this.image, 0, 0);
        return true
    };
    c.cache = function() {};
    c.uncache = function() {};
    c.clone = function() {
        var a = new e(this.image);
        this.cloneProps(a);
        return a
    };
    c.toString = function() {
        return "[Bitmap (name=" + this.name + ")]"
    };
    m.Bitmap = e
})(window);
(function(m) {
    function e(a) {
        this.initialize(a)
    }
    var c = e.prototype = new DisplayObject;
    c.callback = null;
    c.currentFrame = -1;
    c.currentSequence = null;
    c.currentEndFrame = null;
    c.currentStartFrame = null;
    c.nextSequence = null;
    c.paused = false;
    c.spriteSheet = null;
    c.snapToPixel = true;
    c.DisplayObject_initialize = c.initialize;
    c.initialize = function(a) {
        this.DisplayObject_initialize();
        this.spriteSheet = a
    };
    c.isVisible = function() {
        var a = this.spriteSheet ? this.spriteSheet.image : null;
        return this.visible && this.alpha > 0 && this.scaleX != 0 &&
            this.scaleY != 0 && a && this.currentFrame >= 0 && (a.complete || a.getContext)
    };
    c.DisplayObject_draw = c.draw;
    c.draw = function(a, b) {
        if (this.DisplayObject_draw(a, b)) return true;
        var d = this.spriteSheet.image,
            f = this.spriteSheet.frameWidth,
            g = this.spriteSheet.frameHeight,
            h = d.width / f | 0,
            i = d.height / g | 0;
        if (this.currentEndFrame != null) {
            if (this.currentFrame > this.currentEndFrame) {
                if (this.nextSequence) this._goto(this.nextSequence);
                else {
                    this.paused = true;
                    this.currentFrame = this.currentEndFrame
                }
                this.callback && this.callback(this)
            }
        } else if (this.spriteSheet.frameData) this.paused =
            true;
        else {
            i = this.spriteSheet.totalFrames || h * i;
            if (this.currentFrame >= i) {
                if (this.spriteSheet.loop) this.currentFrame = 0;
                else {
                    this.currentFrame = i;
                    this.paused = true
                }
                this.callback && this.callback(this)
            }
        }
        this.currentFrame >= 0 && a.drawImage(d, f * (this.currentFrame % h), g * (this.currentFrame / h | 0), f, g, 0, 0, f, g);
        return true
    };
    c.tick = function() {
        this.paused || this.currentFrame++
    };
    c.cache = function() {};
    c.uncache = function() {};
    c.gotoAndPlay = function(a) {
        this.paused = false;
        this._goto(a)
    };
    c.gotoAndStop = function(a) {
        this.paused = true;
        this._goto(a)
    };
    c.clone = function() {
        var a = new e(this.spriteSheet);
        this.cloneProps(a);
        return a
    };
    c.toString = function() {
        return "[BitmapSequence (name=" + this.name + ")]"
    };
    c.DisplayObject_cloneProps = c.cloneProps;
    c.cloneProps = function(a) {
        this.DisplayObject_cloneProps(a);
        a.callback = this.callback;
        a.currentFrame = this.currentFrame;
        a.currentStartFrame = this.currentStartFrame;
        a.currentEndFrame = this.currentEndFrame;
        a.currentSequence = this.currentSequence;
        a.nextSequence = this.nextSequence;
        a.paused = this.paused;
        a.frameData =
            this.frameData
    };
    c._goto = function(a) {
        if (isNaN(a))
            if (a == this.currentSequence) this.currentFrame = this.currentStartFrame;
            else {
                var b = this.spriteSheet.frameData[a];
                if (b instanceof Array) {
                    this.currentFrame = this.currentStartFrame = b[0];
                    this.currentSequence = a;
                    this.currentEndFrame = b[1];
                    if (this.currentEndFrame == null) this.currentEndFrame = this.currentStartFrame;
                    if (this.currentEndFrame == null) this.currentEndFrame = this.currentFrame;
                    this.nextSequence = b[2];
                    if (this.nextSequence == null) this.nextSequence = this.currentSequence;
                    else if (this.nextSequence == false) this.nextSequence = null
                } else {
                    this.currentSequence = this.nextSequence = null;
                    this.currentEndFrame = this.currentFrame = this.currentStartFrame = b
                }
            }
        else {
            this.currentSequence = this.nextSequence = this.currentEndFrame = null;
            this.currentStartFrame = 0;
            this.currentFrame = a
        }
    };
    m.BitmapSequence = e
})(window);
(function(m) {
    function e(a) {
        this.initialize(a)
    }
    var c = e.prototype = new DisplayObject;
    c.graphics = null;
    c.DisplayObject_initialize = c.initialize;
    c.initialize = function(a) {
        this.DisplayObject_initialize();
        this.graphics = a ? a : new Graphics
    };
    c.isVisible = function() {
        return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.graphics
    };
    c.DisplayObject_draw = c.draw;
    c.draw = function(a, b) {
        if (this.DisplayObject_draw(a, b)) return true;
        this.graphics.draw(a);
        return true
    };
    c.clone = function() {
        var a = new e(this.graphics);
        this.cloneProps(a);
        return a
    };
    c.toString = function() {
        return "[Shape (name=" + this.name + ")]"
    };
    m.Shape = e
})(window);
(function(m) {
    function e(b, d, f) {
        this.initialize(b, d, f)
    }
    var c = e.prototype = new DisplayObject,
        a = document.createElement("canvas");
    e._workingContext = a.getContext("2d");
    c.text = "";
    c.font = null;
    c.color = null;
    c.textAlign = null;
    c.textBaseline = null;
    c.maxWidth = null;
    c.outline = false;
    c.lineHeight = null;
    c.lineWidth = null;
    c.DisplayObject_initialize = c.initialize;
    c.initialize = function(b, d, f) {
        this.DisplayObject_initialize();
        this.text = b;
        this.font = d;
        this.color = f ? f : "#000"
    };
    c.isVisible = function() {
        return Boolean(this.visible &&
            this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.text != null && this.text != "")
    };
    c.DisplayObject_draw = c.draw;
    c.draw = function(b, d) {
        if (this.DisplayObject_draw(b, d)) return true;
        if (this.outline) b.strokeStyle = this.color;
        else b.fillStyle = this.color;
        b.font = this.font;
        b.textAlign = this.textAlign ? this.textAlign : "start";
        b.textBaseline = this.textBaseline ? this.textBaseline : "alphabetic";
        for (var f = String(this.text).split(/(?:\r\n|\r|\n)/), g = this.lineHeight == null ? this.getMeasuredLineHeight() : this.lineHeight, h = 0, i = 0,
                j = f.length; i < j; i++) {
            var l = b.measureText(f[i]).width;
            if (this.lineWidth == null || l < this.lineWidth) this._drawTextLine(b, f[i], h);
            else {
                l = f[i].split(/(\s)/);
                for (var k = l[0], n = 1, p = l.length; n < p; n += 2)
                    if (b.measureText(k + l[n] + l[n + 1]).width > this.lineWidth) {
                        this._drawTextLine(b, k, h);
                        h += g;
                        k = l[n + 1]
                    } else k += l[n] + l[n + 1];
                this._drawTextLine(b, k, h)
            }
            h += g
        }
        return true
    };
    c.getMeasuredWidth = function() {
        return this._getWorkingContext().measureText(this.text).width
    };
    c.getMeasuredLineHeight = function() {
        return this._getWorkingContext().measureText("M").width *
            1.2
    };
    c.clone = function() {
        var b = new e(this.text, this.font, this.color);
        this.cloneProps(b);
        return b
    };
    c.toString = function() {
        return "[Text (text=" + (this.text.length > 20 ? this.text.substr(0, 17) + "..." : this.text) + ")]"
    };
    c.DisplayObject_cloneProps = c.cloneProps;
    c.cloneProps = function(b) {
        this.DisplayObject_cloneProps(b);
        b.textAlign = this.textAlign;
        b.textBaseline = this.textBaseline;
        b.maxWidth = this.maxWidth;
        b.outline = this.outline;
        b.lineHeight = this.lineHeight;
        b.lineWidth = this.lineWidth
    };
    c._getWorkingContext = function() {
        var b =
            e._workingContext;
        b.font = this.font;
        b.textAlign = this.textAlign ? this.textAlign : "start";
        b.textBaseline = this.textBaseline ? this.textBaseline : "alphabetic";
        return b
    };
    c._drawTextLine = function(b, d, f) {
        this.outline ? b.strokeText(d, 0, f, this.maxWidth) : b.fillText(d, 0, f, this.maxWidth)
    };
    m.Text = e
})(window);
(function(m) {
    function e() {
        throw "SpriteSheetUtils cannot be instantiated";
    }
    e._workingCanvas = document.createElement("canvas");
    e._workingContext = e._workingCanvas.getContext("2d");
    e.flip = function(c, a) {
        var b = c.image,
            d = c.frameData,
            f = c.frameWidth,
            g = c.frameHeight,
            h = b.width / f | 0,
            i = b.height / g | 0,
            j = h * i,
            l = {},
            k, n;
        for (n in d) {
            k = d[n];
            if (k instanceof Array) k = k.slice(0);
            l[n] = k
        }
        var p = [],
            q = 0,
            o = 0;
        for (n in a) {
            k = a[n];
            k = d[k[0]];
            if (k != null) {
                if (k instanceof Array) {
                    var s = k[0],
                        r = k[1];
                    if (r == null) r = s
                } else s = r = k;
                p[o] = n;
                p[o + 1] = s;
                p[o + 2] = r;
                q += r - s + 1;
                o += 4
            }
        }
        d = e._workingCanvas;
        d.width = b.width;
        d.height = Math.ceil(i + q / h) * g;
        q = e._workingContext;
        q.drawImage(b, 0, 0, h * f, i * g, 0, 0, h * f, i * g);
        i = j - 1;
        for (o = 0; o < p.length; o += 4) {
            n = p[o];
            s = p[o + 1];
            r = p[o + 2];
            k = a[n];
            j = k[1] ? -1 : 1;
            for (var u = k[2] ? -1 : 1, v = j == -1 ? f : 0, w = u == -1 ? g : 0, t = s; t <= r; t++) {
                i++;
                q.save();
                q.translate(i % h * f + v, (i / h | 0) * g + w);
                q.scale(j, u);
                q.drawImage(b, t % h * f, (t / h | 0) * g, f, g, 0, 0, f, g);
                q.restore()
            }
            l[n] = [i - (r - s), i, k[3]]
        }
        b = new Image;
        b.src = d.toDataURL("image/png");
        return new SpriteSheet(b.width > 0 ? b : d, f, g, l)
    };
    e.frameDataToString = function(c) {
        var a = "",
            b = 0,
            d = 0,
            f = 0,
            g, h;
        for (h in c) {
            f++;
            g = c[h];
            if (g instanceof Array) {
                var i = g[0],
                    j = g[1];
                if (j == null) j = i;
                g = g[2];
                if (g == null) g = h
            } else {
                i = j = g;
                g = h
            }
            a += "\n\t" + h + ", start=" + i + ", end=" + j + ", next=" + g;
            if (g == false) a += " (stop)";
            else if (g == h) a += " (loop)";
            if (j > b) b = j;
            if (i < d) d = i
        }
        return f + " sequences, min=" + d + ", max=" + b + a
    };
    e.extractFrame = function(c, a) {
        var b = c.image,
            d = c.frameWidth,
            f = c.frameHeight,
            g = b.width / d | 0;
        if (isNaN(a)) {
            var h = c.frameData[a];
            a = h instanceof Array ? h[0] : h
        }
        h = e._workingCanvas;
        h.width = d;
        h.height = f;
        e._workingContext.drawImage(b, a % g * d, (a / g | 0) * f, d, f, 0, 0, d, f);
        b = new Image;
        b.src = h.toDataURL("image/png");
        return b
    };
    m.SpriteSheetUtils = e
})(window);
