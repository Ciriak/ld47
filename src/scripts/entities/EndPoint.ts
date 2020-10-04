import { isPlayerCollision } from '../utils';
import GameplayEntitie, { gameplayItemName, gameplayItemsIndex, offset } from './GameplayEntitie';

export default class EndPoint extends GameplayEntitie {
  name: gameplayItemName = 'end';
  particle: Phaser.GameObjects.Particles.ParticleEmitterManager;
  emmiter: Phaser.GameObjects.Particles.ParticleEmitter;
  add() {
    // **note** for some reason we need to substract the index by 1
    this.sprite = this.scene.matter.add.sprite(this.tileItem.pixelX + offset, this.tileItem.pixelY + offset, 'tileset', gameplayItemsIndex.end, {
      isStatic: true,
      isSensor: true,
    });

    this.sprite.setOnCollide((collisionInfo: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      if (!this.scene.character.isActive) {
        return;
      }
      // if we collided with the player
      if (isPlayerCollision(collisionInfo)) {
        this.sprite.setToSleep();
        this.scene.nextLevel();
      }
    });

    this.particle = this.scene.add.particles('tileset', 66, {});

    this.emmiter = this.particle.createEmitter({
      x: this.sprite.x,
      y: this.sprite.y,
      lifespan: 1000,
      speed: { min: 1, max: 20 },

      scale: { start: 0.4, end: 0 },
      quantity: 0.5,
      blendMode: 'ADD',
    });

    this.sprite.anims.play('endPointIdle');
  }

  onDestroy() {
    this.particle.removeEmitter(this.emmiter);
    this.particle.destroy();
  }
}
