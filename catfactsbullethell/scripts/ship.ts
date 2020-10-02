class Ship extends Transform {
    SPEED: number = 0.5;
    FIRE_RATE: number = 10;     // FPS
    FACT_RATE: number = 2;      // Seconds until next

    public points: number = 0;

    private _control: Control;
    private _fireCountdown: number = 0;
    private _factCountdown: number = 0;
    private _look: number = 0;
    private _hp: number = 3;
    private _numFacts: number = 0;
    private _factsDestroyed: number = 0;
    private _laserSounds: Sound[];
    private _laserSoundIndex: number = 0;

    Init(world: World): void {
        this.size.x = 40;
        this.size.y = 50;
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

        this._hp = 3;
        this._factCountdown = 0;
        this.element.css("background-image",
            "url('assets/ship" + this._hp + ".png')");
    }

    Pre(world: World): void {
        let move: Vector = new Vector(0, 0);
        let pos: Vector;
        let look: Vector;

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

        // FACE TOWARD MOUSE
        pos = new Vector(this.position.x + (this.size.x / 2),
            this.position.y + (this.size.y / 2));

        look = new Vector(this._control.mouseX - pos.x,
            this._control.mouseY - pos.y);

        this._look = Math.atan(-look.x / look.y) * (180 / Math.PI);

        if (look.y > 0) {
            this._look += 180;
        }

        this.element.css({'transform' : 'rotate('+ this._look +'deg)'});

        // FIRE
        if (this._fireCountdown > 0) {
            this._fireCountdown -= world.deltaTime;
        }

        if (this._fireCountdown <= 0 && this._control.fire) {
            this._fireCountdown += (1000 / this.FIRE_RATE);

            this.Fire(world, pos);
        }

        // GENERATE NEW CATFACT
        if (this._factCountdown > 0) {
            this._factCountdown -= world.deltaTime;
        }

        if (this._factCountdown <= 0 &&
                this._numFacts < (0.25 * this._factsDestroyed) + 1) {
            this._factCountdown += this.FACT_RATE * 1000;

            this.GenerateCatFact(world);
        }


    }

    Post(world: World): void {
    }

    Fire(world: World, pos: Vector): void {
        let laser: Laser = <Laser> Game.AddTransform("Laser");
        laser.Init(world, this._look, pos);
        this._laserSounds[this._laserSoundIndex++].Play(0.05);
        if (this._laserSoundIndex >= this._laserSounds.length) {
            this._laserSoundIndex = 0;
        }
    }

    GenerateCatFact(world: World): void {
        let catFact: CatFact = <CatFact> Game.AddTransform("CatFact");

        this._numFacts++;

        catFact.Init(world, this);
    }

    Collision(world: World): void {
        let _this = this;

        this.collisions.forEach(function (collision) {
            if (collision.transform instanceof Bullet) {
                _this._hp--;

                if (_this._hp < 1) {
                    // Game over
                    Game.state = State.gameOver;
                }
                else {
                    _this.element.css("background-image",
                        "url('assets/ship" + _this._hp + ".png')");
                }
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

    AddPoints(points: number) {
        this.points += points;
        $("#Score").html("" + this.points);
    }

    FactDestroyed() {
        this._numFacts--;
        this._factsDestroyed++;
    }
}