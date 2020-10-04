import 'phaser';
import Character from '../Character';
import Level from '../Level';
import SoundManager from '../SoundManager';
export default class MainScene extends Phaser.Scene {
  public character: Character;
  public level: Level;
  public soundManager: SoundManager;
  constructor() {
    super({
      key: 'MainScene',
    });
    this.soundManager = new SoundManager(this);
  }
  preload() {
    this.load.spritesheet('character', 'assets/graphics/character.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image('tileset', 'assets/graphics/tileset.png');
    this.load.spritesheet('gameplay', 'assets/graphics/gameplay.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.tilemapTiledJSON('map', 'assets/map.json');
    this.soundManager.preload();
  }
  create() {
    this.level = new Level(this);
    this.soundManager.create();
    this.character = new Character(this);
    this.character.spawn();
    this.soundManager.bgMusic.play({ loop: true });
  }

  update() {
    this.character.update();
    this.level.update();
  }

  rewind() {
    this.cameras.main.shake(500, 0.005);
    this.cameras.main.setAlpha(0.5);
    this.soundManager.bgMusic.pause();
    this.soundManager.rewind.play();
    setTimeout(() => {
      this.soundManager.rewind.stop();
      this.soundManager.bgMusic.resume();
      this.character.spawn();
      this.cameras.main.setAlpha(1);
    }, 1000);
  }

  nextLevel() {
    this.level.setLevel(this.level.currentLevel + 1);
    this.rewind();
  }
}
