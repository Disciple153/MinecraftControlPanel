class Pipe extends Transform {
    private static speed: number = -200;
    private counted: boolean;


    Init(world: World): void {
        this.position.x = MAX_WIDTH;
        this.collidable = true;
        this.size.x = 100;
        this.counted = false;
        if (this.position.y == 0) {
            this.element.css("transform", "rotate(180deg) scaleX(-1)");
        }
    }

    Pre(world: World): void {
        this.velocity.x = Pipe.speed;
    }

    Post(world: World): void {
        // Check to see if the player scored a point
        if (!this.counted && world.player.position.x > this.position.x + this.size.x) {
            this.counted = true;
            Game.score += 0.5;
        }

        // If pipe has left frame, delete it from the world and remove it from the DOM.
        if (this.position.x + this.size.x < 0) {
            this.toDelete = true;
            this.collidable = false;
        }
    }

    Collision(world: World): void {
        this.collisions.forEach(function (collision : Collision) {
            if (collision.transform instanceof Bird) {
                Game.state = State.gameOver;
            }
        });
    }
}