class Bird extends Transform {
    GRAVITY: number = 5;

    Init(world: World): void {
        this.size.x = 50;
        this.size.y = 50;
        this.collidable = true;
    }

    Pre(world: World): void {
        this.velocity.y += (this.GRAVITY * world.deltaTime) / 10;
    }

    Post(world: World): void {
    }

    Collision(world: World): void {
        CollisionTypes.Box(world, this, this.collisions);
    }
}