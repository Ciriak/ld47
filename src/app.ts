import MainScene from "./scripts/scenes/MainScene";
import "./styles/style.scss";
import "phaser";

const gameConfig: Phaser.Types.Core.GameConfig = {
  backgroundColor: "#212121",
  width: 1280,
  height: 800,
  parent: "game",

  render: {
    pixelArt: true,
  },
  physics: {
    default: "matter",
    matter: {
      debug: true,
    },
  },
  scene: [MainScene],
  type: Phaser.AUTO,
};
// tslint:disable-next-line: no-unused-expression
new Phaser.Game(gameConfig);
