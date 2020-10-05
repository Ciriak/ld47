import { isPlayerCollision } from '../utils';
import GameplayEntitie, { gameplayItemName, gameplayItemsIndex, offset } from './GameplayEntitie';
const shootDelay = 1000;
const projectileVelocity = 3;
export default class Cannon extends GameplayEntitie {
  private projectiles: Phaser.Physics.Matter.Sprite[] = [];
  private spawnInterval: any;
  private direction: 'top' | 'left' | 'bottom' | 'right';
  private frameIndex: number;
  add() {
    this.direction = this.tileItem.properties.direction || 'right';

    switch (this.direction) {
      case 'bottom':
        this.frameIndex = 74;
        break;
      case 'top':
        this.frameIndex = 74;
        break;
      case 'left':
        this.frameIndex = 75;
        break;
      case 'right':
        this.frameIndex = 75;
        break;

      default:
        this.frameIndex = gameplayItemsIndex.cannon;
        break;
    }

    // **note** for some reason we need to substract the index by 1
    this.sprite = this.scene.matter.add.sprite(this.tileItem.pixelX + offset, this.tileItem.pixelY + offset, 'tileset', this.frameIndex, {
      isStatic: true,
    });

    // handle sprite for multiple direction
    if (this.direction === 'left') {
      this.sprite.setScale(-1, 1);
    }

    if (this.direction === 'top') {
      this.sprite.setScale(1, -1);
    }

    this.spawnInterval = setInterval(() => {
      this.shoot();
    }, shootDelay);
  }

  shoot() {
    if (!this.sprite || !this.sprite.active) {
      clearInterval(this.spawnInterval);
      this.destroyAllProjectiles();
      return;
    }

    let spawnX = this.tileItem.pixelX + offset;
    let spawnY = this.tileItem.pixelY + offset;

    const projectileOffset = 25;
    switch (this.direction) {
      case 'bottom':
        spawnY += projectileOffset;
        break;
      case 'top':
        spawnY -= projectileOffset;
        break;
      case 'left':
        spawnX -= projectileOffset;
        break;
      case 'right':
        spawnX += projectileOffset;
        break;

      default:
        break;
    }

    const projectile = this.scene.matter.add.sprite(spawnX, spawnY, 'tileset', gameplayItemsIndex.projectile);

    projectile.setBody({
      type: 'circle',
      radius: 4,
    });

    projectile.setIgnoreGravity(true);
    projectile.setFrictionAir(0);
    projectile.setSensor(true);

    this.scene.soundManager.cannon.play();

    switch (this.direction) {
      case 'right':
        projectile.setVelocity(projectileVelocity, 0);
        break;
      case 'left':
        projectile.setVelocity(-projectileVelocity, 0);
        break;
      case 'bottom':
        projectile.setVelocity(0, projectileVelocity);
        break;
      case 'top':
        projectile.setVelocity(0, -projectileVelocity);
        break;

      default:
        break;
    }

    this.projectiles.push(projectile);

    projectile.setOnCollide((collision: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      if (isPlayerCollision(collision)) {
        this.scene.character.kill();
      }

      // ignore if collided with sensor
      if (collision.bodyA.isSensor) {
        return;
      }
      projectile.destroy();
    });
  }
  private destroyAllProjectiles() {
    for (const proje of this.projectiles) {
      proje.destroy(true);
    }
  }
}
