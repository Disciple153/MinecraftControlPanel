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
var Box = /** @class */ (function (_super) {
    __extends(Box, _super);
    function Box() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.GRAVITY = 5;
        _this.RESISTANCE = 0.75;
        return _this;
    }
    Box.prototype.Init = function (world) {
        this.velocity.x = 1000;
        this.velocity.y = 0;
        this.collidable = true;
    };
    Box.prototype.Pre = function (world) {
        this.velocity.y += (this.GRAVITY * world.deltaTime) / 10;
        this.element.html("");
    };
    Box.prototype.Post = function (world) {
        this.element.append("<p>x: " + this.velocity.x.toFixed(2) + "<br> y: " + this.velocity.y.toFixed(2));
    };
    Box.prototype.Collision = function (world) {
        CollisionTypes.Box(world, this, this.collisions);
    };
    return Box;
}(Transform));
