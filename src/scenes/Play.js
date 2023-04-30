class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('rocket2', './assets/rocket2.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('ship', './assets/ship.png');
        this.load.image('BG2', './assets/BG2.png');

        this.load.image('starfield', './assets/starfield.png');

        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', { frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 5 });
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.gm2 = this.add.tileSprite(0, 30, 640, 80, 'BG2').setOrigin(0, 0);

        // green UI background
        this.add.image(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, "BG2").setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // add Rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        this.p2Rocket = new Rocket2(this, game.config.width / 2, game.config.height - borderUISize - borderPadding, 'rocket2').setOrigin(0.5, 0);

        // add Spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0, 0);
        this.ship04 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'ship', 0, 0).setOrigin(0, 0);
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyG = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 5, first: 0 }),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;
        this.p2Score = 0;
        this.timer = game.settings.gameTimer / 1000;
        // display score
        let scoreConfig = {
            fontFamily: 'Cursive',
            fontSize: '28px',

            color: 'White',
            align: 'left',
            padding: {

                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        let timer = {
            fontFamily: 'Cursive',
            fontSize: '20px',

            color: 'White',
            align: 'left',
            padding: {

                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        this.scoreLeft = this.add.text(borderUISize + borderPadding * 3, borderUISize + borderPadding * 3.25, this.p1Score, scoreConfig);
        this.score2Left = this.add.text(borderUISize * 16.5 + borderPadding, borderUISize + borderPadding * 3.25, this.p2Score, scoreConfig);


        this.TimeLeft = this.add.text(borderUISize * 9 + borderPadding, borderUISize + borderPadding * 2, this.timer, timer);

        // GAME OVER flag
        this.gameOver = false;
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.ship04.superspeed();
        this.clock = this.time.delayedCall(30000, () => {
            this.ship01.speedup();
            this.ship02.speedup();
            this.ship03.speedup();
        }, null, this);
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            if (this.p1Score > this.p2Score) {
                this.add.text(game.config.width / 2, game.config.height / 2 - borderUISize - borderPadding, 'P1 Wins Score:' + this.p1Score, scoreConfig).setOrigin(0.5);
            } else {
                this.add.text(game.config.width / 2, game.config.height / 2 - borderUISize - borderPadding, 'P2 Wins Score:' + this.p2Score, scoreConfig).setOrigin(0.5);
            }
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width - 128, game.config.height - 80, 'Andy was here', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width - 128, game.config.height - 60, 'Erick saw it ', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);


    }

    update() {
        // check key input for restart / menu
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 2; // update tile sprite

        if (!this.gameOver) {
            this.p2Rocket.update();
            this.p1Rocket.update(); // update p1
            this.ship01.update(); // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }
        const movementSpeed = 4;
        if (keyLEFT.isDown) {
            this.p1Rocket.x -= movementSpeed;
        }
        if (keyRIGHT.isDown) {
            this.p1Rocket.x += movementSpeed;
        }
        if (keyA.isDown) {
            this.p2Rocket.x -= movementSpeed;
        }
        if (keyD.isDown) {
            this.p2Rocket.x += movementSpeed;
        }

        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
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
        if (this.checkCollision(this.p2Rocket, this.ship03)) {
            this.p2Rocket.reset();
            this.shipExplode2(this.ship03);
        }
        if (this.checkCollision(this.p2Rocket, this.ship02)) {;
            this.p2Rocket.reset();
            this.shipExplode2(this.ship02);
        }
        if (this.checkCollision(this.p2Rocket, this.ship01)) {
            this.p2Rocket.reset();
            this.shipExplode2(this.ship01);
        }
        if (this.checkCollision(this.p2Rocket, this.ship04)) {
            this.p2Rocket.reset();
            this.p2Score += 50;
            this.scoreLeft.text = this.p2Score;

            this.shipExplode2(this.ship04);
        }
        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.p1Score += 50;
            this.scoreLeft.text = this.p1Score;

            this.shipExplode2(this.ship04);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
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
        boom.anims.play('explode'); // play explode animation
        boom.on('animationcomplete', () => { // callback after anim completes
            ship.reset(); // reset ship position
            ship.alpha = 1; // make ship visible again
            boom.destroy(); // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;


        this.sound.play('sfx_explosion');
    }
    shipExplode2(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode'); // play explode animation
        boom.on('animationcomplete', () => { // callback after anim completes
            ship.reset(); // reset ship position
            ship.alpha = 1; // make ship visible again
            boom.destroy(); // remove explosion sprite
        });
        // score add and repaint
        this.p2Score += ship.points * 1.5;
        this.score2Left.text = this.p2Score;


        this.sound.play('sfx_explosion');
    }

}