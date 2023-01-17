/**
 * Vector
 * Defines a direction and magnitude in 2D space.
 */
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this._x = x;
        this._y = y;
        this._xOld = x;
        this._yOld = y;
    }
    Object.defineProperty(Vector.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (x) {
            this._x = x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (y) {
            this._y = y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "xChanged", {
        get: function () {
            return this._x != this._xOld;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "yChanged", {
        get: function () {
            return this._y != this._yOld;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "heading", {
        get: function () {
            return new Vector(this._x - this._xOld, this._y - this._yOld);
        },
        enumerable: true,
        configurable: true
    });
    Vector.prototype.Reset = function () {
        this._xOld = this._x;
        this._yOld = this._y;
    };
    Vector.prototype.Add = function () {
        var vectors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            vectors[_i] = arguments[_i];
        }
        var x = this.x;
        var y = this.y;
        vectors.forEach(function (v) {
            x += v.x;
            y += v.y;
        });
        return new Vector(x, y);
    };
    Vector.prototype.Subtract = function (vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    };
    Vector.prototype.Normalize = function () {
        var h = Math.sqrt((Math.pow(this.x, 2)) + (Math.pow(this.y, 2)));
        return new Vector(this.x / h, this.y / h);
    };
    return Vector;
}());
