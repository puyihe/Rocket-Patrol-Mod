class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('ship', './assets/ship.png');
        this.load.image('BG2', './assets/BG2.png');

        this.load.image('starfield', './assets/starfield.png');

        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', { frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 5 });
        this.load.spritesheet('aspaceship', './assets/aspaceship.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 2});
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        // add Rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        // add Spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        this.ship01.anims.play('aspaceship');
        this.ship02.anims.play('aspaceship');
        this.ship03.anims.play('aspaceship');
        this.ship04 = new fastSpaceship(this, game.config.width + borderUISize*9, borderUISize*4, 'ship', 0, 100).setOrigin(0, 0);
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { 
                start: 0, 
                end: 9, 
                first: 0
            }),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        this.bestp = this.add.text(borderUISize + borderPadding + scoreConfig.fixedWidth *1.5 , borderUISize + borderPadding*2, config.bestpoint, scoreConfig);
        this.addtime = 0;
        this.clockRight = this.add.text(-borderUISize + game.config.width - borderPadding - scoreConfig.fixedWidth, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
      scoreConfig.fixedWidth = 0;
      this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
         this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
         this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
         this.gameOver = true;
         if(this.p1Score > highscore){
            highscore = this.p1Score;
         }
         this.highscoreText.setText('Highscore: ' + highscore);
      }, null, this);

      this.clockText = this.add.text(game.config.width/2 - borderUISize * 3 - borderPadding * 2, borderUISize + borderPadding * 2, this.clock.delay - this.clock.elapsed, scoreConfig).setOrigin(0.5, 0);
      this.highscoreText = this.add.text(game.config.width/2 + borderUISize + borderPadding, borderUISize + borderPadding * 2, 'Highscore: ' + highscore, scoreConfig).setOrigin(0.5, 0);
      scoreConfig.backgroundColor = '#B81818';
      this.fire = this.add.text(game.config.width/2 - scoreConfig.fixedWidth/2, borderUISize + borderPadding*2, 'Fire!', scoreConfig);
      this.fire.visible = false;
    }

    update() {
        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 4;  // update tile sprite

        if(!this.gameOver) {
            this.p1Rocket.update();             // update p1
             this.ship01.update();               // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
        }
        this.clockRight.text = Math.floor((game.settings.gameTimer - this.time.now + this.time.startTime)/1000 + this.addtime);
        if(this.time.now - this.time.startTime >=30000 && game.settings.spaceshipSpeed == this.ship01.moveSpeed){
          this.ship01.moveSpeed += 2;
          this.ship02.moveSpeed += 3;
          this.ship03.moveSpeed += 2;
        }
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        // timer text
        this.clockText.setText(((this.clock.delay - this.clock.elapsed) / 1000).toFixed(2));
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score; 

        this.sound.play('sfx_explosion');
        addTime(){
            let scoreConfig = {
              fontFamily: 'Courier',
              fontSize: '28px',
              backgroundColor: '#F3B141',
              color: '#843605',
              align: 'right',
              padding: {
                top: 5,
                bottom: 5,
              },
              fixedWidth: 0
            }
            this.time.removeEvent(this.clock);
            this.addtime = this.addtime + 1;
            this.clock = this.time.delayedCall(game.settings.gameTimer - this.time.now + this.time.startTime + this.addtime*1000, () => {
              this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
              this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
              this.gameOver = true;
              if(config.bestpoint < this.p1Score){
                config.bestpoint = this.p1Score;
              }
            }, null, this);
          }
    }

}