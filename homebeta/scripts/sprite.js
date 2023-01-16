var CycleType;
(function (CycleType) {
    CycleType[CycleType["none"] = 0] = "none";
    CycleType[CycleType["loop"] = 1] = "loop";
    CycleType[CycleType["boomerang"] = 2] = "boomerang";
})(CycleType || (CycleType = {}));
var Direction;
(function (Direction) {
    Direction["none"] = "";
    Direction["N"] = "N";
    Direction["S"] = "S";
    Direction["E"] = "E";
    Direction["W"] = "W";
    Direction["NE"] = "NE";
    Direction["NW"] = "NW";
    Direction["SE"] = "SE";
    Direction["SW"] = "SW";
})(Direction || (Direction = {}));
var Sprite = /** @class */ (function () {
    function Sprite(parent, path, cycleType, cycleSpeed, directional, defaultDir, numFrames) {
        if (cycleType === void 0) { cycleType = CycleType.none; }
        if (cycleSpeed === void 0) { cycleSpeed = 1; }
        if (directional === void 0) { directional = false; }
        if (defaultDir === void 0) { defaultDir = Direction.none; }
        if (numFrames === void 0) { numFrames = 0; }
        var firstFrame;
        this._parent = parent;
        this._path = path;
        this._cycleType = cycleType;
        this._cycleSpeed = cycleSpeed;
        this._directional = directional;
        this._defaultDir = defaultDir;
        this._numFrames = numFrames;
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
        this.PreLoadImages();
        this._parent.element.css("background-image", "url('" + this._path + "/" + this._direction + firstFrame + ".png')");
    }
    Sprite.prototype.Update = function (world) {
        var frame = '';
        var dir = '';
        if (this._parent.position.xChanged ||
            this._parent.position.yChanged) {
            if (this._cycleType = CycleType.boomerang) {
                frame = this.BoomerangCycle(world);
            }
            if (this._directional) {
                dir = this.GetDir(world);
            }
            this._parent.element.css("background-image", "url('" + this._path + "/" + dir + frame + ".png')");
        }
    };
    Sprite.prototype.BoomerangCycle = function (world) {
        var frame;
        var numFrames = (this._numFrames * 2) - 2;
        if (this._parent.position.xChanged ||
            this._parent.position.yChanged) {
            this._currentFrame += (world.deltaTime * this._cycleSpeed);
        }
        this._currentFrame = this._currentFrame % numFrames;
        frame = (Math.floor(this._currentFrame) + 1);
        if (frame > this._numFrames) {
            frame = (2 * this._numFrames) - frame;
        }
        return frame.toString();
    };
    Sprite.prototype.LoopCycle = function (world) {
        var frame = '';
        if (this._parent.position.xChanged ||
            this._parent.position.yChanged) {
            this._currentFrame += (world.deltaTime * this._cycleSpeed);
        }
        this._currentFrame = this._currentFrame % this._numFrames;
        frame = (Math.floor(this._currentFrame) + 1).toString();
        console.log(frame);
        return frame;
    };
    Sprite.prototype.GetDir = function (world) {
        var dir = '';
        var heading = this._parent.position.heading;
        if (this._parent.position.xChanged ||
            this._parent.position.yChanged) {
            if (heading.y < 0) {
                dir += 'N';
            }
            else if (heading.y > 0) {
                dir += 'S';
            }
            if (heading.x > 0) {
                dir += 'E';
            }
            else if (heading.x < 0) {
                dir += 'W';
            }
        }
        return dir;
    };
    Sprite.prototype.PreLoadImages = function () {
        var directions;
        var frames;
        var preLoadedImages = [];
        var path = this._path;
        // Get array of directions
        if (this._directional) {
            directions = ['N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW'];
        }
        else {
            directions = [''];
        }
        // Get array of frames
        if (this._cycleType != CycleType.none) {
            frames = [];
            for (var i = 1; i <= this._numFrames; i++) {
                frames.push(i.toString());
            }
        }
        else {
            frames = [''];
        }
        directions.forEach(function (dir) {
            frames.forEach(function (frame) {
                var img = new Image();
                img.src = path + '/' + dir + frame + '.png';
                preLoadedImages.push(img);
            });
        });
        this._preLoadedImages = preLoadedImages;
    };
    return Sprite;
}());
