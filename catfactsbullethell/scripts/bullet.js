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
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        var _this_1 = _super !== null && _super.apply(this, arguments) || this;
        _this_1.SPEED = 100;
        _this_1.OFFSET = 30;
        _this_1.width = 15;
        _this_1.height = 15;
        return _this_1;
    }
    Bullet.prototype.Init = function (world, direction, origin) {
        if (direction === void 0) { direction = 0; }
        if (origin === void 0) { origin = new Vector(0, 0); }
        this.size.x = this.width;
        this.size.y = this.height;
        this.velocity.x = Math.sin(direction * (Math.PI / 180));
        this.velocity.y = -Math.cos(direction * (Math.PI / 180));
        this.position.x = origin.x + (this.velocity.x * this.OFFSET);
        this.position.y = origin.y + (this.velocity.y * this.OFFSET);
        this.velocity.x *= this.SPEED;
        this.velocity.y *= this.SPEED;
        this.element.css({ 'transform': 'rotate(' + direction + 'deg)' });
        this.collidable = true;
    };
    Bullet.prototype.Pre = function (world) {
    };
    Bullet.prototype.Post = function (world) {
    };
    Bullet.prototype.Collision = function (world) {
        var _this = this;
        this.collisions.forEach(function (collision) {
            if (collision.transform instanceof Immovable ||
                collision.transform instanceof Ship) {
                _this.toDelete = true;
            }
        });
    };
    return Bullet;
}(Transform));
