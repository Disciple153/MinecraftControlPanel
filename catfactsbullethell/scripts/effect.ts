class Effect extends Transform {
    private _frameRate: number;     // FPS
    private _nextFrame: number;     // Time until next frame
    private _numFrames: number;     // The total number of frames in this effect
    private _currentFrame: number;  // The current frame
    private _sprite: string;        // The prefix of the file name

    Init(world: World, sprite: string = "", pos: Vector = null, dir: number = 0,
         numFrames: number = 0, frameRate: number = 15): void {
        this._numFrames = numFrames;
        this._frameRate = frameRate;
        this._currentFrame = 1;
        this._sprite = sprite;
        this._nextFrame = 1000 / this._frameRate;

        this.position.x = pos.x;
        this.position.y = pos.y;

        this.size.x = 20;
        this.size.y = 20;

        this.element.css("background-image",
            "url('assets/" + this._sprite + this._currentFrame + ".png')");
        this.element.css({'transform' : 'rotate('+ dir +'deg)'});
    }

    Pre(world: World): void {
        if (this._nextFrame > 0) {
            this._nextFrame -= world.deltaTime;
        }

        if (this._nextFrame <= 0) {
            this._nextFrame += 1000 / this._frameRate;
            this._currentFrame++;

            if (this._currentFrame <= this._numFrames) {
                this.element.css("background-image",
                    "url('assets/" + this._sprite + this._currentFrame + ".png')");
            }
            else {
                this.toDelete = true;
            }
        }
    }

    Post(world: World): void {
    }

    Collision(world: World): void {

    }
}