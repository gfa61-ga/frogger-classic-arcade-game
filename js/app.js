// Enemies our player must avoid
let Enemy = function() {
    /* The image/sprite for our enemies, that uses
     * provided Resources object to easily load images
     */
    this.sprite = 'images/enemy-bug.png';

    /* Set initial x position of enemy to the point where it disappears,
     *  moving completely out of the right side of the canvas
     */
    this.x = 525;

    //Set initial y position of enemy out of canvas
    this.y = -103;

    // Enemy's velocity in CSS pixels / second
    this.velocity = 0;

    // The row where the enemy moves. Can take a random value between 1, 2 and 3
    this.row = 0;
};

/* Update the enemy's position, required method by game's Engine
 * Parameter: dt, the time delta between two successive game's frames, which is
 * calculated by the game's Engine
 */
Enemy.prototype.update = function(dt) {
    /* Calculate enemy's movement, by multiplying its velocity with the dt parameter,
     * which will ensure the game runs at the same speed for
     * all computers.
     */
    this.x += this.velocity * dt;

    // If the enemy disappears, moving completely out of the right side of the canvas,
    if (this.x >=  525) {
        // move the enemy completely out of the left side of the canvas
        this.x = -101;

        // and set a new random row
        this.row = this.randomInt(1, 3);
        this.y = -20 + 83 * this.row;

        // and a new random velocity for this enemy, between 125 px/sec and 475 px/sec
        this.velocity = this.randomInt(125, 475);
    }
};

// Draw the enemy on the screen, required method by game's Engine
Enemy.prototype.render = function() {
    // ctx (canvas' context) and Resources (image loading utility) are global objects
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Return a random integer, required by enemy's update method,
 * to get a random row and a random velocity
 * Parameter: min, the minimum integer required
 * Parameter: max, the maximum integer required
 */
Enemy.prototype.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
let Player = function() {
    /* TODO */
};

Player.prototype.update = function() {
    /* TODO */
};

Player.prototype.render = function() {
    /* TODO */
};

Player.prototype.handleInput = function() {
    /* TODO */
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [];
for (let index = 0; index < 3; index++) {
    allEnemies[index] = new Enemy();
}
let player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
