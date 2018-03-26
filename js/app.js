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

    /* TODO: Handle collision with the Player */

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

// The player class
let Player = function() {
    // The image/sprite for our player
    this.sprite = 'images/char-boy.png';

    // The row where the player starts. In game can take an integer value between 1 and 5
    this.row = 5;

    // The column where the player stays. In game can take an integer value between 1 and 5
    this.column = 3;

    // Set initial x position of the player
    this.x = 101 * (this.column - 1);

    // Set initial y position of the player
    this.y = 53 + (this.row - 1) * 83;
};

// Update the player's position, required method by game's Engine
Player.prototype.update = function() {
    this.x = 101 * (this.column - 1);
    this.y = 53 + (this.row - 1) * 83;
};

// Draw the player on the screen, required method by game's Engine
Player.prototype.render = function() {
    // Same as the Enemy.render() method
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Handle user input to properly move the player
 * Parameter: moveDirection, takes a String value
 * between 'left', 'right', 'up' and 'down'
 */
Player.prototype.handleInput = function(moveDirection) {
    switch(moveDirection) {
        /* When moving left - right
         * check that column number is a value between 1 and 5
         */
        case 'left':
            if (this.column > 1) {
                this.column--;
            }
            break;
        case 'right':
            if (this.column < 5) {
                this.column++;
            }
            break;

        /* When moving up - down
         * check that row number is a value between 1 and 5
         */
        case 'up':
            if (this.row > 1) {
                this.row--;
            }
            break;
        case 'down':
            if (this.row < 5) {
                this.row++;
            }
    }
};

/* Instantiate game's objects: three enemies and one player
 * Place all enemy objects in the array called allEnemies
 * Place the player object in the variable called player
 */
let allEnemies = [];
for (let index = 0; index < 3; index++) {
    allEnemies[index] = new Enemy();
}
let player = new Player();

/* Listen for key presses and send the keys to
 * Player.handleInput() method.
 */
document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/* Listen for click presses and send moveDirection to
 * Player.handleInput() method.
 */
document.addEventListener('click', function(e) {
    // Shrink factor of flex-container width
    const widthFix = 505 / ctx.canvas.offsetWidth;

    // Shrink factor of flex-container height
    const heightFix = 606 / ctx.canvas.offsetHeight;

    //Fix X offset of click
    const clickX = Math.round(e.offsetX * widthFix);

    //Fix X offset of click
    const clickY = Math.round(e.offsetY * heightFix);

    let moveDirection;

    /* Check if click point is inside a rectangle area
     * Parameters: xs, ys, coordinates of rectangle's upper left corner
     * Parameters: xe, ye, coordinates of of rectangle's lower right corner
     * Parameters: xp, yp, coordinates of click position
     */
    function checkPointInRectangle(xs, ys, xe, ye, xp, yp) {
        if (xs < xp && xp < xe && ys < yp && yp < ye) {
            return true;
        } else {
            return false;
        }
    }

    if (checkPointInRectangle(379, 382, 429, 440, clickX, clickY)) {
        moveDirection = 'up';
    } else if (checkPointInRectangle(379, 490, 429, 548, clickX, clickY)) {
        moveDirection = 'down';
    } else if (checkPointInRectangle(303, 440, 379, 490, clickX, clickY)) {
        moveDirection = 'left';
    } else if (checkPointInRectangle(429, 440, 505, 490, clickX, clickY)) {
        moveDirection = 'right';
    }

    player.handleInput(moveDirection);
});