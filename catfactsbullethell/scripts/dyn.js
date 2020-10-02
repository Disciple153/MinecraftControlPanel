// tsc dyn.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// *****************************************************************************
// CONSTANTS
// *****************************************************************************
var MAX_WIDTH = $(window).width() - 5;
var MAX_HEIGHT = $(window).height() - 5;
// *****************************************************************************
// ENUMS
// *****************************************************************************
var Side;
(function (Side) {
    Side[Side["none"] = 0] = "none";
    Side[Side["bottom"] = 1] = "bottom";
    Side[Side["left"] = 2] = "left";
    Side[Side["top"] = 3] = "top";
    Side[Side["right"] = 4] = "right";
})(Side || (Side = {}));
var State;
(function (State) {
    State[State["menu"] = 0] = "menu";
    State[State["play"] = 1] = "play";
    State[State["gameOver"] = 2] = "gameOver";
})(State || (State = {}));
// *****************************************************************************
// FUNCTIONS
// *****************************************************************************
var Game = /** @class */ (function () {
    function Game() {
    }
    /**
     * Waits for a certain number of milliseconds.
     * @param ms The number of milliseconds to wait.
     */
    Game.Delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    /**
     * Adds a Transform to the game
     * @param transformClass The name of the class of the transform to be added.
     * @param id The id to be assigned to the new Transform. If no ID is
     * supplied, one will be generated.
     */
    Game.AddTransform = function (transformClass, id) {
        if (id === void 0) { id = null; }
        var transform;
        if (id == null) {
            id = "Generated" + transformClass + Game.nextTransformID++;
        }
        // Create div in the body of the html document.
        // Place div so that is will not appear in the frame until it is
        // placed in the frame.
        $("#Game").append("\n        <div \n            id=\"" + id + "\" \n            class=\"GameObject " + transformClass + "\"\n            style=\"position: absolute; left: " + MAX_WIDTH + "px; top: " + MAX_HEIGHT + "px; width: 0; height: 0\">\n        </div>");
        transform = Transform.GetTransform($("#" + id)[0]);
        Game.world.gameObjects[id] = transform;
        Game.world.ids.push(id);
        if (Game.world.typeIDs[transformClass] == undefined) {
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
    };
    /**
     * This function is triggered any thime that a key is pressed.
     * @param key The key that was pressed.
     * @constructor
     */
    Game.KeyDown = function (key) {
        if (Game.state === State.play) {
            Game.world.player.KeyDown(key);
        }
    };
    Game.KeyUp = function (key) {
        if (Game.state === State.play) {
            Game.world.player.KeyUp(key);
        }
    };
    Game.MouseDown = function (x, y) {
        if (Game.state === State.play) {
            Game.world.player.MouseDown(Game.world, x, y);
        }
    };
    Game.MouseUp = function () {
        if (Game.state === State.play) {
            Game.world.player.MouseUp();
        }
    };
    Game.MouseMove = function (x, y) {
        if (Game.state === State.play) {
            Game.world.player.MouseMove(x, y);
        }
    };
    Game.Menu = function () {
        $('#Menu').show();
        Game.music = new Sound("assets/WeightoftheWorldtheEndofYoRHa.mp3", true);
        Game.html = $("#Game").html();
    };
    Game.Start = function () {
        $('#Menu').hide();
        $('#GameOver').hide();
        $('#HighScores').hide();
        Game.state = State.play;
        Game.Play().then();
    };
    /**
     * The main function that controls the game.
     * @constructor
     */
    Game.Play = function () {
        return __awaiter(this, void 0, void 0, function () {
            var newTime, i, id, index, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
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
                                "Bullet": [],
                                "Laser": [],
                                "CatFact": [],
                                "Ship": [],
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
                            }
                            else {
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
                        Game.world.player = Game.AddTransform("Ship", "player");
                        Game.world.player.position.x = MAX_WIDTH / 2;
                        Game.world.player.position.y = (7 * MAX_HEIGHT) / 8;
                        Game.world.player.Init(Game.world);
                        // Start Game
                        $("#Game").show();
                        _a.label = 1;
                    case 1:
                        if (!(Game.state == State.play)) return [3 /*break*/, 4];
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
                        for (i = 0; i < Game.world.ids.length; i++) {
                            id = Game.world.ids[i];
                            index = void 0;
                            if (Game.world.gameObjects[id].toDelete) {
                                // Remove object from DOM
                                Game.world.gameObjects[id].element.remove();
                                // Delete key from immovables array
                                index = Game.world.immovables.indexOf(id);
                                if (index !== -1)
                                    Game.world.immovables.splice(index, 1);
                                // Delete key from movables array
                                index = Game.world.movables.indexOf(id);
                                if (index !== -1)
                                    Game.world.movables.splice(index, 1);
                                // Delete key from specific class array
                                for (key in Game.world.typeIDs) {
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
                        if (!(Date.now() - Game.world.time <= 10)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Game.Delay(10)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 1];
                    case 4:
                        //$('#Game').hide();
                        Game.GameOver();
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.GameOver = function () {
        var highScore = parseInt(document.cookie);
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
        // Update high scores
        getHighScores('HighScores');
    };
    // *****************************************************************************
    // MAIN FUNCTION
    // *****************************************************************************
    Game.main = function () {
        Game.Menu();
    };
    Game.nextTransformID = 0;
    Game.score = 0;
    Game.state = State.menu;
    return Game;
}());
// *****************************************************************************
// CONTROLS
// *****************************************************************************
// These are deprecated, but there is no real alternative.
// noinspection JSDeprecatedSymbols
$(document).keydown(function (e) {
    Game.KeyDown(e.originalEvent.key);
});
// noinspection JSDeprecatedSymbols
$(document).keyup(function (e) {
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
