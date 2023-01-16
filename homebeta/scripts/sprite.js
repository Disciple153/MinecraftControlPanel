var CycleType;
(function (CycleType) {
    CycleType[CycleType["none"] = 0] = "none";
    CycleType[CycleType["loop"] = 1] = "loop";
    CycleType[CycleType["boomerang"] = 2] = "boomerang";
})(CycleType || (CycleType = {}));
var Direction;
(function (Direction) {
    Direction[Direction["none"] = -1] = "none";
    Direction[Direction["N"] = 0] = "N";
    Direction[Direction["S"] = 1] = "S";
    Direction[Direction["E"] = 2] = "E";
    Direction[Direction["W"] = 3] = "W";
    Direction[Direction["NE"] = 4] = "NE";
    Direction[Direction["NW"] = 5] = "NW";
    Direction[Direction["SE"] = 6] = "SE";
    Direction[Direction["SW"] = 7] = "SW";
})(Direction || (Direction = {}));
var Directional;
(function (Directional) {
    Directional[Directional["none"] = 0] = "none";
    Directional[Directional["four"] = 4] = "four";
    Directional[Directional["eight"] = 8] = "eight";
})(Directional || (Directional = {}));
var Sprite = /** @class */ (function () {
    function Sprite(parent, path, imgHeight, cycleType, cycleSpeed, directional, defaultDir, numFrames, zoom) {
        if (cycleType === void 0) { cycleType = CycleType.none; }
        if (cycleSpeed === void 0) { cycleSpeed = 1; }
        if (directional === void 0) { directional = Directional.none; }
        if (defaultDir === void 0) { defaultDir = Direction.none; }
        if (numFrames === void 0) { numFrames = 0; }
        if (zoom === void 0) { zoom = 0; }
        var firstFrame;
        this._parent = parent;
        this._path = path;
        this._imgHeight = imgHeight;
        this._cycleType = cycleType;
        this._cycleSpeed = cycleSpeed;
        this._directional = directional;
        this._defaultDir = defaultDir;
        this._numFrames = numFrames;
        this._zoom = zoom;
        if (this._directional) {
            this._direction = this._defaultDir;
        }
        else {
            this._direction = Direction.none;
        }
        if (this._cycleType != CycleType.none) {
            this._currentFrame = 0;
            firstFrame = '1';
        }
        else {
            firstFrame = '';
        }
        this._parent.element.css("background-image", "url('" + this._path + "')");
        var actualImage = new Image();
        actualImage.src = this._parent.element.css('background-image').replace(/"/g, "").replace(/url\(|\)$/ig, "");
        this._parent.size.x = this._zoom * actualImage.width; // The actual image width
        this._parent.size.y = this._zoom * this._imgHeight; // The actual image height
    }
    Sprite.prototype.Update = function (world) {
        var frame;
        var dir;
        var pixelOffset;
        if (this._parent.position.xChanged ||
            this._parent.position.yChanged) {
            if (this._cycleType = CycleType.boomerang) {
                frame = this.BoomerangCycle(world);
            }
            if (this._directional) {
                dir = this.GetDir();
            }
            pixelOffset = ((dir * this._numFrames) + frame) * this._imgHeight * this._zoom;
            this._parent.element.css("background-position-y", '-' + pixelOffset + 'px');
        }
    };
    Sprite.prototype.BoomerangCycle = function (world) {
        var frame;
        var totalFrames = (this._numFrames * 2) - 2;
        if (this._parent.position.xChanged ||
            this._parent.position.yChanged) {
            this._currentFrame += (world.deltaTime * this._cycleSpeed);
        }
        this._currentFrame = this._currentFrame % totalFrames;
        frame = Math.floor(this._currentFrame);
        if (frame >= this._numFrames) {
            frame = (2 * (this._numFrames - 1)) - frame;
        }
        return frame;
    };
    Sprite.prototype.LoopCycle = function (world) {
        var frame;
        if (this._parent.position.xChanged ||
            this._parent.position.yChanged) {
            this._currentFrame += (world.deltaTime * this._cycleSpeed);
        }
        this._currentFrame = this._currentFrame % this._numFrames;
        frame = Math.floor(this._currentFrame);
        console.log(frame);
        return frame;
    };
    Sprite.prototype.GetDir = function () {
        var dir;
        var heading = this._parent.position.heading;
        if (this._parent.position.xChanged ||
            this._parent.position.yChanged) {
            if (heading.y < 0) {
                if (heading.x > 0) {
                    dir = Direction.NE;
                }
                else if (heading.x < 0) {
                    dir = Direction.NW;
                }
                else {
                    dir = Direction.N;
                }
            }
            else if (heading.y > 0) {
                if (heading.x > 0) {
                    dir = Direction.SE;
                }
                else if (heading.x < 0) {
                    dir = Direction.SW;
                }
                else {
                    dir = Direction.S;
                }
            }
            else {
                if (heading.x > 0) {
                    dir = Direction.E;
                }
                else if (heading.x < 0) {
                    dir = Direction.W;
                }
                else {
                    dir = Direction.none;
                }
            }
        }
        return dir;
    };
    return Sprite;
}());
