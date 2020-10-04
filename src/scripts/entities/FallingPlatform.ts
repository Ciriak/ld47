import { neonFrames } from '../scenes/MainScene';
import { isPlayerCollision } from '../utils';
import GameplayEntitie, { gameplayItemName, gameplayItemsIndex, offset } from './GameplayEntitie';

const crashDelay = 1000;
let animTimeout: any;
/**
 * Represent an entitie that is not related to gameplay (like a bloc)
 */
export default class FallingPlatform extends GameplayEntitie {
  name: gameplayItemName = 'fallingPlatform';
  isCrashing: boolean;

  playFlash() {
    if (this.isCrashing) {
      return;
    }
    const min = 4000;
    const max = 8000;
    const delay = Math.random() * (min - max) + min;
    animTimeout = setTimeout(() => {
      if (this.isCrashing) {
        return;
      }
      this.sprite.anims.play('fallingPlatformFlash', true);
      this.playFlash();
    }, delay);
  }

  add() {
    this.isCrashing = false;
    // **note** for some reason we need to substract the index by 1
    this.sprite = this.scene.matter.add.sprite(
      this.tileItem.pixelX + offset,
      this.tileItem.pixelY + offset,
      'tileset',
      gameplayItemsIndex.fallingPlatform
    );

    this.sprite.setBody({
      type: 'rectangle',
      width: 32,
      height: 3,
    });

    this.sprite.setOrigin(0.5, 0);

    this.sprite.setStatic(true);

    this.sprite.anims.play('fallingPlatformIdle');
    this.playFlash();

    this.sprite.setOnCollide((collisionInfo: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      if (!this.scene.character.isActive || this.isCrashing) {
        return;
      }

      this.crash();
      // if we collided with the player
      if (isPlayerCollision(collisionInfo)) {
      }
    });
  }
  private crash() {
    clearTimeout(animTimeout);
    this.isCrashing = true;
    this.sprite.anims.stop();
    this.sprite.anims.play('fallingPlatformCrash');
    this.scene.soundManager.brokenPlatform.play();
    setTimeout(() => {
      this.sprite.setStatic(false);
      // this.sprite.setSensor(true);
      this.sprite.setActive(false);
      // this.sprite.destroy();
      setTimeout(() => {
        this.sprite.destroy();
      }, 1000);
    }, crashDelay);
  }
}
