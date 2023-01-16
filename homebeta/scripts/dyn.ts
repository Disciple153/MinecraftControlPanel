// tsc dyn.ts

// *****************************************************************************
// CONSTANTS
// *****************************************************************************

let MAX_WIDTH = $(window).width() - 5;
let MAX_HEIGHT = $(window).height() - 5;

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
    player: Player;
    typeIDs: {};
}

interface Collision {
    transform: Transform;
    side: Side;
}

interface Control {
    up: boolean;
    left: boolean;
    down: boolean;
    right: boolean;
    fire: boolean;
    mouseX: number;
    mouseY: number;
}

// *****************************************************************************
// FUNCTIONS
// *****************************************************************************
class Game {
    private static nextTransformID: number = 0;
    private static world: World;
    private static player: Player;
    public static score: number = 0;
    public static state: State = State.menu;
    public static music: Sound;
    public static html: string;

    /**
     * Waits for a certain number of milliseconds.
     * @param ms The number of milliseconds to wait.
     */
    static Delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Adds a Transform to the game
     * @param transformClass The name of the class of the transform to be added.
     * @param id The id to be assigned to the new Transform. If no ID is
     * supplied, one will be generated.
     */
    static AddTransform(transformClass: string, id: string = null): Transform {
        let transform: Transform;

        if (id == null) {
            id = `Generated${transformClass}${Game.nextTransformID++}`;
        }

        // Create div in the body of the html document.
        // Place div so that is will not appear in the frame until it is
        // placed in the frame.
        $("#Game").append(`
        <div 
            id="${id}" 
            class="GameObject ${transformClass}"
            style="position: absolute; left: ${MAX_WIDTH}px; top: ${MAX_HEIGHT}px; width: 0; height: 0">
        </div>`);

        transform = Transform.GetTransform($("#" + id)[0]);
        Game.world.gameObjects[id] = transform;

        Game.world.ids.push(id);

        if (Game.world.typeIDs[transformClass] == undefined)
        {
            Game.world.typeIDs[transformClass] = [];
        }

        Game.world.typeIDs[transformClass].push(id);

        if (transform instanceof Immovable) {
            Game.world.immovables.push(id);
        }
        else {
            Game.world.movables.push(id);
        }

        return transform;
    }

    /**
     * This function is triggered any thime that a key is pressed.
     * @param key The key that was pressed.
     * @constructor
     */
    static KeyDown(key : string): void {
        if (Game.state === State.play) {
            Game.world.player.KeyDown(key);
        }
    }

    static KeyUp(key: string): void {
        if (Game.state === State.play) {
            Game.world.player.KeyUp(key);
        }
    }

    static MouseDown(x: number, y: number) {
        if (Game.state === State.play) {
            Game.world.player.MouseDown(Game.world, x, y);
        }
    }

    static MouseUp() {
        if (Game.state === State.play) {
            Game.world.player.MouseUp();
        }
    }

    static MouseMove(x: number, y: number) {
        if (Game.state === State.play) {
            Game.world.player.MouseMove(x, y);
        }
    }


    static Menu() {
        $('#Menu').show();
    }
    
    static Start() {
        Game.music = new Sound("assets/WeightoftheWorldtheEndofYoRHa.mp3", true);
        Game.html = $("#Game").html();
        Game.state = State.play;
        Game.Play().then();
    }

    /**
     * The main function that controls the game.
     * @constructor
     */
    static async Play() {
        let newTime: number;
        MAX_WIDTH = $(window).width() - 5;
        MAX_HEIGHT = $(window).height() - 5;

        Game.music.Play();

        $("#Game").html(Game.html);

        $("#Score").html("" + 0);

        // initialize data;
        Game.world = {
            gameObjects: {},
            ids: [],
            immovables: [],
            movables: [],
            time: Date.now(),
            deltaTime: 0,
            vMultiplier: 0,
            player: Game.player,
            typeIDs: {
                "Player": [],
                "Immovable": []
            }
        };

        // Create collision for the screen
        Game.world.gameObjects["topBorder"] = new Immovable(null, 0, -1000, MAX_WIDTH, 1000, "topBorder");
        Game.world.gameObjects["bottomBorder"] = new Immovable(null, 0, MAX_HEIGHT, MAX_WIDTH, 1000, "bottomBorder");
        Game.world.gameObjects["leftBorder"] = new Immovable(null, -1000, 0, 1000, MAX_HEIGHT, "leftBorder");
        Game.world.gameObjects["rightBorder"] = new Immovable(null, MAX_WIDTH, 0, 1000, MAX_HEIGHT, "rightBorder");

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

        ////////////////////////////////////////////////////////////////////////
        // ADD TRANSFORMS VIA CODE
        ////////////////////////////////////////////////////////////////////////
        Game.world.player = <Player> Game.AddTransform("Player", "player");
        Game.world.player.position.x = MAX_WIDTH / 2;
        Game.world.player.position.y = (7 * MAX_HEIGHT) / 8;
        Game.world.player.Init(Game.world);

        // Start Game
        $("#Game").show();

        while (Game.state == State.play) {
            // Update time
            newTime = Date.now();
            Game.world.deltaTime = newTime - Game.world.time;

            if (Game.world.deltaTime > 100) {
                Game.world.deltaTime = 100;
            }

            Game.world.time = newTime;
            Game.world.vMultiplier = Game.world.deltaTime / 1000;


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

                    // Delete key from immovables array
                    index = Game.world.immovables.indexOf(id);
                    if (index !== -1) Game.world.immovables.splice(index, 1);

                    // Delete key from movables array
                    index = Game.world.movables.indexOf(id);
                    if (index !== -1) Game.world.movables.splice(index, 1);

                    // Delete key from specific class array
                    for (let key in Game.world.typeIDs) {

                        // Check if this is the correct array to delete from
                        if (Game.world.gameObjects[id].constructor.name == key) {
                            index = Game.world.typeIDs[key].indexOf(id);

                            // If the key is in the array, delete it.
                            if (index !== -1) {
                                Game.world.typeIDs[key].splice(index, 1);
                            }
                        }
                    }

                    // Delete key from ids array
                    Game.world.ids.splice(i, 1);

                    // Delete transfrom from world
                    delete Game.world.gameObjects[id];

                    i--;
                }
            }

            ////////////////////////////////////////////////////////////////////
            // UPDATE SCOREBOARD
            ////////////////////////////////////////////////////////////////////
            $("#scoreboard").html("Score: " + Game.score);

            // Limit to 100 fps
            if (Date.now() - Game.world.time <= 10) {
                await Game.Delay(10);
            }
        }

        //$('#Game').hide();
        Game.GameOver();
    }

    static GameOver() {
        let highScore = parseInt(document.cookie);

        if (isNaN(highScore)) {
            highScore = 0;
            document.cookie = "" + 0;
        }

        // Check High score
        if (Game.world.player.points > highScore) {
            highScore = Game.world.player.points;
            document.cookie = "" + highScore;
        }

        Game.music.Stop();

        $("#HighScore").html("" + highScore);
        $("#ThisScore").html("" + Game.world.player.points);

        $("#GameOver").show();
    }


// *****************************************************************************
// MAIN FUNCTION
// *****************************************************************************
    static main() {
        Game.Start();
    }
}

// *****************************************************************************
// CONTROLS
// *****************************************************************************
// These are deprecated, but there is no real alternative.
// noinspection JSDeprecatedSymbols
$(document).keydown(function(e) {
    Game.KeyDown(e.originalEvent.key);
});

// noinspection JSDeprecatedSymbols
$(document).keyup(function(e) {
    Game.KeyUp(e.originalEvent.key);
});

// noinspection JSDeprecatedSymbols
$(document).mousedown(function (e) {
    Game.MouseDown(e.originalEvent.clientX, e.originalEvent.clientY);
});

// noinspection JSDeprecatedSymbols
$(document).mouseup(function () {
    Game.MouseUp();
});

// noinspection JSDeprecatedSymbols
$(document).mousemove(function (e) {
    Game.MouseMove(e.originalEvent.clientX, e.originalEvent.clientY);
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