var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Ship = /** @class */ (function (_super) {
    __extends(Ship, _super);
    function Ship() {
        var _this_1 = _super !== null && _super.apply(this, arguments) || this;
        _this_1.SPEED = 0.5;
        _this_1.FIRE_RATE = 10; // FPS
        _this_1.FACT_RATE = 2; // Seconds until next
        _this_1.points = 0;
        _this_1._fireCountdown = 0;
        _this_1._factCountdown = 0;
        _this_1._look = 0;
        _this_1._hp = 3;
        _this_1._numFacts = 0;
        _this_1._factsDestroyed = 0;
        _this_1._laserSoundIndex = 0;
        return _this_1;
    }
    Ship.prototype.Init = function (world) {
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
        for (var i = 0; i < 10; i++) {
            this._laserSounds.push(new Sound("assets/laser.mp3"));
        }
        this._hp = 3;
        this._factCountdown = 0;
        this.element.css("background-image", "url('assets/ship" + this._hp + ".png')");
    };
    Ship.prototype.Pre = function (world) {
        var move = new Vector(0, 0);
        var pos;
        var look;
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
        pos = new Vector(this.position.x + (this.size.x / 2), this.position.y + (this.size.y / 2));
        look = new Vector(this._control.mouseX - pos.x, this._control.mouseY - pos.y);
        this._look = Math.atan(-look.x / look.y) * (180 / Math.PI);
        if (look.y > 0) {
            this._look += 180;
        }
        this.element.css({ 'transform': 'rotate(' + this._look + 'deg)' });
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
    };
    Ship.prototype.Post = function (world) {
    };
    Ship.prototype.Fire = function (world, pos) {
        var laser = Game.AddTransform("Laser");
        laser.Init(world, this._look, pos);
        this._laserSounds[this._laserSoundIndex++].Play(0.05);
        if (this._laserSoundIndex >= this._laserSounds.length) {
            this._laserSoundIndex = 0;
        }
    };
    Ship.prototype.GenerateCatFact = function (world) {
        var catFact = Game.AddTransform("CatFact");
        this._numFacts++;
        catFact.Init(world, this);
    };
    Ship.prototype.Collision = function (world) {
        var _this = this;
        this.collisions.forEach(function (collision) {
            if (collision.transform instanceof Bullet) {
                _this._hp--;
                if (_this._hp < 1) {
                    // Game over
                    Game.state = State.gameOver;
                }
                else {
                    _this.element.css("background-image", "url('assets/ship" + _this._hp + ".png')");
                }
            }
        });
    };
    Ship.prototype.KeyDown = function (key) {
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
    };
    Ship.prototype.KeyUp = function (key) {
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
    };
    Ship.prototype.MouseDown = function (world, x, y) {
        this._control.fire = true;
        this._control.mouseX = x;
        this._control.mouseY = y;
    };
    Ship.prototype.MouseUp = function () {
        this._control.fire = false;
    };
    Ship.prototype.MouseMove = function (x, y) {
        this._control.mouseX = x;
        this._control.mouseY = y;
    };
    Ship.prototype.AddPoints = function (points) {
        this.points += points;
        $("#Score").html("" + this.points);
    };
    Ship.prototype.FactDestroyed = function () {
        this._numFacts--;
        this._factsDestroyed++;
    };
    return Ship;
}(Transform));
