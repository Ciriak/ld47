import 'phaser';
import MainScene from '../scenes/MainScene';
export type gameplayItemName = 'start' | 'end' | 'spike' | 'bumber';

export const gameplayItemsIndex: {
  [key: string]: number;
} = {
  start: 34,
  end: 38,
  spike: 0,
};

const offset = 16;
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
    this.sprite = this.scene.matter.add.sprite(
      this.tileItem.pixelX + offset,
      this.tileItem.pixelY + offset,
      'gameplay',
      gameplayItemsIndex[this.name],
      {
        isSensor: this.tileItem.properties.sensor,
        isStatic: true,
      }
    );
  }
}
