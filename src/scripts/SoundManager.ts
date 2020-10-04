import MainScene from './scenes/MainScene';

export default class SoundManager {
  private scene: MainScene;
  public rewind: Phaser.Sound.BaseSound;
  public bgMusic: Phaser.Sound.BaseSound;
  public respawn: Phaser.Sound.BaseSound;
  public jump: Phaser.Sound.BaseSound;
  public death: Phaser.Sound.BaseSound;
  constructor(scene: MainScene) {
    this.scene = scene;
  }

  preload() {
    this.scene.load.audio('bgMusic', './assets/sounds/bg.mp3');
    this.scene.load.audio('jump', './assets/sounds/jump.wav');
    this.scene.load.audio('rewind', './assets/sounds/rewind.wav');
    this.scene.load.audio('respawn', './assets/sounds/respawn.wav');
    this.scene.load.audio('death', './assets/sounds/death.wav');
  }

  create() {
    this.bgMusic = this.scene.sound.add('bgMusic', {
      loop: true,
    });
    // music.play();
    this.rewind = this.scene.sound.add('rewind');
    this.respawn = this.scene.sound.add('respawn');
    this.death = this.scene.sound.add('death');
    this.jump = this.scene.sound.add('jump');
  }

  playRewind() {
    this.rewind.play();
  }
}
