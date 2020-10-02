class CatFact extends Transform {

    FALL_VELOCITY: number = 300;
    SPEED: number = 100;
    ROTATION_SPEED: number = 0.05;
    FIRE_RATE: number = 2;
    FIRE_ROTATE: number = 0.05;
    GUNS_RATIO: number = 50;
    LASER_POWER: number = 2;

    private _sizeAdjusted: boolean;
    private _trimmed: boolean;
    private _textHeight: number;
    private _maxHp: number;
    private _hp: number;
    private _player: Ship;
    private _currentDirection: number = 0;
    private _targetDirection: number = 0;
    private _fireDirection: number = 0;
    private _numGuns: number = 0;
    private _fireCountdown: number = 0;
    private _fact: string;

    Init(world: World, player: Ship = null): void {
        let _this = this;
        let loaded = false;

        this._player = player;

        this.position.x = 20;
        this.position.y = -100;

        this.velocity.y = 0;

        this._targetDirection = Math.random() * 360;

        this.collidable = false;

        this.element.css("width", "auto");
        this.element.css("height", "auto");
        _this._fact = "Error: Cat Fact not loaded.";


        // Get a random cat fact and put it in this CatFact
        this.Load();

        // Prepare to adjust the size of the CatFact once the text has loaded.
        this._sizeAdjusted = false;
        this._trimmed = true;

        // Make sure that this ship was created correcly:
        if (player == null) {
            this.toDelete = true;
        }
    }

    Pre(world: World): void {
        // Adjust size once text is loaded.
        if (!this._sizeAdjusted && this._fact == this.element.html()) {

            // Get the default width and height of the fact
            let length = this.element.width();
            this._textHeight = this.element.height();

            // Make the fact teke up no more than one quarter of the screen
            if (length > MAX_WIDTH / 4) {
                this.size.x = MAX_WIDTH / 4;
            }
            else {
                this.size.x = length;
            }

            // Adjust the height to hold all of the text.
            this.size.y = (Math.floor(length / (MAX_WIDTH / 4))
                + 1) * this._textHeight;

            // Get ready to trim the excess of the box of the right.
            this._sizeAdjusted = true;
            this._trimmed = false;
        }
        else if (!this._trimmed) {

            // Trim the excess of the box on the right.
            this.size.x = this.element.width();
            this.size.y = this.element.height();

            // Place the box in a valid position above the play area.
            this.position.x =  Math.floor(Math.random() * (MAX_WIDTH - this.size.x));

            // Done adjusting
            this._trimmed = true;

            // Send fact into play area
            this.velocity.y = this.FALL_VELOCITY;
        }

        // Enable fact once it has reached teh play area.
        if (!this.collidable && this.position.y > MAX_HEIGHT / 4) {
            this.collidable = true;
        }

        // Once Fact is enabled, float around and fire.
        if (this.collidable) {
            this.Rotate(world);
            this.Fire(world);
        }
    }

    Post(world: World): void {
    }

    Collision(world: World): void {
        let _this = this;

        this.collisions.forEach(function (collision) {
            if (collision.transform instanceof Laser) {
                _this._hp -= _this.LASER_POWER;
                _this._player.AddPoints(_this.LASER_POWER);

                _this.element.html(`
                <p class="HPLost">${_this._fact.slice(0, _this._maxHp - _this._hp)}</p><p class="HPRemaining">${_this._fact.slice(_this._maxHp - _this._hp, _this._fact.length)}</p>
                `);


                if (_this._hp <= 0) {
                    _this._player.AddPoints(_this._maxHp);
                    _this._player.FactDestroyed();
                    _this.toDelete = true;
                }
            }
        });
    }

    Rotate(world: World) {
        // Determine the direction the CatFact is to turn
        if ((this._currentDirection - this._targetDirection + 360) % 360 < 180){
            // decrease currentDirection
            this._currentDirection -= world.deltaTime * this.ROTATION_SPEED;
        }
        else {
            // increase currentDirection
            this._currentDirection += world.deltaTime * this.ROTATION_SPEED;
        }

        // normalize the current direction
        this._currentDirection = (this._currentDirection + 360) % 360;

        // If the currentDirection has reached the targetDirection:
        if (Math.abs((this._currentDirection - this._targetDirection + 360) % 360) <
            world.deltaTime * this.ROTATION_SPEED) {
            // Generate new targetDirection
            this._targetDirection = Math.random() * 360;
        }

        // Generate a velocity based on the currentDirection
        this.velocity.x = Math.sin(this._currentDirection * (Math.PI / 180)) * this.SPEED;
        this.velocity.y = Math.cos(this._currentDirection * (Math.PI / 180)) * this.SPEED;
    }

    Fire(world: World) {
        let bullet: Bullet;
        let pos: Vector;

        this._fireDirection += (this.FIRE_ROTATE * world.deltaTime) % 360;
        this._fireCountdown -= world.deltaTime;

        pos = new Vector(this.position.x + (this.size.x / 2),
            this.position.y + (this.size.y / 2));

        if (this._fireCountdown <= 0) {
            this._fireCountdown += 1000 / this.FIRE_RATE;

            for (let i = 0; i < this._numGuns; i++) {
                bullet= <Bullet> Game.AddTransform("Bullet");
                bullet.Init(
                    world,
                    (this._fireDirection + ((i * 360) / this._numGuns)) % 360,
                    pos);
            }
        }
    }

    Load() {
        let _this = this;

        $.ajax({
            url: "https://catfact.ninja/fact",
            success: function (data) {
                _this._fact = data.fact;
                _this.element.html(_this._fact);
                _this._maxHp = _this._fact.length;
                _this._hp = _this._maxHp;
                _this._numGuns = Math.floor((_this._maxHp / _this.GUNS_RATIO) + 1);
            },
            error: function (x, y, z) {
                console.log("ERROR\n" + JSON.stringify(x) + "\n" + y + "\n" + z);
                _this.Load();
            }
        });
    }
}

function n() {
    var userAgeInput = document.getElementById("userAge");
    userAgeInput.style.backgroundColor =  "green";
}