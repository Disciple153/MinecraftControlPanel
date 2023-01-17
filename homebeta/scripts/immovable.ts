class Immovable extends Transform {
    originalPosition: Vector;

    constructor(element: HTMLElement = null, posX: number = 0, posY: number = 0, sizeX: number = 0, sizeY: number = 0, id: string = "") {
        super(null, id);

        this.position = new Vector(posX, posY);
        this.size = new Vector(sizeX, sizeY);
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.collidable = true;
    }

    Init(world: World): void {}

    Pre(world: World): void {
    }
    Post(world: World): void {
    }
    Collision(world: World): void {}

    // Do not move under any circumstance
    CorrectRelativeTo(world: World, collision: Collision): void {}

}