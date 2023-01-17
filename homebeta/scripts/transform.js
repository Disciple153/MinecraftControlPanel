/**
 * Transform
 * Defines an object's position, size and velocity along with other key information.
 */
var Transform = /** @class */ (function () {
    // Constructor
    function Transform(element, id) {
        if (id === void 0) { id = ""; }
        this.GRAVITY = 0;
        this.RESISTANCE = 0;
        this.toDelete = false;
        // Protected variables
        this._collisions = [];
        this.collisions = [];
        this.collidable = false;
        this._velocity = new Vector();
        this.velocity = new Vector();
        this.element = element;
        if (element != null) {
            this.id = element.attr("id");
        }
        else {
            this.id = id;
        }
    }
    // Blueprints
    Transform.prototype.Init = function (world) { };
    ;
    Transform.prototype.Pre = function (world) { };
    ;
    Transform.prototype.Post = function (world) { };
    ;
    Transform.prototype.Collision = function (world) { };
    ;
    // Static functions
    Transform.GetTransform = function (element) {
        var jElement = $(element);
        var transform;
        var classes = jElement.attr("class").split(/\s+/);
        if (classes.length > 2) {
            console.error("Error on element: " + jElement.attr("id") + "\n                : GameObjects may belong to only one class.");
        }
        for (var i = 0; i < classes.length; i++) {
            if (classes[i] != "GameObject") {
                transform = new window[classes[i]](jElement);
            }
        }
        transform.position = new Vector(parseInt(jElement.css("left")), parseInt(jElement.css("top")));
        transform.size = new Vector(parseInt(jElement.css("width")), parseInt(jElement.css("height")));
        return transform;
    };
    // Functions
    Transform.prototype.SetTransform = function (world, scaleChanged) {
        if (this.element != null &&
            (this.position.xChanged || this.position.yChanged
                || this.size.xChanged || this.size.yChanged
                || scaleChanged)) {
            if (this.position.xChanged)
                this.element.css("left", this.position.x);
            if (this.position.yChanged)
                this.element.css("top", this.position.y);
            if (this.size.xChanged || scaleChanged)
                this.element.css("width", this.size.x * world.scale);
            if (this.size.yChanged || scaleChanged)
                this.element.css("height", this.size.y * world.scale);
        }
        if (scaleChanged && '_sprite' in this) {
            var sprite = this._sprite;
            sprite.Update(world, true);
        }
    };
    Transform.prototype.Reset = function () {
        this.position.Reset();
        this.size.Reset();
        this.correctedHash = -1;
        this._collisions = [];
        this.collisions = [];
    };
    Transform.prototype.ApplyVelocity = function (multiplier) {
        this._velocity.x = this.velocity.x;
        this._velocity.y = this.velocity.y;
        this.position.x += this._velocity.x * multiplier;
        this.position.y += this._velocity.y * multiplier;
    };
    Transform.prototype.AddCollision = function (collision) {
        this._collisions.push(collision);
        var found = false;
        var index = 0;
        while (!found && index < this.collisions.length) {
            found = this.collisions[index++].transform.id == collision.transform.id;
        }
        if (!found) {
            this.collisions.push(collision);
        }
    };
    Transform.prototype.DetectCollisions = function (world) {
        var _this = this;
        if (this instanceof Player) {
            world.immovables.forEach(function (id) {
                Transform.Detect(world, _this, id);
            });
        }
        else if (this instanceof Immovable) {
            world.movables.forEach(function (id) {
                Transform.Detect(world, _this, id);
            });
        }
        return this._collisions.length;
    };
    Transform.Detect = function (world, _this, id) {
        var that = world.gameObjects[id];
        var right;
        var left;
        var top;
        var bottom;
        // Check axis-aligned rectangle collision
        // If there was a valid collision
        if (that !== undefined &&
            _this.id != that.id && _this.collidable && that.collidable &&
            _this.position.x + (_this.size.x * world.scale) > that.position.x &&
            _this.position.y + (_this.size.y * world.scale) > that.position.y &&
            _this.position.x < that.position.x + (that.size.x * world.scale) &&
            _this.position.y < that.position.y + (that.size.y * world.scale)) {
            // console.log(
            //     '_this.position.x + (_this.size.x * world.scale) > that.position.x: ' +
            //     (_this.position.x + (_this.size.x * world.scale)) + ' > ' + that.position.x + '\n' +
            //     '_this.position.y + (_this.size.y * world.scale) > that.position.y: ' +
            //     (_this.position.y + (_this.size.y * world.scale)) + ' > ' + that.position.y + '\n' +
            //     '_this.position.x < that.position.x + (that.size.x * world.scale):  '  +
            //     _this.position.x + ' < ' + (that.position.x + (that.size.x * world.scale)) + '\n' +
            //     '_this.position.y < that.position.y + (that.size.y * world.scale):  '  +
            //     _this.position.y + ' < ' + (that.position.y + (that.size.y * world.scale)) + '\n'
            // );
            // Calculate depth of collision for each side
            right = (_this.position.x + (_this.size.x * world.scale)) - that.position.x;
            bottom = (_this.position.y + (_this.size.y * world.scale)) - that.position.y;
            left = (that.position.x + (that.size.x * world.scale)) - _this.position.x;
            top = (that.position.y + (that.size.y * world.scale)) - _this.position.y;
            // Determine on which side the collision is the most shallow
            // right and left
            if (right < left && right < top && right < bottom) {
                _this.AddCollision({ transform: that, side: Side.right });
                that.AddCollision({ transform: _this, side: Side.left });
            }
            // top and bottom
            else if (top < bottom && top < left) {
                _this.AddCollision({ transform: that, side: Side.top });
                that.AddCollision({ transform: _this, side: Side.bottom });
            }
        }
    };
    Transform.prototype.CorrectCollisions = function (world, hash) {
        var _this = this;
        if (_this.correctedHash != hash) {
            _this.correctedHash = hash;
            _this.collisions.forEach(function (collision) {
                collision.transform.CorrectRelativeTo(world, {
                    transform: _this,
                    side: Transform.oppositeSide[collision.side]
                });
                collision.transform.CorrectCollisions(world, hash);
            });
        }
    };
    Transform.prototype.CorrectRelativeTo = function (world, collision) {
        if (collision.side == Side.right) {
            this.position.x = collision.transform.position.x - (this.size.x * world.scale) - 0.01;
        }
        if (collision.side == Side.bottom) {
            this.position.y = collision.transform.position.y - (this.size.y * world.scale) - 0.01;
        }
        if (collision.side == Side.left) {
            this.position.x = collision.transform.position.x + (collision.transform.size.x * world.scale) + 0.01;
        }
        if (collision.side == Side.top) {
            this.position.y = collision.transform.position.y + (collision.transform.size.y * world.scale) + 0.01;
        }
    };
    Transform.oppositeSide = [Side.none, Side.top, Side.right, Side.bottom, Side.left];
    return Transform;
}());
