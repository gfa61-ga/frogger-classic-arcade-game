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

/* Update the enemy's position and check for collisions, required method by game's Engine
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
        this.x = -121;

        // and set a new random row
        this.row = this.randomInt(1, 3);
        this.y = -20 + 83 * this.row;

        // and a new random velocity for this enemy, between 125 px/sec and 475 px/sec
        this.velocity = this.randomInt(125, 475);
    }

    // If player is at the same row with this enemy
    if (player.row === this.row) {
        /* then check for collision
         * Player body's horizontal position is from pixel:34 to pixel:68 of player's image
         * Enemy body's horizontal position is from pixel 1 to 101 pixel of enemy's image
         */
        if (!(player.x + 34 > this.x + 101 || player.x + 68 < this.x + 1)) {
            player.reset('beatenByEneny');
        }
    }
};

// Draw the enemy on the screen, required method by game's Engine
Enemy.prototype.render = function() {
    // ctx (canvas' context) and Resources (image loading utility) are global objects
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Return a random integer, required by enemy's update method,
 * to get a random row and a random velocity
 * Also required by Rock.update() method
 * Parameter: min, the minimum integer required
 * Parameter: max, the maximum integer required
 */
Enemy.prototype.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// The player class
let Player = function() {
    // The image/sprite for our player
    this.sprite = 'images/char-pink-girl.png';

    /* The initial row where the player stays.
     *In game can take an integer value between 1 and 5
     */
    this.row = 5;

    /* The initial column where the player stays.
     * In game can take an integer value between 1 and 5
    */
    this.column = 3;

    // Set initial x position of the player
    this.x = 101 * (this.column - 1);

    // Set initial y position of the player
    this.y = 53 + (this.row - 1) * 83;
};

/* Update the player's position and check for rock collection,
 * required method by game's Engine
 */
Player.prototype.update = function() {
    this.x = 101 * (this.column - 1);
    this.y = 53 + (this.row - 1) * 83;

    // Check if the player collects a rock
    if (rock.row === this.row && rock.column === this.column) {
        rock.reset();
    }
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
            if (this.row > 0) {
                this.row--;
            }
            // Once the player reaches row 0 (the water) the round is won
            if (this.row === 0) {
                player.reset('win');
            }
            break;
        case 'down':
            if (this.row < 5) {
                this.row++;
            }
    }
};

/* Reset player position, required method by Player.handleInput() and Enemy.update() methods
 * Parameter: position, can take a String value between 'beatenByEneny' and 'win'
 */
Player.prototype.reset = function(position) {
    player.row = 5;
    if (position === 'beatenByEneny') {
        player.column = 4;
    } else if (position === 'win') {
        player.column = 3;
    }
}

// The scorePanel class
let ScorePanel = function() {
    this.players = '1/3';
    this.score = '0000';
    this.timer = '1:00';
    this.topScore = '9999';
}

// Draw the scorePanel on the screen, required method by game's Engine
ScorePanel.prototype.render = function() {
        ctx.font = '34px sans-serif';
        ctx.fillStyle = '#b4dae8';
        ctx.fillText(this.players, 26, 100);
        ctx.fillText(this.score, 213, 100);
        ctx.fillText(this.timer, 419, 100);

        ctx.fillStyle = '#dd6bc9';
        ctx.font = '26px sans-serif';
        ctx.fillText('Top score:   ', 26, 575);
        ctx.font = '32px sans-serif';
        ctx.fillText(this.topScore, 216, 575);
}

// The rock class
let Rock = function() {
    // The image/sprite for rock
    this.sprite = 'images/Rock.png';

    this.row = 0;
    this.column = 0;

    //Set initial y position of rock out of canvas
    this.x = -103;
    this.y = -103;
}

/* Randomly update rock's position, after random seconds
 * method required by Rock.reset() method and to initiate the first rock instance
 */
Rock.prototype.update = function() {
    // Locate rock in a random position
    const randomlyLocateRock = function() {
        this.row = Enemy.prototype.randomInt(1, 2);
        this.column = Enemy.prototype.randomInt(1, 5);
        this.x = 101 * (this.column - 1);
        this.y = 53 + (this.row - 1) * 83;
    };

    // Locate the rock after random rockEmergeSeconds
    const rockEmergeSeconds = Enemy.prototype.randomInt(4, 10);
    setTimeout(randomlyLocateRock.bind(this), rockEmergeSeconds * 1000);
}

// Draw the rock on the screen, required method by game's Engine
Rock.prototype.render = function() {
    // Same as the Enemy.render() method
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Reset the rock, required method by Player.update() method
Rock.prototype.reset = function() {
    this.row = 0;
    this.column = 0;
    this.x = -103;
    this.y = -103;

    // update rock's random position
    this.update();
}

/* Instantiate game's objects: three enemies, one player, one scorePanel and one rock
 * Place all enemy objects in the array called allEnemies
 * Place the player object in the variable called player
 */
let allEnemies = [];
for (let index = 0; index < 3; index++) {
    allEnemies[index] = new Enemy();
}
let player = new Player();
let scorePanel = new ScorePanel();

let rock = new Rock();
// to be called when the timer starts            /* TODO */
rock.update();

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

/* Listen for ArrowPanel clicks and send moveDirection to
 * Player.handleInput() method
 * The ArrowPanel is rendered by the game's engine
 */
document.addEventListener('click', function(e) {
    // Shrink factor of flex-container width
    const widthFix = 505 / ctx.canvas.offsetWidth;

    // Shrink factor of flex-container height
    const heightFix = 606 / ctx.canvas.offsetHeight;

    //Fix X offset of click location
    const clickX = Math.round(e.offsetX * widthFix);

    //Fix X offset of click location
    const clickY = Math.round(e.offsetY * heightFix);

    let moveDirection;

    /* Check if click point is inside a rectangle area
     * Parameters: xs, ys, coordinates of rectangle's upper left corner
     * Parameters: xe, ye, coordinates of of rectangle's lower right corner
     * Parameters: xp, yp, coordinates of click location
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
