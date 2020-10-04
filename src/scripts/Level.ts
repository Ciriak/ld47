import 'phaser';
import MainScene from './scenes/MainScene';
import GameplayEntitie, { gameplayItemName, gameplayItemsIndex } from './entities/GameplayEntitie';
import Spike from './entities/Spike';
import SpawnPoint from './entities/SpawnPoint';
import EndPoint from './entities/EndPoint';

export default class Level {
  public currentLevel: number;
  private scene: MainScene;
  private map: Phaser.Tilemaps.Tilemap;
  private backgroundLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private backgroundLayerDecorations: Phaser.Tilemaps.StaticTilemapLayer;
  private gameplayLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  private levelMapLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  private layoutLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  public gameplayItems: GameplayEntitie[] = [];
  constructor(scene: MainScene) {
    this.currentLevel = 1;
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

    this.levelMapLayer = this.map.createDynamicLayer(`level${level}-map`, 'tileset');
    this.gameplayLayer = this.map.createDynamicLayer(`level${level}-gameplay`, 'tileset');

    const gameplayTiles: Phaser.Tilemaps.Tile[] = [];

    this.gameplayItems = [];

    // generate the collisions from the map layer
    this.levelMapLayer.setCollisionByExclusion([-1]);
    this.scene.matter.world.convertTilemapLayer(this.levelMapLayer, {
      isStatic: true,
    });

    // detect all gameplay elements
    this.gameplayLayer.forEachTile((tile) => {
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

  private generateGameplayItem(item: Phaser.Tilemaps.Tile, type: gameplayItemName) {
    if (typeof gameplayItemsIndex[type] === 'undefined') {
      // tslint:disable-next-line: no-console
      console.warn('Unknown gameplay item : ' + type);
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
