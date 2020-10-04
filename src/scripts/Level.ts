import 'phaser';
import MainScene from './scenes/MainScene';
import GameplayEntitie, { gameplayItemName, gameplayItemsIndex } from './entities/GameplayEntitie';
import Spike from './entities/Spike';
import SpawnPoint from './entities/SpawnPoint';
import EndPoint from './entities/EndPoint';
import Bumper from './entities/Bumper';
import Bloc from './entities/Bloc';
import FallingPlatform from './entities/FallingPlatform';
import Cannon from './entities/Cannon';

export default class Level {
  public currentLevel: number;
  private scene: MainScene;
  private map: Phaser.Tilemaps.Tilemap;
  private backgroundLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private backgroundLayerDecorations: Phaser.Tilemaps.StaticTilemapLayer;
  private levelMapLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  private layoutLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  public gameplayItems: GameplayEntitie[] = [];
  constructor(scene: MainScene) {
    this.currentLevel = 0;
    this.scene = scene;
    // const tileset = this.map.addTilesetImage('tileset', null, 32, 32, 1, 2);
    this.map = this.scene.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
    this.map.addTilesetImage('tileset', 'tileset');
    this.backgroundLayer = this.map.createStaticLayer('background', 'tileset');
    this.backgroundLayerDecorations = this.map.createStaticLayer('background-decoration', 'tileset');
    this.layoutLayer = this.map.createDynamicLayer('layout', 'tileset');
    this.layoutLayer.setCollisionByExclusion([-1]);
    this.scene.matter.world.convertTilemapLayer(this.layoutLayer);

    this.generateLevel(this.currentLevel);
  }

  public setLevel(level: number) {
    this.currentLevel = level;

    this.generateLevel(this.currentLevel);
  }

  private generateLevel(level: number) {
    // tslint:disable-next-line: no-console
    console.log('Generating level ' + level);

    this.cleanLevel();
    this.levelMapLayer = this.map.getLayer(`level${level}`)?.tilemapLayer as Phaser.Tilemaps.DynamicTilemapLayer;
    if (!this.levelMapLayer) {
      this.levelMapLayer = this.map.createDynamicLayer(`level${level}`, 'tileset');
    }

    this.levelMapLayer.setVisible(false);

    const gameplayTiles: Phaser.Tilemaps.Tile[] = [];

    // detect all gameplay elements
    this.levelMapLayer.forEachTile((tile) => {
      if (tile.index > -1) {
        gameplayTiles.push(tile);
      }
    });

    for (const gameplayItem of gameplayTiles) {
      this.generateGameplayItem(gameplayItem, gameplayItem.properties?.gameplay);
    }

    // add the items to the map
    for (const gameplayItem of this.gameplayItems) {
      gameplayItem.add();
    }
  }

  /**
   * Remove all the entities from the level
   */
  private cleanLevel() {
    for (const entitie of this.gameplayItems) {
      entitie.onDestroy();
      entitie.sprite.destroy(true);
    }

    this.gameplayItems = [];
  }

  private generateGameplayItem(item: Phaser.Tilemaps.Tile, type: gameplayItemName) {
    if (!type || typeof gameplayItemsIndex[type] === 'undefined') {
      // if it's not a gameplay item
      this.gameplayItems.push(new Bloc(this.scene, item));
      return;
    }

    switch (type) {
      case 'start':
        this.gameplayItems.push(new SpawnPoint(this.scene, item));
        break;
      case 'end':
        this.gameplayItems.push(new EndPoint(this.scene, item));
        break;
      case 'spike':
        this.gameplayItems.push(new Spike(this.scene, item));
        break;
      case 'bumper':
        this.gameplayItems.push(new Bumper(this.scene, item));
        break;
      case 'fallingPlatform':
        this.gameplayItems.push(new FallingPlatform(this.scene, item));
        break;
      case 'cannon':
        this.gameplayItems.push(new Cannon(this.scene, item));
        break;

      default:
        break;
    }
  }

  /**
   * Return the coordinates of the spawn point of the current level
   */
  public getSpawnPoint(): { x: number; y: number } {
    // add the items to the map
    for (const gameplayItem of this.gameplayItems) {
      if (gameplayItem.name === 'start') {
        return {
          x: gameplayItem.sprite.x,
          y: gameplayItem.sprite.y,
        };
      }
    }
  }

  public update() {}
}
