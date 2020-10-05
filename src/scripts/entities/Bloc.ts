import GameplayEntitie, { gameplayItemName, offset } from './GameplayEntitie';

/**
 * Represent an entitie that is not related to gameplay (like a bloc)
 */
export default class Bloc extends GameplayEntitie {
  name: gameplayItemName = 'bloc';
  add() {
    const isTrigger: boolean = this.tileItem.properties.isTrigger || this.tileItem.properties.isProp || false;

    // **note** for some reason we need to substract the index by 1
    this.sprite = this.scene.matter.add.sprite(this.tileItem.pixelX + offset, this.tileItem.pixelY + offset, 'tileset', this.tileItem.index - 1, {
      isStatic: true,
      isSensor: isTrigger,
    });
  }
}
