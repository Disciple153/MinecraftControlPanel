var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Laser = /** @class */ (function (_super) {
    __extends(Laser, _super);
    function Laser() {
        var _this_1 = _super !== null && _super.apply(this, arguments) || this;
        _this_1.SPEED = 1000;
        _this_1.OFFSET = 25;
        _this_1.width = 3;
        _this_1.height = 35;
        return _this_1;
    }
    Laser.prototype.Init = function (world, direction, origin) {
        if (direction === void 0) { direction = 0; }
        if (origin === void 0) { origin = new Vector(0, 0); }
        this.size.x = this.width;
        this.size.y = this.height;
        this.velocity.x = Math.sin(direction * (Math.PI / 180));
        this.velocity.y = -Math.cos(direction * (Math.PI / 180));
        this._normalV = new Vector(this.velocity.x, this.velocity.y);
        this.position.x = origin.x + (this.velocity.x * this.OFFSET) - (this.size.x / 2);
        this.position.y = origin.y + (this.velocity.y * this.OFFSET) - (this.size.y / 2);
        this.velocity.x *= this.SPEED;
        this.velocity.y *= this.SPEED;
        this._direction = direction;
        this.element.css({ 'transform': 'rotate(' + direction + 'deg)' });
        this.collidable = true;
    };
    Laser.prototype.Pre = function (world) {
    };
    Laser.prototype.Post = function (world) {
    };
    Laser.prototype.Collision = function (world) {
        var _this = this;
        var pos;
        this.collisions.forEach(function (collision) {
            if (collision.transform instanceof Immovable ||
                collision.transform instanceof CatFact) {
                _this.toDelete = true;
            }
            if (collision.transform instanceof CatFact) {
                pos = new Vector(_this.position.x + (_this.size.x / 2), _this.position.y + (_this.size.y / 2));
                pos.x += _this._normalV.x * (_this.height / 2);
                pos.y += _this._normalV.y * (_this.height / 2);
                var effect = Game.AddTransform("Effect");
                effect.Init(world, "hit", pos, _this._direction, 6);
            }
        });
    };
    return Laser;
}(Transform));
