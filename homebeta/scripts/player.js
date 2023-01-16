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
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this_1 = _super !== null && _super.apply(this, arguments) || this;
        _this_1.SPEED = 0.2;
        _this_1.STEP_SPEED = 0.02;
        _this_1.points = 0;
        _this_1._steps = 0;
        return _this_1;
    }
    Player.prototype.Init = function (world) {
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
        this._steps = 0;
        this._sprite = new Sprite(this, // 
        "assets/hero", // path
        CycleType.boomerang, // cycleType
        this.STEP_SPEED, // cycleSpeed
        true, // directional
        Direction.S, // defaultDir
        3);
        var actualImage = new Image();
        actualImage.src = this.element.css('background-image').replace(/"/g, "").replace(/url\(|\)$/ig, "");
        this.size.x = 2 * actualImage.width; // The actual image width
        this.size.y = 2 * actualImage.height; // The actual image height
    };
    Player.prototype.Pre = function (world) {
        var move = new Vector(0, 0);
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
        var dir = this.Look();
        var step = this.Step(world.deltaTime);
        if (dir.length > 0) {
            this.element.css("background-image", "url('assets/hero/" + dir + step + ".png')"); // TODO load these images properly
        }
        this._sprite.Update(world);
    };
    Player.prototype.Post = function (world) {
    };
    Player.prototype.Collision = function (world) {
        var _this = this;
        this.collisions.forEach(function (collision) {
        });
    };
    Player.prototype.KeyDown = function (key) {
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
    Player.prototype.KeyUp = function (key) {
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
    Player.prototype.MouseDown = function (world, x, y) {
        this._control.fire = true;
        this._control.mouseX = x;
        this._control.mouseY = y;
    };
    Player.prototype.MouseUp = function () {
        this._control.fire = false;
    };
    Player.prototype.MouseMove = function (x, y) {
        this._control.mouseX = x;
        this._control.mouseY = y;
    };
    Player.prototype.Look = function () {
        var dir = '';
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
    };
    Player.prototype.Step = function (deltaTime) {
        var step = '';
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
    };
    return Player;
}(Transform));
