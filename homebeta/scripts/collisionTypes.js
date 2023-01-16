var CollisionTypes = /** @class */ (function () {
    function CollisionTypes() {
    }
    CollisionTypes.Box = function (world, transform, collisions) {
        var newVelocity = new Vector();
        var xChange = false;
        var yChange = false;
        collisions.forEach(function (collision) {
            if (collision.transform instanceof Immovable) {
                if (collision.side == Side.left) {
                    newVelocity.x = Math.abs(transform._velocity.x) * transform.RESISTANCE;
                    xChange = true;
                }
                else if (collision.side == Side.right) {
                    newVelocity.x = -Math.abs(transform._velocity.x) * transform.RESISTANCE;
                    xChange = true;
                }
                if (collision.side == Side.top) {
                    newVelocity.y = Math.abs(transform._velocity.y) * transform.RESISTANCE;
                    yChange = true;
                }
                else if (collision.side == Side.bottom) {
                    newVelocity.y = -Math.abs(transform._velocity.y) * transform.RESISTANCE;
                    yChange = true;
                }
            }
            else {
                if (collision.side == Side.right || collision.side == Side.left) {
                    newVelocity.x = collision.transform._velocity.x * transform.RESISTANCE;
                    xChange = true;
                }
                if (collision.side == Side.top || collision.side == Side.bottom) {
                    newVelocity.y = collision.transform._velocity.y * transform.RESISTANCE;
                    yChange = true;
                }
            }
        });
        if (xChange) {
            transform.velocity.x = newVelocity.x;
        }
        if (yChange) {
            transform.velocity.y = newVelocity.y;
        }
    };
    return CollisionTypes;
}());
