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

/* Update the enemy's position, check for collisions with the player
 * and if true call the gamePanel.endGam() method,
 * required method by game's Engine
 * Parameter: dt, the time delta between two successive game's frames, which is
 * calculated by the game's Engine
 */
Enemy.prototype.update = function(dt) {
    // If the game is not paused to display the 'Game Over' banner
    if (gamePanel.pauseGame === false) {

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
                // After collision the player is lost
                gamePanel.players--;

                // If there are more players, play again
                if (gamePanel.players > 0) {
                    player.reset('beatenByEneny');
                } else {
                    // else end the game
                    gamePanel.gameOver();
                    player.reset('initialPosition');
                }
            }
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

/* Update the player's position, check for rock collection and update gamePanel,
 * required method by game's Engine
 */
Player.prototype.update = function() {
    this.x = 101 * (this.column - 1);
    this.y = 53 + (this.row - 1) * 83;

    // Check if the player collects a rock
    if (rock.row === this.row && rock.column === this.column) {
        gamePanel.score += rock.calculateScore();
        rock.reset();
        rock.update();
    }
};

// Draw the player on the screen, required method by game's Engine
Player.prototype.render = function() {
    // Same as the Enemy.render() method
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Handle user input to properly move the player
 * and update the gamePanel when the player reaches to the water,
 * method used by document's keyboard-listener and click-listener
 * Parameter: moveDirection, takes a String value
 * between 'left', 'right', 'up' and 'down'
 */
Player.prototype.handleInput = function(moveDirection) {
    // IF the 'Game Over' message is not displayed
    if (gamePanel.pauseGame === false) {
        // If this is the first game's move, start the timer and set a random-rock-update
        if (gamePanel.timerWorkingStatus === false) {
            gamePanel.timerWorkingStatus = true;
            gamePanel.startTimer();
            rock.update();
        }

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
                    // Score increase equals to: 60
                    gamePanel.score += 60;
                    this.reset('initialPosition');
                }
                break;
            case 'down':
                if (this.row < 5) {
                    this.row++;
                }
        }
    }
};

/* Reset player position, required method by Player.handleInput(),
 * Enemy.update() and gamePanel.startNewGame() methods
 * Parameter: position, can take a String value between 'beatenByEneny' and 'initialPosition'
 */
Player.prototype.reset = function(position) {
    this.row = 5;
    if (position === 'beatenByEneny') {
        this.column = 4;
    } else if (position === 'initialPosition') {
        this.column = 3;
    }
}

// The gamePanel class. Initiates topScore from localstore, if available
let GamePanel = function() {
    this.players = 3;
    this.score = 0;

    this.timeLeft = 60; // seconds
    this.gameTimer = {};
    this.timerWorkingStatus = false;

    this.banner = '';
    this.bannerTextColor = '';


    /* pauseGame will be set to true for 5 seconds,
     * while the 'Game Over' message is displayed
     */
    this.pauseGame = false;

    // Reference to emergeRock() timer
    this.emergeRock = {};

    // Return true if localStorage is available
    this.storageAvailable = function() {
        try {
            localStorage.setItem('test', '__storage_test__');
            localStorage.removeItem('test');
            return true;
        } catch(e) {
            return false;
        }
    };

    // If localStorage is available
    if (this.storageAvailable()) {
        // and If localStorage is not empty
        if(localStorage.getItem('topScore') != null) {
            // Restore topScore
            this.topScore = parseInt(localStorage.getItem('topScore'));
        } else {
            this.topScore = 0;
        }
    }
}

// Draw the gamePanel on the screen, required method by game's Engine
GamePanel.prototype.render = function() {
    /* Return score with 4 digit format,
     * Parameter: score, allowed value: an integer < 9999
     */
    const storeTo4Digits = function(score) {
        const zerosBeforeScore = score < 9 ? '000'
                                : score < 99 ? '00'
                                : score < 999 ? '0'
                                : '';
        return zerosBeforeScore + score;
    }

    // Display number of players left alive
    ctx.font = '34px sans-serif';
    ctx.fillStyle = '#eaf6f6';
    ctx.fillText(this.players + '/3', 26, 100);

    // Display score with 4 digits
    ctx.fillText(storeTo4Digits(this.score), 213, 100);

    // Display timeLeft in m:ss format
    const timeLeftToString = this.timeLeft === 60 ? '1:00'
                            : this.timeLeft > 9 ? '0:' + this.timeLeft
                            : '0:0' + this.timeLeft;
    ctx.fillText(timeLeftToString, 419, 100);

    // Display banner
    ctx.font = '48px sans-serif';
    ctx.fillStyle = this.bannerTextColor;
    ctx.fillText(this.banner, 130, 270);

    // Display top score with 4 digits
    ctx.fillStyle = '#3c0c34';
    ctx.font = '26px sans-serif';
    ctx.fillText('Top score:   ', 55, 575);
    ctx.font = '32px sans-serif';
    ctx.fillText(storeTo4Digits(this.topScore), 216, 575);
}

/* Stop the timer, update top score and save it to localStorage if it's available,
 * display 'Game Over' message and pause game for 5 seconds,
 * and then restart the game,
 * method required by Enemy.update() and gamePanel.startTimer() methods
 */
GamePanel.prototype.gameOver = function() {
    clearInterval(this.gameTimer);
    this.timerWorkingStatus = false;

    if (this.topScore < this.score) {
        this.topScore = this.score;
    }

    // Save topScore in localStorage, if it's available
    if (this.storageAvailable()) {
        localStorage.setItem('topScore', this.topScore);
    }

    this.bannerTextColor = '#c20000';
    this.banner = 'Game Over';

    gamePanel.pauseGame = true;

    // Stop the emergeRock timer if there is one
    clearTimeout(gamePanel.emergeRock);

    // Reset gamePanel, enemies, player and rock and start the new game
    const startNewGame = function() {
        this.banner = '';
        this.bannerTextColor = '';
        this.score = 0;
        this.players = 3;
        this.timeLeft = 60; // seconds

        //Set all enemies to their initial position, out of the canvas
        for (let enemy of allEnemies) {
            enemy.x = 525;
            enemy.y = -103;
        }

        player.reset('initialPosition');

        rock.reset();

        gamePanel.pauseGame = false;
    }

    // Start the new game after 5 seconds
    setTimeout(startNewGame.bind(this), 5000);
}

/* Count down scopePanel's 'timer' property, initially set to 60 seconds
 * and then end the game,
 * method required by player.handleInput() method
 */
GamePanel.prototype.startTimer = function() {
    // Count down to zero
    const countDown = function() {
        this.timeLeft--;
        if (this.timeLeft === 0) {
        // Stop the game
        this.gameOver();
        }
    };

    // start the timer
    this.gameTimer = setInterval(countDown.bind(this), 1000);
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

    // Calculate score when collected, according to the rock's column
    this.calculateScore = function() {
        /* Score-increase, for rock in column: 1, 2, 3, 4, 5
         * equals to: 100, 80, 60, 40, 20 respectively
         */
        return 20 * (6 - this.column);
    }
}

/* Randomly update rock's position, after random seconds
 * method required by player.update() and player.handleInput() methods
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
    gamePanel.emergeRock = setTimeout(randomlyLocateRock.bind(this), rockEmergeSeconds * 1000);
}

// Draw the rock on the screen, required method by game's Engine
Rock.prototype.render = function() {
    // Same as the Enemy.render() method
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // Display rockScore
    ctx.font = '34px sans-serif';
    ctx.fillStyle = '#614F14';
    ctx.fillText(this.calculateScore(), this.x + (this.calculateScore() < 100 ? 30 : 20), this.y + 120);
}

// Reset the rock, required method by player.update() and gamePanel.gameOver() method
Rock.prototype.reset = function() {
    this.row = 0;
    this.column = 0;
    this.x = -103;
    this.y = -103;
}

/* Instantiate game's global objects: three enemies, one player,
 * one gamePanel and one rock
 * Place all enemy objects in the array called allEnemies
 * Place the player object in the variable called player
 */
let allEnemies = [];
for (let index = 0; index < 3; index++) {
    allEnemies[index] = new Enemy();
}
let player = new Player();
let gamePanel = new GamePanel();

let rock = new Rock();

/* Listen for arrow-key presses and send the keys to
 * player.handleInput() method.
 */
document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    // If an allowedKey is pressed
    if (allowedKeys[e.keyCode] != undefined) {
        player.handleInput(allowedKeys[e.keyCode]);
    }
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

    let moveDirection = '';

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

    // Set clickable area for each arrow
    if (checkPointInRectangle(379, 382, 429, 440, clickX, clickY)) {
        moveDirection = 'up';
    } else if (checkPointInRectangle(379, 490, 429, 548, clickX, clickY)) {
        moveDirection = 'down';
    } else if (checkPointInRectangle(303, 440, 379, 490, clickX, clickY)) {
        moveDirection = 'left';
    } else if (checkPointInRectangle(429, 440, 505, 490, clickX, clickY)) {
        moveDirection = 'right';
    }

    // if an arrow area was clicked
    if (moveDirection != '') {
        player.handleInput(moveDirection);
    }
});
