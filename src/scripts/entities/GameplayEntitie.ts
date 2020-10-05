import 'phaser';
import MainScene from '../scenes/MainScene';
export type gameplayItemName = 'start' | 'end' | 'spike' | 'bumper' | 'bloc' | 'fallingPlatform' | 'cannon';

export const gameplayItemsIndex: {
  [key: string]: number;
} = {
  start: 15,
  end: 66,
  spike: 1,
  trigger: 3,
  bumper: 38,
  fallingPlatform: 11,
  cannon: 74,
  projectile: 88,
};

// WHY ??????? WTF MATTER
export const offset = 16;

export default abstract class GameplayEntitie {
  protected tileItem: Phaser.Tilemaps.Tile;
  public name: gameplayItemName;
  protected scene: MainScene;
  public sprite: Phaser.Physics.Matter.Sprite;
  public sensor: boolean;
  constructor(scene: MainScene, tileItem: Phaser.Tilemaps.Tile) {
    this.tileItem = tileItem;
    this.scene = scene;
  }

  public add() {
    const isTrigger: boolean = this.tileItem.properties.isTrigger || false;
    const isProp: boolean = this.tileItem.properties.isProp || false;
    // set a trigger sprite (transparent) if it's a trigger
    let frameIndex = gameplayItemsIndex[this.name] || 0;

    if (isTrigger) {
      frameIndex = gameplayItemsIndex.trigger;
    }

    this.sprite = this.scene.matter.add.sprite(this.tileItem.pixelX + offset, this.tileItem.pixelY + offset, 'tileset', frameIndex, {
      isSensor: isTrigger || isProp,
      isStatic: true,
    });

    // rebuild as a trigger if needed
    if (isTrigger || isProp) {
      this.sprite.setBody({
        type: 'circle',
        radius: 12,
      });
      this.sprite.setSensor(true);
      this.sprite.setStatic(true);
    }
  }

  onDestroy() {}
}
