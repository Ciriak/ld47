import 'phaser';
import { isPlayerCollision } from '../utils';
import GameplayEntitie, { gameplayItemName } from './GameplayEntitie';
export default class Spike extends GameplayEntitie {
  name: gameplayItemName = 'spike';
  sensor = true;
  add() {
    super.add();
    this.sprite.setBody({
      type: 'circle',
      radius: 6,
    });

    this.sprite.setStatic(true);
    this.sprite.setSensor(true);
    this.sprite.setOnCollide((collisionInfo: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      // if we collided with the player

      if (isPlayerCollision(collisionInfo)) {
        this.scene.character.kill();
      }
    });
  }
}
