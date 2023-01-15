// tsc dyn.ts


// *****************************************************************************
// CONSTANTS
// *****************************************************************************
const MAX_WIDTH = $(window).width() - 5;
const MAX_HEIGHT = $(window).height() - 5;
const NEW_PIPE_INCREMENT: number = 2250;
const PIPE_GAP: number = 250;

// *****************************************************************************
// ENUMS
// *****************************************************************************

enum Side {
    none,
    bottom,
    left,
    top,
    right
}

enum State {
    menu,
    play,
    gameOver
}

// *****************************************************************************
// INTERFACES
// *****************************************************************************

interface GameObjects {
    [key: string]: Transform;
}

interface World {
    gameObjects: GameObjects;
    ids: string[];
    immovables: string[];
    movables: string[];
    time: number;
    deltaTime: number;
    vMultiplier: number;
    player: Bird;
}

interface Collision {
    transform: Transform;
    side: Side;
}

// *****************************************************************************
// FUNCTIONS
// *****************************************************************************
class Game {
    private static nextTransformID: number = 0;
    private static world: World;
    private static player: Bird;
    public static score: number = 0;
    public static state: State = State.menu;

    static Delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static AddTransform(transformClass: string, id: string = null): Transform {
        let transform: Transform;

        if (id == null) {
            id = `Generated${transformClass}${Game.nextTransformID++}`;
        }

        // Create div in the body of the html document.
        // Place div so that is will not appear in the frame until it is
        // placed in the frame.
        $("body").append(`
        <div 
            id="${id}" 
            class="GameObject ${transformClass}"
            style="position: absolute; left: ${MAX_WIDTH}px; top: ${MAX_HEIGHT}px; width: 0; height: 0">
        </div>`);

        transform = Transform.GetTransform($("#" + id)[0]);
        Game.world.gameObjects[id] = transform;

        Game.world.ids.push(id);

        if (transform instanceof Immovable) {
            Game.world.immovables.push(id);
        }
        else {
            Game.world.movables.push(id);
        }

        return transform;
    }

    static KeyDown(key : string): void {
        switch (Game.state) {
            case State.menu:
                if (key == " ") {
                    Game.state = State.play;
                    Game.Play();
                }
                break;
            case State.play:
                if (key == " ") {
                    Game.world.player.velocity.y -= 500;
                }
                break;


            case State.gameOver:
                if (key == " ") {
                    Game.state = State.play;
                    Game.Play();
                }
                break;
        }
    }

    static Menu() {
        $("body").html(`<h1>Press the spacebar to play!<h1>`);
    }

    static async Play() {
        let newTime: number;
        let newPipe: Pipe;
        let newPipePos: number;
        let newPipeCountdown: number = 0;

        Game.score = 0;

        // Clear and initialize data;
        Game.world = undefined;
        $("body").html(`<br><h1 id="scoreboard"></h1>`);

        Game.world = {
            gameObjects: {},
            ids: [],
            immovables: [],
            movables: [],
            time: Date.now(),
            deltaTime: 0,
            vMultiplier: 0,
            player: Game.player
        };

        // Create collision for the screen
        Game.world.gameObjects["topBorder"] = new Immovable(null, 0, -1000, MAX_WIDTH, 1000, "topBorder");
        Game.world.gameObjects["bottomBorder"] = new Immovable(null, 0, MAX_HEIGHT, MAX_WIDTH, 1000, "bottomBorder");
        //Game.world.gameObjects["leftBorder"] = new Immovable(null, -1000, 0, 1000, MAX_HEIGHT, "leftBorder");
        //Game.world.gameObjects["rightBorder"] = new Immovable(null, MAX_WIDTH, 0, 1000, MAX_HEIGHT, "rightBorder");

        // Get all gameObjects and put them in a dictionary as transforms.
        Array.from($(".GameObject")).forEach(function (value) {
            Game.world.gameObjects[value.id] = Transform.GetTransform(value);
        });

        // Get all keys.
        Game.world.ids = Object.keys(Game.world.gameObjects);

        // Get lists of movable and immovable GameObjects.
        Game.world.ids.forEach(function (id) {
            if (Game.world.gameObjects[id] instanceof Immovable) {
                Game.world.immovables.push(id);
            } else {
                Game.world.movables.push(id);
            }
        });

        // Run all Init functions.
        Game.world.ids.forEach(function (id) {
            Game.world.gameObjects[id].Init(Game.world);
        });

        // Add transforms via code.
        Game.world.player = <Bird> Game.AddTransform("Bird", "player");
        Game.world.player.position.x = MAX_WIDTH / 4;
        Game.world.player.position.y = MAX_HEIGHT / 4;
        Game.world.player.Init(Game.world);

        while (Game.state == State.play) {
            // Update time
            newTime = Date.now();
            Game.world.deltaTime = newTime - Game.world.time;

            if (Game.world.deltaTime > 100) {
                Game.world.deltaTime = 100;
            }

            Game.world.time = newTime;
            Game.world.vMultiplier = Game.world.deltaTime / 1000;

            // Determine whether to add new pipes, and add them.
            newPipeCountdown += Game.world.deltaTime;
            if (newPipeCountdown > NEW_PIPE_INCREMENT) {
                newPipeCountdown -= NEW_PIPE_INCREMENT;
                newPipePos = Math.floor(Math.random() * (MAX_HEIGHT - PIPE_GAP));

                // Top pipe
                newPipe = <Pipe> Game.AddTransform("Pipe");
                newPipe.position.y = 0;
                newPipe.size.y = newPipePos;
                newPipe.Init(Game.world);

                // Bottom pipe
                newPipe = <Pipe> Game.AddTransform("Pipe");
                newPipe.position.y = newPipePos + PIPE_GAP;
                newPipe.size.y = MAX_HEIGHT - (newPipe.position.y);
                newPipe.Init(Game.world);
            }


            // Run all pre functions.
            Game.world.ids.forEach(function (id) {
                Game.world.gameObjects[id].Pre(Game.world);
            });

            // Update all transforms.
            Game.world.ids.forEach(function (id) {
                Game.world.gameObjects[id].ApplyVelocity(Game.world.vMultiplier);
            });

            // Detect collisions
            Game.world.ids.forEach(function (id) {
                Game.world.gameObjects[id].DetectCollisions(Game.world);
            });

            // Correct collisions for GameObjects colliding with Immovables
            Game.world.immovables.forEach(function (id, hash) {
                Game.world.gameObjects[id].CorrectCollisions(hash);

                // Detect collisions
                Game.world.ids.forEach(function (id) {
                    Game.world.gameObjects[id].DetectCollisions(Game.world);
                });
            });

            // Correct collisions for GameObjects colliding with movables
            Game.world.movables.forEach(function (id, hash) {
                Game.world.gameObjects[id].CorrectCollisions(hash + Game.world.immovables.length);
            });

            // React to collisions
            Game.world.ids.forEach(function (id) {
                Game.world.gameObjects[id].Collision(Game.world);
            });

            // Run all post functions.
            Game.world.ids.forEach(function (id) {
                Game.world.gameObjects[id].Post(Game.world);
            });

            // Update all positions.
            Game.world.ids.forEach(function (id) {
                Game.world.gameObjects[id].SetTransform();
                Game.world.gameObjects[id].Reset();
            });

            // Check to see if any GameObjects are scheduled to be deleted, and delete them.
            for (let i = 0; i < Game.world.ids.length; i++) {
                let id: string = Game.world.ids[i];
                let index: number;

                if (Game.world.gameObjects[id].toDelete) {

                    // Remove object from DOM
                    Game.world.gameObjects[id].element.remove();

                    // Delete transfrom from world
                    delete Game.world.gameObjects[id];

                    // delete key from immovables array
                    index = Game.world.immovables.indexOf(id);
                    if (index !== -1) Game.world.immovables.splice(index, 1);

                    // delete key from movables array
                    index = Game.world.movables.indexOf(id);
                    if (index !== -1) Game.world.movables.splice(index, 1);

                    // delete key from ids array
                    Game.world.ids.splice(i, 1);
                    i--;
                }
            }

            // Update scoreboard
            $("#scoreboard").html("Score: " + Game.score);

            // Limit to 100 fps
            if (Date.now() - Game.world.time <= 10) {
                await Game.Delay(10);
            }
        }

        Game.GameOver();
    }

    static GameOver() {
        $("#scoreboard").html(`
        Game Over <br>
        Score: ${Game.score}<br>
        Press the spacebar to play again!`);
    }


// *****************************************************************************
// MAIN FUNCTION
// *****************************************************************************
    static main() {

        Game.Menu();
    }
}

// *****************************************************************************
// CONTROLS
// *****************************************************************************
// This is deprecated, but there is no real alternative.
$(document).keydown(function(e) {
    Game.KeyDown(e.originalEvent.key);
});

$(document).click(function () {
    Game.KeyDown(" ");
});

/*

Dynamic JS Project

Create a site with dynamic content. It needs to use JavaScript to edit and/or 
    alter the content of the page based on user interaction. Again, the 
    requirements are loose so you are free to be creative, but the work needs to
    be significant. Ideas for the site: a game, visualization of data, 
    interactive infographic, etc.

   ~ The content of the page needs to be modifiable via JavaScript.
   ~ It must use an animation
   ~ It must take user input
   ~ You may use third-party libraries.
   ~ The project must have a clear, consistent theme.
   ~ Upload your project to the 304 server and put the files in public_html/dyn

Look at this page (http://jorr.cs.georgefox.edu/courses/csis304-web-programming/resources/ssh.html) 
    for instructions on how to connect to the server and transfer files. 

*/