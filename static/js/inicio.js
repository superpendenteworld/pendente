import { playgame } from "./playgame.js";
export { inicio };

var setupSceneInput;
var inicio = new Phaser.Scene("SceneA");

inicio.preload = function() {
  //this.load.audio("theme", ["assets/theme.ogg", "assets/theme.mp3"]);

  this.load.image("Start", "assets/start.png");
};
inicio.create = function() {
  //console.log("SceneA");

  this.add.image(400, 300, "Start");

  var theme = this.sound.add("theme");

  if (this.sound.locked) {
    this.sound.once(
      "unlocked",
      function(soundManager) {
        setupSceneInput.call(this, theme);
      },
      this
    );
  } else {
    setupSceneInput.call(this, theme);
  }
};

setupSceneInput = function(theme) {
  this.input.once(
    "pointerup",
    function() {
      theme.stop();
      this.scene.start(playgame);
    },
    this
  );
};
