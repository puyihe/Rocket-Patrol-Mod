// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing scene
        this.points = pointValue;   // store pointValue
        this.moveSpeed = game.settings.spaceshipSpeed-3;         // pixels per frame

        
    }
    speedup(){
        this.moveSpeed = game.settings.spaceshipSpeed;
    }
    superspeed(){
        this.moveSpeed =game.settings.spaceshipSpeed*2;
    }
    update() {
        // move spaceship left
        this.x -= this.moveSpeed;
        // wrap around from left edge to right edge
        if(this.x <= 0 - this.width) {
            this.reset();
        }
    }

    // position reset
    reset() {
        this.x = game.config.width;
        this.y =Math.floor(Math.random() * ( game.config.height - borderUISize*3 - borderPadding - (borderUISize * 3 + borderPadding) + 1) + borderUISize * 3 + borderPadding);
       
        
       
        
    }
}