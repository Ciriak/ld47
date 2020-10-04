import 'phaser';
import Character from '../Character';
import Debugger from '../Debugger';
import Level from '../Level';
import moment from 'moment';
import SoundManager from '../SoundManager';
export default class MainScene extends Phaser.Scene {
  public character: Character;
  public level: Level;
  public soundManager: SoundManager;
  public speedRunText: Phaser.GameObjects.Text;
  private debugger: Debugger;
  private tabKey: Phaser.Input.Keyboard.Key;
  constructor() {
    super({
      key: 'MainScene',
    });
    this.soundManager = new SoundManager(this);
    this.debugger = new Debugger(this);
  }
  preload() {
    this.load.spritesheet('character', 'assets/graphics/character.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('tileset', 'assets/graphics/tileset.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.tilemapTiledJSON('map', 'assets/map.json');

    this.soundManager.preload();
  }
  create() {
    this.soundManager.create();
    this.generateAnimations();
    this.level = new Level(this);
    this.character = new Character(this);
    this.character.spawn();
    this.character.enable();
    this.soundManager.bgMusic.play({ loop: true });
    this.debugger.create();

    // init speedrun counter
    this.speedRunText = this.add.text(500, 500, 'SpeedRun :', {
      fontSize: '18px',
      backgroundColor: '#000',
      fontWeight: 'bold',
    });
    this.speedRunText.setDepth(10);
    //

    // listen debug key press
    this.tabKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
  }

  update() {
    this.character.update();
    this.level.update();
    this.debugger.update();
    this.handleSpeedRunCounter();
    this.handleDebugKey();
  }

  rewind() {
    this.cameras.main.shake(500, 0.005);

    this.soundManager.bgMusic.pause();
    this.soundManager.rewind.play();
    this.character.disable();
    this.level.setLevel(this.level.currentLevel);
    setTimeout(() => {
      this.character.spawn();
      setTimeout(() => {
        this.soundManager.rewind.stop();
        this.soundManager.bgMusic.resume();
        this.character.enable();
      }, 500);
    }, 500);
  }

  private handleSpeedRunCounter() {
    if (!this.speedRunText) {
      return;
    }
    const pos = this.cameras.main.getWorldPoint(1000, 80);
    this.speedRunText.setPosition(pos.x, pos.y);
    this.speedRunText.setText('Speedrun : ' + moment(this.game.getTime()).format('mm:ss:SS'));
  }
  private handleDebugKey() {
    if (Phaser.Input.Keyboard.JustDown(this.tabKey)) {
      this.debugger.toggle();
    }
  }
  nextLevel() {
    this.rewind();
    this.level.setLevel(this.level.currentLevel + 1);
  }

  private generateAnimations() {
    this.anims.create({
      key: 'playerWalk',
      frames: this.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
      repeat: -1,
      frameRate: 10,
    });

    this.anims.create({
      key: 'playerJump',
      frames: this.anims.generateFrameNumbers('character', { start: 4, end: 4 }),

      frameRate: 10,
    });

    this.anims.create({
      key: 'playerIdle',
      frames: this.anims.generateFrameNumbers('character', { start: 0, end: 0 }),
      repeat: -1,
      frameRate: 10,
    });

    this.anims.create({
      key: 'playerSpawn',
      frames: this.anims.generateFrameNumbers('character', { start: 11, end: 15 }),

      frameRate: 10,
    });

    this.anims.create({
      key: 'fallingPlatformIdle',
      frames: this.anims.generateFrameNumbers('tileset', {
        frames: neonFrames.idle,
      }),

      frameRate: 30,
    });

    this.anims.create({
      key: 'fallingPlatformCrash',
      frames: this.anims.generateFrameNumbers('tileset', {
        frames: neonFrames.crash,
      }),

      frameRate: 30,
    });

    this.anims.create({
      key: 'fallingPlatformFlash',
      frames: this.anims.generateFrameNumbers('tileset', {
        frames: neonFrames.flash,
      }),

      frameRate: 30,
    });

    this.anims.create({
      key: 'fallingPlatformFlash',
      frames: this.anims.generateFrameNumbers('tileset', {
        frames: neonFrames.flash,
      }),

      frameRate: 30,
    });

    this.anims.create({
      key: 'endPointIdle',
      frames: this.anims.generateFrameNumbers('tileset', {
        frames: [67, 68, 69, 68, 67, 68, 69, 68, 67, 68, 69, 68, 67, 68, 69, 68],
      }),
      repeat: -1,
      frameRate: 3,
    });
  }
}

export const neonFrames = {
  idle: [22, 22],
  flash: [11, 11, 11, 22, 11, 22, 22, 11, 11, 11, 22],
  crash: [22, 22, 11, 22, 11, 22, 11, 22, 11, 22, 11, 11, 11, 11, 11],
};
