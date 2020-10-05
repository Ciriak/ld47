import 'phaser';
import Character from '../Character';
import Debugger from '../Debugger';
import Level from '../Level';
import moment from 'moment';
import SoundManager from '../SoundManager';
import { gameSize } from '../../app';
export default class MainScene extends Phaser.Scene {
  public character: Character;
  public level: Level;
  public soundManager: SoundManager;
  public speedRunText: Phaser.GameObjects.Text;
  public deathCountText: Phaser.GameObjects.Text;
  public speedRunStart: any;
  public speedRunActive: boolean;
  public deathCount: number = 0;
  private debugger: Debugger;
  private tabKey: Phaser.Input.Keyboard.Key;
  private UKey: Phaser.Input.Keyboard.Key;
  constructor() {
    super({
      key: 'MainScene',
    });
    this.soundManager = new SoundManager(this);
    this.debugger = new Debugger(this);
  }
  preload() {
    const progress = this.add.graphics();

    this.load.spritesheet('character', 'assets/graphics/character.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('tileset', 'assets/graphics/tileset.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.image('victory', 'assets/graphics/ui/victory.png');
    this.load.tilemapTiledJSON('map', 'assets/map.json');

    this.soundManager.preload();

    this.load.on('progress', (value: any) => {
      progress.clear();
      progress.fillStyle(0xff00ff, 1);
      const barHeight = 25;
      progress.fillRect(0, gameSize.height / 2 - barHeight, gameSize.width * value, barHeight);
    });

    this.load.on('complete', () => {
      progress.destroy();
    });
  }
  create() {
    this.soundManager.create();
    this.generateAnimations();
    this.level = new Level(this);
    this.character = new Character(this);
    this.character.spawn();
    this.character.enable();
    this.debugger.create();
    this.deathCount = 0;

    // init speedrun counter
    this.speedRunText = this.add.text(0, 0, '', {
      fontSize: '18px',
      backgroundColor: '#000',
      fontWeight: 'bold',
    });
    this.speedRunText.setDepth(10);

    this.deathCountText = this.add.text(0, 0, '', {
      fontSize: '18px',
      backgroundColor: '#000',
      fontWeight: 'bold',
    });
    this.deathCountText.setDepth(10);

    //

    // listen debug key press
    this.tabKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
    // listen debug level key
    this.UKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
  }

  update() {
    this.character.update();
    this.level.update();
    this.debugger.update();
    this.handleSpeedRunCounter();
    this.handleDebugKey();
    this.handleDebugLevelKey();
  }

  rewind() {
    this.cameras.main.shake(500, 0.003);

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
    if (!this.speedRunText || !this.speedRunActive) {
      return;
    }
    const pos = this.cameras.main.getWorldPoint(gameSize.width - 150, 10);

    this.speedRunText.setPosition(pos.x, pos.y);
    const msElapsed = moment().diff(this.speedRunStart, 'milliseconds');

    this.speedRunText.setText(moment(msElapsed).format('mm:ss:SS'));
  }
  private handleDebugKey() {
    if (Phaser.Input.Keyboard.JustDown(this.tabKey)) {
      this.debugger.toggle();
    }
  }
  private handleDebugLevelKey() {
    if (Phaser.Input.Keyboard.JustDown(this.UKey)) {
      this.level.setLevel(0);
      this.soundManager.bgMusic.stop();
      this.rewind();
    }
  }
  nextLevel() {
    // return to lvl 1 if level 99
    if (this.level.currentLevel === 99) {
      this.level.currentLevel = 1;
      this.rewind();
      return;
    }

    // send to end screen if last level
    if (this.level.currentLevel >= this.level.maxLevel) {
      this.level.currentLevel = 99;
      this.rewind();
      return;
    }

    // normal case
    this.level.currentLevel = this.level.currentLevel + 1;
    this.rewind();
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
      frames: this.anims.generateFrameNumbers('character', { start: 16, end: 17 }),
      repeat: -1,
      frameRate: 2,
    });

    this.anims.create({
      key: 'playerSpawn',
      frames: this.anims.generateFrameNumbers('character', { start: 11, end: 15 }),
      frameRate: 10,
    });

    this.anims.create({
      key: 'playerGlitch',
      frames: this.anims.generateFrameNumbers('character', { start: 22, end: 26 }),
      frameRate: 10,
      repeat: -1,
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

    this.anims.create({
      key: 'bumperIdle',
      frames: this.anims.generateFrameNumbers('tileset', {
        frames: [38, 39, 40, 39],
      }),
      repeat: -1,
      frameRate: 3,
    });

    this.anims.create({
      key: 'glitchBlock',
      frames: this.anims.generateFrameNumbers('tileset', {
        frames: [90, 91, 92, 93, 90, 91, 92, 93, 90, 91, 92, 93],
      }),

      frameRate: 15,
    });
  }

  /**
   * Play the vistory screen
   */
  private handleVictory() {
    this.character.disable();
    const t = this.add
      .image(gameSize.width / 2, gameSize.height / 2, 'victory', 0)
      .setScrollFactor(0)
      .setOrigin(0.75, 0.75)
      .setAlpha(1.0);
    this.cameras.main.fadeOut(2000);
  }
}

export const neonFrames = {
  idle: [22, 22],
  flash: [11, 11, 11, 22, 11, 22, 22, 11, 11, 11, 22],
  crash: [22, 22, 11, 22, 11, 22, 11, 22, 11, 22, 11, 11, 11, 11, 11],
};
