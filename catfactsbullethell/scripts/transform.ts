/**
 * Transform
 * Defines an object's position, size and velocity along with other key information.
 */
class Transform {
    public GRAVITY: number = 0;
    public RESISTANCE: number = 0;

    public _velocity: Vector;   // Read
    public velocity: Vector;    // Write
    public toDelete: boolean = false;

    public static oppositeSide = [Side.none, Side.top, Side.right, Side.bottom, Side.left];

    // Protected variables
    private _collisions: Collision[] = [];
    protected collisions: Collision[] = [];
    private correctedHash: number;

    // Readonly variables
    public readonly element: JQuery;
    public readonly id;

    // Public variables
    public position: Vector;
    public size: Vector;
    public collidable: boolean = false;

    // Blueprints
    public Init(world: World): void {};
    public Pre(world: World): void {};
    public Post(world: World): void {};
    public Collision(world: World): void {};

    // Constructor
    constructor(element: JQuery, id: string = "") {
        this._velocity = new Vector();
        this.velocity = new Vector();
        this.element = element;

        if (element != null)
        {
            this.id = element.attr("id");
        }
        else
        {
            this.id = id;
        }
    }

    // Static functions
    static GetTransform(element: HTMLElement): Transform {
        let jElement: JQuery = $(element);
        let transform: Transform;
        let classes: string[] = jElement.attr("class").split(/\s+/);

        if (classes.length > 2) {
            console.error(`Error on element: ${jElement.attr("id")}
                : GameObjects may belong to only one class.`);
        }

        for (let i = 0; i < classes.length; i++) {
            if (classes[i] != "GameObject") {
                transform = new window[classes[i]](jElement);
            }
        }

        transform.position = new Vector(
            parseInt(jElement.css("left")),
            parseInt(jElement.css("top")));

        transform.size = new Vector(
            parseInt(jElement.css("width")),
            parseInt(jElement.css("height")));

        return transform;
    }

    // Functions
    SetTransform(): void {
        if (this.element != null &&
            (this.position.xChanged || this.position.yChanged
                || this.size.xChanged || this.size.yChanged)) {
            if (this.position.xChanged)
                this.element.css("left", this.position.x);

            if (this.position.yChanged)
                this.element.css("top", this.position.y);

            if (this.size.xChanged)
                this.element.css("width", this.size.x);

            if (this.size.yChanged)
                this.element.css("height", this.size.y);
        }
    }

    Reset(): void {
        this.position.Reset();
        this.size.Reset();

        this.correctedHash = -1;
        this._collisions = [];
        this.collisions = [];
    }

    ApplyVelocity(multiplier: number): void {
        this._velocity.x = this.velocity.x;
        this._velocity.y = this.velocity.y;

        this.position.x += this._velocity.x * multiplier;
        this.position.y += this._velocity.y * multiplier;
    }

    AddCollision(collision: Collision): void {
        this._collisions.push(collision);

        let found: boolean = false;
        let index = 0;
        while (!found && index < this.collisions.length) {
            found = this.collisions[index++].transform.id == collision.transform.id;
        }

        if (!found) {
            this.collisions.push(collision);
        }
    }

    DetectCollisions(world: World): number {
        let _this: Transform = this;

        if (this instanceof Bullet) {
            world.typeIDs["Ship"].forEach(function (id) {
                Transform.Detect(world, _this, id);
            });

            world.immovables.forEach(function (id) {
                Transform.Detect(world, _this, id);
            });
        }
        else if (this instanceof Laser) {
            world.typeIDs["CatFact"].forEach(function (id) {
                Transform.Detect(world, _this, id);
            });

            world.immovables.forEach(function (id) {
                Transform.Detect(world, _this, id);
            });
        }
        else if (this instanceof CatFact) {
            world.typeIDs["Laser"].forEach(function (id) {
                Transform.Detect(world, _this, id);
            });
            world.typeIDs["Ship"].forEach(function (id) {
                Transform.Detect(world, _this, id);
            });

            world.immovables.forEach(function (id) {
                Transform.Detect(world, _this, id);
            });
        }
        else if (this instanceof Ship) {
            world.typeIDs["Bullet"].forEach(function (id) {
                Transform.Detect(world, _this, id);
            });
            world.typeIDs["CatFact"].forEach(function (id) {
                Transform.Detect(world, _this, id);
            });

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
    }

    private static Detect(world: World, _this: Transform, id: string) {
        let that = world.gameObjects[id];
        let right: number;
        let left: number;
        let top: number;
        let bottom: number;

        // Check axis-aligned rectangle collision
        // If there was a valid collision
        if (that !== undefined &&
            _this.id != that.id && _this.collidable && that.collidable &&
            _this.position.x + _this.size.x > that.position.x &&
            _this.position.y + _this.size.y > that.position.y &&
            _this.position.x < that.position.x + that.size.x &&
            _this.position.y < that.position.y + that.size.y) {

            // Calculate depth of collision for each side
            right = (_this.position.x + _this.size.x) - that.position.x;
            bottom = (_this.position.y + _this.size.y) - that.position.y;
            left = (that.position.x + that.size.x) - _this.position.x;
            top = (that.position.y + that.size.y) - _this.position.y;

            // Determine on which side the collision is the most shallow
            // right and left
            if (right < left && right < top && right < bottom) {
                _this.AddCollision({transform: that, side: Side.right});
                that.AddCollision({transform: _this, side: Side.left});
            }
            // top and bottom
            else if (top < bottom && top < left) {
                _this.AddCollision({transform: that, side: Side.top});
                that.AddCollision({transform: _this, side: Side.bottom});
            }
        }
    }

    CorrectCollisions(hash: number): void {
        let _this = this;

        if (_this.correctedHash != hash) {
            _this.correctedHash = hash;

            _this.collisions.forEach(function (collision: Collision) {
                collision.transform.CorrectRelativeTo({
                    transform: _this,
                    side: Transform.oppositeSide[collision.side]
                });

                collision.transform.CorrectCollisions(hash);
            });
        }
    }

    CorrectRelativeTo(collision: Collision): void {
        if (collision.side == Side.right) {
            this.position.x = collision.transform.position.x - this.size.x - 0.01;
        }
        if (collision.side == Side.bottom) {
            this.position.y = collision.transform.position.y - this.size.y - 0.01;
        }
        if (collision.side == Side.left) {
            this.position.x = collision.transform.position.x + collision.transform.size.x + 0.01;
        }
        if (collision.side == Side.top) {
            this.position.y = collision.transform.position.y + collision.transform.size.y + 0.01;
        }
    }
}