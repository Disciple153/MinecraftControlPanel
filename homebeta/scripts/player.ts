class Player extends Transform {
    SPEED: number = 0.2;
    STEP_SPEED: number = 0.02;

    public points: number = 0;

    private _control: Control;
    private _laserSounds: Sound[];
    private _steps: number = 0;
    private _sprite: Sprite;

    Init(world: World): void {
        this.collidable = true;

        this._control = {
            up: false,
            left: false,
            down: false,
            right: false,
            fire: false,
            mouseX: 0,
            mouseY: 0
        };

        this._laserSounds = [];
        for (let i = 0; i < 10; i++){
            this._laserSounds.push(new Sound("assets/laser.mp3"));
        }

        this._steps = 0;

        this._sprite = new Sprite(
            this,                   // 
            "assets/hero",          // path
            CycleType.boomerang,    // cycleType
            this.STEP_SPEED,        // cycleSpeed
            true,                   // directional
            Direction.S,            // defaultDir
            3,                      // numFrames
        );
        
        var actualImage = new Image();
        actualImage.src = this.element.css('background-image').replace(/"/g,"").replace(/url\(|\)$/ig, "");

        this.size.x = 2 * actualImage.width // The actual image width
        this.size.y = 2 * actualImage.height // The actual image height
    }

    Pre(world: World): void {
        let move: Vector = new Vector(0, 0);

        // MOVE
        if (this._control.left) {
            move.x -= 1;
        }
        if (this._control.right) {
            move.x += 1;
        }

        if (this._control.up) {
            move.y -= 1;
        }
        if (this._control.down) {
            move.y += 1;
        }

        this.position.x += move.x * this.SPEED * world.deltaTime;
        this.position.y += move.y * this.SPEED * world.deltaTime;

        // WALK IN DIRECTION OF MOVEMENT
        let dir = this.Look();

        let step = this.Step(world.deltaTime);

        if (dir.length > 0) {
            this.element.css("background-image",
                "url('assets/hero/" + dir + step + ".png')"); // TODO load these images properly
        }

        this._sprite.Update(world);
    }

    Post(world: World): void {
    }

    Collision(world: World): void {
        let _this = this;

        this.collisions.forEach(function (collision) {
        });
    }

    KeyDown(key: string): void {
        switch (key) {
            case "w":
                this._control.up = true;
                break;

            case "a":
                this._control.left = true;
                break;

            case "s":
                this._control.down = true;
                break;

            case "d":
                this._control.right = true;
                break;
        }
    }

    KeyUp(key: string):void {
        switch (key) {
            case "w":
                this._control.up = false;
                break;

            case "a":
                this._control.left = false;
                break;

            case "s":
                this._control.down = false;
                break;

            case "d":
                this._control.right = false;
                break;
        }
    }

    MouseDown(world: World, x: number, y: number): void {
        this._control.fire = true;
        this._control.mouseX = x;
        this._control.mouseY = y;
    }

    MouseUp(): void {
        this._control.fire = false;
    }

    MouseMove(x: number, y: number) {
        this._control.mouseX = x;
        this._control.mouseY = y;
    }

    Look(): string {
        let dir: string = '';

        if (this._control.up) {
            dir += 'N';
        }
        else if (this._control.down) {
            dir += 'S';
        }

        if (this._control.left) {
            dir += 'W';
        }
        else if (this._control.right) {
            dir += 'E';
        }

        return dir;
    }

    Step(deltaTime: number): string {
        let step: string = '';

        if (this._control.up ||
            this._control.down ||
            this._control.left ||
            this._control.right) {
                this._steps += deltaTime;
        }

        this._steps = this._steps % (4 / this.STEP_SPEED);

        if (this._steps < (1 / this.STEP_SPEED)) {
            step = '1';
        }
        else if (this._steps < (2 / this.STEP_SPEED)) {
            step = '2';
        }
        else if (this._steps < (3 / this.STEP_SPEED)) {
            step = '3';
        }
        else {
            step = '2';
        }

        return step;
    }
}