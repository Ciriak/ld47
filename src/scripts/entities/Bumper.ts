import { isPlayerCollision } from '../utils';
import GameplayEntitie, { gameplayItemName, gameplayItemsIndex, offset } from './GameplayEntitie';
const force = 10;
export default class Bumper extends GameplayEntitie {
  add() {
    // **note** for some reason we need to substract the index by 1
    this.sprite = this.scene.matter.add.sprite(this.tileItem.pixelX + offset, this.tileItem.pixelY + offset, 'tileset', gameplayItemsIndex.bumper, {
      isStatic: true,
      isSensor: true,
    });

    this.sprite.setOnCollide((collisionInfo: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      // if we collided with the player
      if (isPlayerCollision(collisionInfo)) {
        // alway provide a jump to the player
        this.scene.character.canJump = true;
        this.scene.character.entitie.setVelocityY(-force);
        this.scene.soundManager.bumperJump.play();
      }
    });

    this.sprite.anims.play('bumperIdle');
  }
}
