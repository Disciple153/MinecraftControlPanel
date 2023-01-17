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
var Immovable = /** @class */ (function (_super) {
    __extends(Immovable, _super);
    function Immovable(element, posX, posY, sizeX, sizeY, id) {
        if (element === void 0) { element = null; }
        if (posX === void 0) { posX = 0; }
        if (posY === void 0) { posY = 0; }
        if (sizeX === void 0) { sizeX = 0; }
        if (sizeY === void 0) { sizeY = 0; }
        if (id === void 0) { id = ""; }
        var _this = _super.call(this, null, id) || this;
        _this.position = new Vector(posX, posY);
        _this.size = new Vector(sizeX, sizeY);
        _this.velocity.x = 0;
        _this.velocity.y = 0;
        _this.collidable = true;
        return _this;
    }
    Immovable.prototype.Init = function (world) { };
    Immovable.prototype.Pre = function (world) {
    };
    Immovable.prototype.Post = function (world) {
    };
    Immovable.prototype.Collision = function (world) { };
    // Do not move under any circumstance
    Immovable.prototype.CorrectRelativeTo = function (world, collision) { };
    return Immovable;
}(Transform));
