class Player extends Transform {
    SPEED: number = 2;
    STEP_SPEED: number = 0.02;

    public points: number = 0;

    private _control: Control;
    private _laserSounds: Sound[];
    private _steps: number = 0;
    private _sprite: Sprite;
    private _destination: Vector;

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
            "assets/hero.png",      // path
            10,                     // height
            32,                     // imgHeight
            CycleType.boomerang,    // cycleType
            this.STEP_SPEED,        // cycleSpeed
            Directional.eight,      // directional
            Direction.S,            // defaultDir
            3,                      // numFrames
        );
    }

    Pre(world: World): void {
        let move: Vector = new Vector(0, 0);

        // MOVE
        if (this._control.left) {
            move.x -= 1;
            this._destination = undefined;
        }
        if (this._control.right) {
            move.x += 1;
            this._destination = undefined;
        }

        if (this._control.up) {
            move.y -= 1;
            this._destination = undefined;
        }
        if (this._control.down) {
            move.y += 1;
            this._destination = undefined;
        }

        if (this._destination) {
            let destDelta: Vector = this._destination.Subtract(this.size.Multiply(world.scale / 2))
                                                     .Subtract(this.position);

            if (Math.abs(destDelta.x) < 1.5 &&
                Math.abs(destDelta.y) < 1.5) {
                move = new Vector();
                this._destination = undefined;
            }
            else {
                move = destDelta.Normalize();
            }
        }

        this.position.x += move.x * this.SPEED * world.deltaTime * world.scale / 100;
        this.position.y += move.y * this.SPEED * world.deltaTime * world.scale / 100;

        this._sprite.Update(world);
    }

    Post(world: World): void {
    }

    Collision(world: World): void {
        let _this = this;

        this.collisions.forEach(function (collision) {
            if (collision.transform instanceof Immovable) {
                _this._destination = undefined;
            }
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

    Click(x: number, y: number) {
        this._destination = new Vector(x, y);
    }
}