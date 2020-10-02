class Laser extends Transform {
    SPEED: number = 1000;
    OFFSET: number = 25;

    public width = 3;
    public height = 35;

    private _direction: number;
    private _normalV: Vector;

    Init(world: World, direction: number = 0, origin: Vector = new Vector(0, 0)): void {
        this.size.x = this.width;
        this.size.y = this.height;

        this.velocity.x = Math.sin(direction * (Math.PI / 180));
        this.velocity.y = -Math.cos(direction * (Math.PI / 180));

        this._normalV = new Vector(this.velocity.x, this.velocity.y);

        this.position.x = origin.x + (this.velocity.x * this.OFFSET) - (this.size.x / 2);
        this.position.y = origin.y + (this.velocity.y * this.OFFSET) - (this.size.y / 2);

        this.velocity.x *= this.SPEED;
        this.velocity.y *= this.SPEED;

        this._direction = direction;

        this.element.css({'transform' : 'rotate('+ direction +'deg)'});

        this.collidable = true;
    }

    Pre(world: World): void {
    }

    Post(world: World): void {
    }

    Collision(world: World): void {
        let _this = this;
        let pos: Vector;

        this.collisions.forEach(function (collision) {
            if (collision.transform instanceof Immovable ||
                collision.transform instanceof CatFact) {
                _this.toDelete = true;
            }

            if (collision.transform instanceof CatFact) {
                pos =  new Vector(_this.position.x + (_this.size.x / 2),
                    _this.position.y + (_this.size.y / 2));

                pos.x += _this._normalV.x * (_this.height / 2);
                pos.y += _this._normalV.y * (_this.height / 2);

                let effect: Effect = <Effect> Game.AddTransform("Effect");
                effect.Init(world, "hit", pos, _this._direction, 6);
            }
        });
    }
}