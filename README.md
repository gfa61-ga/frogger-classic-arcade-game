# Frogger: classic arcade game

In this [game](https://gfa61-ga.github.io/frogger-classic-arcade-game/) you have Players and Enemies (Bugs). The game has 3 players. The goal of each player is to reach the water, without colliding into any one of the enemies. The player can move left, right, up and down. The enemies move in varying speeds on the paved block portion of the scene.
## Table of Contents

* [Instructions](#instructions)
* [Additional functionality](#Additional-functionality)
* [Dependencies](#Dependencies)

## Instructions

You can move your players:
1. by using the keyboard arrow keys or
2. by clicking or taping on the arrowPanel, at the lower right side of the gameBoard.

### Player move rules

* All 3 players **have 1 minute** available to play the game.
* Once a player **collides** with an enemy, the player **loses his life** and the **next player** starts from the looser position.
* Once the player **collects a rock** he **gets** some **point**s, according to the rock position.
* Once the player **reaches the water** he gets 60 points and **returns to its initial position**.

### Game Over
The game is **over** and **reset**:
1. when there is **no player left** or
2. when the **1 minute has passed**.

### Goal of the game
The goal of every game is to **get a higher score** than the latest top score.

## Additional-functionality
If your browser supports **localStorage**, your Top Score is kept as long as you don't clean your browser's memory from cooKies.

## Dependencies

This game is based on the starter code of [this](https://github.com/udacity/frontend-nanodegree-arcade-game) Udacity repository for the Front End Develpmpent students.