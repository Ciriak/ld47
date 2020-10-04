import 'phaser';
import MainScene from './scenes/MainScene';
import { velocityToTarget } from './utils';
export default class Character {
  public canMove: boolean;
  private scene: MainScene;
  public cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  public jumpKey: Phaser.Input.Keyboard.Key;
  public facing: 'left' | 'right';
  public canJump: boolean;
  public isInAir: boolean;
  public isSpawning: boolean;
  public isDead: boolean;
  public isActive: boolean;
  public entitie: Phaser.Physics.Matter.Sprite;

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
    this.isSpawning = false;
    this.isActive = false;
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

    let count = 0;

    this.entitie.setOnCollideActive((e: any) => {
      count++;
      // if collide with it's bottom, reset jump
      this.canJump = false;

      if (e.collision.normal.y !== 0) {
        this.canJump = true;
      }
    });

    this.generateCamera();
  }

  public update() {
    this.inputsListener();
    this.animationsManager();
    this.checkOutOfBounds();

    this.isInAir = false;
    if (this.entitie.body.velocity.y < -0.1) {
      this.isInAir = true;
    }
  }

  private checkOutOfBounds() {
    if (this.entitie.x > 5000 || this.entitie.y > 2000) {
      this.kill();
    }
  }

  private animationsManager() {
    if (this.isSpawning) {
      return;
    }
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
    this.scene.cameras.main.setBounds(0, 0, 80 * 32, 30 * 32);
  }

  public kill() {
    if (this.isDead) {
      return;
    }
    this.isDead = true;
    this.canMove = false;

    this.scene.rewind();
    this.scene.soundManager.death.play();
  }

  public spawn() {
    const coord = this.scene.level.getSpawnPoint();
    this.isSpawning = true;
    this.entitie.setPosition(coord.x, coord.y);
    this.entitie.setIgnoreGravity(false);
    this.entitie.anims.play('playerSpawn');
    this.scene.soundManager.respawn.play();

    setTimeout(() => {
      this.canMove = true;
      this.isDead = false;
      this.isSpawning = false;
    }, 500);
  }

  private inputsListener() {
    if (this.isDead) {
      this.entitie.setVelocity(0, 0);
      this.entitie.setIgnoreGravity(true);
      return;
    }
    // ignore if player can't move
    if (!this.canMove) {
      return;
    }

    if (this.isSpawning) {
      return;
    }

    let acceleration = this.acceleration;
    this.entitie.setIgnoreGravity(false);

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

  disable() {
    this.isActive = false;
    this.canJump = false;
    this.canMove = false;

    // disable all collisions
    this.entitie.setToSleep();
  }

  enable() {
    this.isActive = true;
    this.canJump = true;
    this.canMove = true;
    this.entitie.setAwake();
  }
}
