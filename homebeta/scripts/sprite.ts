enum CycleType {
    none,
    loop,
    boomerang,
}

enum Direction {
    none = '',
    N = 'N',
    S = 'S',
    E = 'E',
    W = 'W',
    NE = 'NE',
    NW = 'NW',
    SE = 'SE',
    SW = 'SW',
}

class Sprite {

    _parent: Transform;
    _path: string;
    _cycleType: CycleType;
    _cycleSpeed: number;
    _directional: boolean;
    _direction: Direction;
    _defaultDir: Direction;
    _numFrames: number;
    _currentFrame: number;
    _preLoadedImages: HTMLImageElement[];

    constructor(
            parent: Transform,
            path: string, 
            cycleType: CycleType = CycleType.none,
            cycleSpeed: number = 1,
            directional: boolean = false,
            defaultDir: Direction = Direction.none,
            numFrames: number = 0,
        ) {

        let firstFrame: string;

        this._parent = parent;
        this._path = path;
        this._cycleType = cycleType;
        this._cycleSpeed = cycleSpeed;
        this._directional = directional;
        this._defaultDir = defaultDir;
        this._numFrames = numFrames
        
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
            
        this._parent.element.css("background-image",
            "url('" + this._path + "/" + this._direction + firstFrame + ".png')");
    }

    Update(world: World) {
        let frame: string = '';
        let dir: string = '';

        if (this._parent.position.xChanged ||
            this._parent.position.yChanged) {
            if (this._cycleType = CycleType.boomerang) {
                frame = this.BoomerangCycle(world);
            }

            if (this._directional) { 
                dir = this.GetDir(world);
            }

            this._parent.element.css("background-image",
                "url('" + this._path + "/" + dir + frame + ".png')");
        }
    }

    BoomerangCycle(world: World): string {
        let frame: number;
        let numFrames = (this._numFrames * 2) - 2

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
    }

    LoopCycle(world: World): string {
        let frame: string = '';

        if (this._parent.position.xChanged || 
            this._parent.position.yChanged) {
                this._currentFrame += (world.deltaTime * this._cycleSpeed);
        }

        this._currentFrame = this._currentFrame % this._numFrames;

        frame = (Math.floor(this._currentFrame) + 1).toString();

        console.log(frame);

        return frame;
    }

    GetDir(world: World): string {
        let dir: string = '';
        let heading: Vector = this._parent.position.heading;

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
    }

    PreLoadImages() {
        let directions: string[];
        let frames: string[];
        let preLoadedImages: HTMLImageElement[] = [];
        let path: string = this._path;


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

            for (let i = 1; i <= this._numFrames; i++) {
                frames.push(i.toString());
            }
        }
        else {
            frames = [''];
        }

        directions.forEach(function(dir) {
            frames.forEach(function(frame) {
                let img = new Image();
                img.src = path + '/' + dir + frame + '.png';
                preLoadedImages.push(img);
            });
        });

        this._preLoadedImages = preLoadedImages;
    }
}