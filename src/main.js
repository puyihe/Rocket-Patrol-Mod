/*
Name :Puyi He
Project name: Rocket Patrol Mods
date: 4 /30
time take : more than 10 hr
*/

/*
Implement the speed increase that happens after 30 seconds in the original game (5)
Randomize each spaceship's movement direction at the start of each play (5)
Add your own (copyright-free) background music to the Play scene (5)
Create a new scrolling tile sprite for the background (5)
Allow the player to control the Rocket after it's fired (5)
Using a texture atlas, create a new animated sprite for the Spaceship enemies (10)
Create a new title screen (e.g., new artwork, typography, layout) (10)
Display the time remaining (in seconds) on the screen (10)
Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (15)
Implement an alternating two-player mode (15)
Implement a new timing/scoring mechanism that adds time to the clock for successful hits (15)
*/
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT;