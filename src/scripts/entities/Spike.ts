import 'phaser';
import GameplayEntitie, { gameplayItemName } from './GameplayEntitie';
export default class Spike extends GameplayEntitie {
  name: gameplayItemName = 'spike';
  sensor = true;
  add() {
    super.add();
    this.sprite.setBody({
      type: 'circle',
      radius: 10,
    });
    this.sprite.setStatic(true);
    this.sprite.setOnCollide((collisionInfo: any) => {
      // if we collided with the player
      if (collisionInfo.bodyB.gameObject.getData('isPlayer')) {
        this.scene.character.kill();
      }
    });
  }
}
