enum CycleType {
    none,
    loop,
    boomerang,
}

enum Direction {
    none = -1,
    N = 0,
    S = 1,
    E = 2,
    W = 3,
    NE = 4,
    NW = 5,
    SE = 6,
    SW = 7,
}

enum Directional {
    none = 0,
    four = 4,
    eight = 8,
}

class Sprite {

    _parent: Transform;
    _path: string;
    _cycleType: CycleType;
    _cycleSpeed: number;
    _directional: Directional;
    _direction: Direction;
    _defaultDir: Direction;
    _numFrames: number;
    _currentFrame: number;
    _preLoadedImages: HTMLImageElement[];
    _height: number;
    _imgHeight: number;
    _lastDir: Direction;
    _lastFrame: number;

    constructor(
            parent: Transform,
            path: string, 
            height: number,
            imgHeight: number,
            cycleType: CycleType = CycleType.none,
            cycleSpeed: number = 1,
            directional: Directional = Directional.none,
            defaultDir: Direction = Direction.none,
            numFrames: number = 0,
        ) {

        this._parent = parent;
        this._path = path;
        this._imgHeight = imgHeight
        this._cycleType = cycleType;
        this._cycleSpeed = cycleSpeed;
        this._directional = directional;
        this._defaultDir = defaultDir;
        this._numFrames = numFrames
        this._height = height;
        
        if (this._directional) {
            this._direction = this._defaultDir;
        }
        else {
            this._direction = Direction.none;
        }

        this._currentFrame = 0;
        this._lastFrame = 0;
        this._lastDir = this._defaultDir;
            
        this._parent.element.css("background-image",
            "url('" + this._path + "')");

        var actualImage = new Image();
        actualImage.src = this._parent.element.css('background-image').replace(/"/g,"").replace(/url\(|\)$/ig, "");

        this._parent.size.x = (this._height / this._imgHeight) * actualImage.width // The actual image width
        this._parent.size.y = (this._height / this._imgHeight) * this._imgHeight // The actual image height
    }

    Update(world: World, scaleChanged: boolean = false) {
        let frame: number;
        let dir: number;
        let pixelOffset: number;

        if (this._parent.position.xChanged ||
            this._parent.position.yChanged) {
            if (this._cycleType == CycleType.boomerang) {
                frame = this.BoomerangCycle(world);
            }
            else if (this._cycleType == CycleType.loop) {
                frame = this.LoopCycle(world);
            }

            if (this._directional) { 
                dir = this.GetDir();
            }

            this._lastFrame = frame;
            this._lastDir = dir;

            pixelOffset = ((dir * this._numFrames) + frame) *
                this._height * world.scale;

            this._parent.element.css("background-position-y",
                '-' + pixelOffset + 'px');
        }

        if (scaleChanged) {
            pixelOffset = ((this._lastDir * this._numFrames) + this._lastFrame) *
                this._height * world.scale;

            this._parent.element.css("background-position-y",
                '-' + pixelOffset + 'px');
        }
    }

    BoomerangCycle(world: World): number {
        let frame: number;
        let totalFrames = (this._numFrames * 2) - 2

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
    }

    LoopCycle(world: World): number {
        let frame: number;

        if (this._parent.position.xChanged || 
            this._parent.position.yChanged) {
                this._currentFrame += (world.deltaTime * this._cycleSpeed);
        }

        this._currentFrame = this._currentFrame % this._numFrames;

        frame = Math.floor(this._currentFrame);

        return frame;
    }

    GetDir(): number {
        let dir: number;
        let heading: Vector = this._parent.position.heading.Normalize();
        let threshhold: number = Math.sin(Math.PI / 8);

        if (this._parent.position.xChanged || 
            this._parent.position.yChanged) {

            if (heading.y < -threshhold) {
                if (heading.x > threshhold) {
                    dir = Direction.NE;
                }
                else if (heading.x < -threshhold) {
                    dir = Direction.NW;
                }
                else {
                    dir = Direction.N;
                }
            }
            else if (heading.y > threshhold) {
                if (heading.x > threshhold) {
                    dir = Direction.SE;
                }
                else if (heading.x < -threshhold) {
                    dir = Direction.SW;
                }
                else {
                    dir = Direction.S;
                }
            }
            else {
                if (heading.x > threshhold) {
                    dir = Direction.E;
                }
                else if (heading.x < -threshhold) {
                    dir = Direction.W;
                }
                else {
                    dir = Direction.none;
                }
            }
        }

        return dir;
    }
}