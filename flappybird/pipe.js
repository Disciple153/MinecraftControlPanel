var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Pipe = /** @class */ (function (_super) {
    __extends(Pipe, _super);
    function Pipe() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Pipe.prototype.Init = function (world) {
        this.position.x = MAX_WIDTH;
        this.collidable = true;
        this.size.x = 100;
        this.counted = false;
        if (this.position.y == 0) {
            this.element.css("transform", "rotate(180deg) scaleX(-1)");
        }
    };
    Pipe.prototype.Pre = function (world) {
        this.velocity.x = Pipe.speed;
    };
    Pipe.prototype.Post = function (world) {
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
    };
    Pipe.prototype.Collision = function (world) {
        this.collisions.forEach(function (collision) {
            if (collision.transform instanceof Bird) {
                Game.state = State.gameOver;
            }
        });
    };
    Pipe.speed = -200;
    return Pipe;
}(Transform));
