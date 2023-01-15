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
var Bird = /** @class */ (function (_super) {
    __extends(Bird, _super);
    function Bird() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.GRAVITY = 5;
        return _this;
    }
    Bird.prototype.Init = function (world) {
        this.size.x = 50;
        this.size.y = 50;
        this.collidable = true;
    };
    Bird.prototype.Pre = function (world) {
        this.velocity.y += (this.GRAVITY * world.deltaTime) / 10;
    };
    Bird.prototype.Post = function (world) {
    };
    Bird.prototype.Collision = function (world) {
        CollisionTypes.Box(world, this, this.collisions);
    };
    return Bird;
}(Transform));
