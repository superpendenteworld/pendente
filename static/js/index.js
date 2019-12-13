import { inicio } from "./inicio.js";
import { playgame } from "./playgame.js";

// https://gamedevacademy.org/how-to-make-a-mario-style-platformer-with-phaser-3/
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "game",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  scene: [inicio, playgame]
};

var game = new Phaser.Game(config);
