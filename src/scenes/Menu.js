class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        this.load.audio('BGM', './assets/BGM.wav');
        this.load.image('background', './assets/background.png');
    }

    create() {
      // menu text configuration
      let menuConfig = {
          fontFamily: 'Cursive',
          fontSize: '30px',
          backgroundImage: 'background',
          color: 'black',
          align: 'right',
          padding: {
              top: 5,
              bottom: 5,
          },
          fixedWidth: 0
      }
      this.sound.play('BGM');
      // show menu text
      this.starfield = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0, 0);
      this.add.text(game.config.width / 2, game.config.height / 2 - borderUISize - borderPadding, 'EVIL CUPIT', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width / 2, game.config.height / 2, 'For P1 Use ←→ arrows to move & (L) to fire', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize * 2 + borderPadding * 2, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);

      menuConfig.color = '#000';

      // define keys
      keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
      keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
  }

  update() {


      if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // Novice mode
          game.settings = {
              spaceshipSpeed: 3,
              gameTimer: 60000
          }

          this.sound.play('sfx_select');
          this.scene.start("playScene");


      }
      if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // Expert mode
          game.settings = {
              spaceshipSpeed: 4,
              gameTimer: 45000

          }

          this.sound.play('sfx_select');
          this.scene.start("playScene");
      }
  }
}