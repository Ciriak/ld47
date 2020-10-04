import 'phaser';
import MainScene from './scenes/MainScene';

export default class Character {
  public canMove: boolean;
  private scene: MainScene;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private jumpKey: Phaser.Input.Keyboard.Key;
  public facing: 'left' | 'right';
  public canJump: boolean;
  public isInAir: boolean;
  public isDead: boolean;
  public entitie: Phaser.Physics.Matter.Sprite;
  private debugText: Phaser.GameObjects.Text;
  public acceleration: number;
  public maxVelocity: {
    x: number;
    y: number;
  };
  constructor(scene: MainScene) {
    this.facing = 'right';
    this.canJump = false;
    this.isInAir = false;
    this.isDead = false;
    this.maxVelocity = {
      x: 3,
      y: 3,
    };
    this.acceleration = 0.01;
    this.scene = scene;
    this.canMove = false;

    const spawn = {
      x: 400,
      y: 400,
    };

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.jumpKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.entitie = this.scene.matter.add.sprite(spawn.x, spawn.y, 'character');
    this.entitie.setBody({
      width: 16,
      height: 32,
    });
    this.entitie.setFriction(0.05);
    this.entitie.setFrictionAir(0.0005);
    this.entitie.setFixedRotation();

    this.entitie.setData('isPlayer', true);
    this.inputsListener();
    this.debugText = this.scene.add.text(10, 10, 'Debug', { font: '16px Courier', fill: '#00ff00' }).setScrollFactor(0);

    let count = 0;

    this.entitie.setOnCollideActive((e: any) => {
      count++;
      // if collide with it's bottom, reset jump
      this.canJump = false;

      if (e.collision.normal.y !== 0) {
        this.canJump = true;
      }
    });

    this.generateAnimations();
    this.generateCamera();
  }

  public update() {
    this.inputsListener();
    this.animationsManager();

    this.isInAir = false;
    if (this.entitie.body.velocity.y < -0.1) {
      this.isInAir = true;
    }

    const pointer = this.entitie.body;

    this.debugText.setText([
      'position x: ' + this.entitie.x,
      'position y: ' + this.entitie.y,
      'velocity x: ' + pointer.velocity.x,
      'velocity y: ' + pointer.velocity.y,
      'left: ' + this.cursors.left.isDown,
      'right: ' + this.cursors.right.isDown,
      'direction: ' + this.facing,
      'jumpKey :' + this.jumpKey.isDown,
      'canJump: ' + this.canJump,
      'canMove: ' + this.canMove,
      'isInAir: ' + this.isInAir,
      'animation: ' + this.entitie.anims.currentAnim.key,
    ]);
  }

  private animationsManager() {
    if (this.entitie.body.velocity.y < -0.1) {
      this.entitie.anims.play('playerJump', true);
    } else {
      if (this.entitie.body.velocity.x !== 0) {
        this.entitie.anims.play('playerWalk', true);
      } else {
        this.entitie.anims.play('playerIdle', true);
      }
    }
  }

  private generateCamera() {
    this.scene.cameras.main.startFollow(this.entitie, true, 0.05, 0.05);
  }

  private generateAnimations() {
    this.scene.anims.create({
      key: 'playerWalk',
      frames: this.scene.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
      repeat: -1,
      frameRate: 10,
    });

    this.scene.anims.create({
      key: 'playerJump',
      frames: this.scene.anims.generateFrameNumbers('character', { start: 4, end: 4 }),

      frameRate: 10,
    });

    this.scene.anims.create({
      key: 'playerIdle',
      frames: this.scene.anims.generateFrameNumbers('character', { start: 0, end: 0 }),
      repeat: -1,
      frameRate: 10,
    });
  }

  public kill() {
    this.isDead = true;
    this.canMove = false;
    this.scene.rewind();
    this.scene.soundManager.death.play();
  }

  public spawn() {
    const coord = this.scene.level.getSpawnPoint();
    this.entitie.setPosition(coord.x, coord.y);
    this.entitie.setIgnoreGravity(false);
    this.canMove = true;
    this.isDead = false;
    this.scene.soundManager.respawn.play();
  }

  private inputsListener() {
    if (this.isDead) {
      this.entitie.setVelocity(0, 0);
      this.entitie.setIgnoreGravity(true);
    }
    // ignore if player can't move
    if (!this.canMove) {
      return;
    }

    let acceleration = this.acceleration;

    if (this.cursors.left.isDown) {
      if (this.facing !== 'left' || this.isInAir) {
        acceleration = acceleration / 3;
      }

      if (this.entitie.body.velocity.x < -0.1) {
        this.facing = 'right';
        this.entitie.setScale(-1, 1);
      }
      // needed for some reason
      this.entitie.setFixedRotation();
      const forceVector = new Phaser.Math.Vector2(-5, 0);

      if (this.entitie.body.velocity.x <= -this.maxVelocity.x) {
        this.entitie.setVelocityX(-this.maxVelocity.x);
      } else {
        // this.entitie.applyForce(forceVector);
        this.entitie.setVelocityX(-this.maxVelocity.x);
      }
    } else if (this.cursors.right.isDown) {
      if (this.facing !== 'right' || this.isInAir) {
        acceleration = acceleration / 3;
      }

      if (this.entitie.body.velocity.x > 0.1) {
        this.facing = 'right';
        this.entitie.setScale(1, 1);
      }

      // needed for some reason
      this.entitie.setFixedRotation();
      const forceVector = new Phaser.Math.Vector2(acceleration, 0);
      if (this.entitie.body.velocity.x >= this.maxVelocity.x) {
        this.entitie.setVelocityX(this.maxVelocity.x);
      } else {
        // this.entitie.applyForce(forceVector);
        this.entitie.setVelocityX(this.maxVelocity.x);
      }
    } else {
      if (this.facing !== 'right') {
        // if (facing === 'left') {
        //   player.frame = 0;
        // } else {
        //   player.frame = 5;
        // }
      }
    }

    if (this.jumpKey.isDown && this.canJump) {
      this.scene.soundManager.jump.play();
      this.entitie.setVelocityY(-7);
      this.canJump = false;
    }
  }
}
