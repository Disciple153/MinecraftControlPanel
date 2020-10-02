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
var Effect = /** @class */ (function (_super) {
    __extends(Effect, _super);
    function Effect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Effect.prototype.Init = function (world, sprite, pos, dir, numFrames, frameRate) {
        if (sprite === void 0) { sprite = ""; }
        if (pos === void 0) { pos = null; }
        if (dir === void 0) { dir = 0; }
        if (numFrames === void 0) { numFrames = 0; }
        if (frameRate === void 0) { frameRate = 15; }
        this._numFrames = numFrames;
        this._frameRate = frameRate;
        this._currentFrame = 1;
        this._sprite = sprite;
        this._nextFrame = 1000 / this._frameRate;
        this.position.x = pos.x;
        this.position.y = pos.y;
        this.size.x = 20;
        this.size.y = 20;
        this.element.css("background-image", "url('assets/" + this._sprite + this._currentFrame + ".png')");
        this.element.css({ 'transform': 'rotate(' + dir + 'deg)' });
    };
    Effect.prototype.Pre = function (world) {
        if (this._nextFrame > 0) {
            this._nextFrame -= world.deltaTime;
        }
        if (this._nextFrame <= 0) {
            this._nextFrame += 1000 / this._frameRate;
            this._currentFrame++;
            if (this._currentFrame <= this._numFrames) {
                this.element.css("background-image", "url('assets/" + this._sprite + this._currentFrame + ".png')");
            }
            else {
                this.toDelete = true;
            }
        }
    };
    Effect.prototype.Post = function (world) {
    };
    Effect.prototype.Collision = function (world) {
    };
    return Effect;
}(Transform));
