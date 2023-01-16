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
    _zoom: number;
    _imgHeight: number;

    constructor(
            parent: Transform,
            path: string, 
            imgHeight: number,
            cycleType: CycleType = CycleType.none,
            cycleSpeed: number = 1,
            directional: Directional = Directional.none,
            defaultDir: Direction = Direction.none,
            numFrames: number = 0,
            zoom: number = 0,
        ) {

        let firstFrame: string;

        this._parent = parent;
        this._path = path;
        this._imgHeight = imgHeight
        this._cycleType = cycleType;
        this._cycleSpeed = cycleSpeed;
        this._directional = directional;
        this._defaultDir = defaultDir;
        this._numFrames = numFrames
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
            
        this._parent.element.css("background-image",
            "url('" + this._path + "')");

        var actualImage = new Image();
        actualImage.src = this._parent.element.css('background-image').replace(/"/g,"").replace(/url\(|\)$/ig, "");

        this._parent.size.x = this._zoom * actualImage.width // The actual image width
        this._parent.size.y = this._zoom * this._imgHeight // The actual image height
    }

    Update(world: World) {
        let frame: number;
        let dir: number;
        let pixelOffset: number;

        if (this._parent.position.xChanged ||
            this._parent.position.yChanged) {
            if (this._cycleType = CycleType.boomerang) {
                frame = this.BoomerangCycle(world);
            }

            if (this._directional) { 
                dir = this.GetDir();
            }

            pixelOffset = ((dir * this._numFrames) + frame) * this._imgHeight * this._zoom;

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

        console.log(frame);

        return frame;
    }

    GetDir(): number {
        let dir: number;
        let heading: Vector = this._parent.position.heading;

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
    }
}