class Box extends Transform {
    GRAVITY: number = 5;
    RESISTANCE: number = 0.75;


    Init(world: World): void {
        this.velocity.x = 1000;
        this.velocity.y = 0;
        this.collidable = true;
    }

    Pre(world: World): void {
        this.velocity.y += (this.GRAVITY * world.deltaTime) / 10;
        this.element.html("");
    }

    Post(world: World): void {
        this.element.append(`<p>x: ${this.velocity.x.toFixed(2)}<br> y: ${this.velocity.y.toFixed(2)}`);
    }

    Collision(world: World): void {
        CollisionTypes.Box(world, this, this.collisions);
    }
}