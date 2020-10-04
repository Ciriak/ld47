import GameplayEntitie, { gameplayItemName } from './GameplayEntitie';
export default class EndPoint extends GameplayEntitie {
  name: gameplayItemName = 'end';
  add() {
    super.add();

    this.sprite.setOnCollide((collisionInfo: any) => {
      // if we collided with the player
      if (collisionInfo.bodyB.gameObject.getData('isPlayer')) {
        this.scene.nextLevel();
      }
    });
  }
}
