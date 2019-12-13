//codesandbox.io/s/static-jof3f
var player;
var player2;
var moedas;
var bombs;
var cursors;
var scorePlayer1 = 0;
var scorePlayer2 = 0;
var gameOver = false;
var scoreText;
var musica;
var playcoin;
var playdead;
var keyA;
var keyW;
var keyD;
var playgame = new Phaser.Scene("playgame");
var scoreText2;
var layer1;
var layer2;
var layer3
var map;
var tileset64x64;
var sky;
var tileset2

playgame.preload = function() {
  this.load.image("bomb", "assets/bomb.png");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 50,
    frameHeight: 60
  });
  this.load.spritesheet("martchelo", "assets/martchelo.png", {
    frameWidth: 50,
    frameHeight: 60
  });
  this.load.image("moeda", "assets/moeda.png");
  this.load.audio("sound", "assets/sound.ogg");
  this.load.audio("soundcoin", "assets/soundcoin.mp3");
  this.load.audio("deadsound", "assets/deadsound.mp3");
  this.load.spritesheet("fullscreen", "assets/fullscreen.png", {
    frameWidth: 64,
    frameHeight: 64
  });
  this.load.tilemapTiledJSON("gamemap", "assets/map/trabalho.json");
  this.load.image("tileset64x64", "assets/map/tileset64x64.png");
  this.load.image("sky", "assets/map/tilesetOpenGameBackground.png");
  this.load.image("tileset2", "assets/map/tileset2.png");
};

playgame.create = function() {
  // Mapa e colisões

  map = this.add.tilemap("gamemap");
  sky = map.addTilesetImage("tilesetOpenGameBackground", "sky");
  tileset64x64 = map.addTilesetImage("tileset64x64", "tileset64x64");
  tileset2 = map.addTilesetImage("tileset2", "tileset2")
  // layers
  layer2 = map.createStaticLayer("background 1", [sky], 0, 0);
  layer1 = map.createStaticLayer("background collider", [tileset64x64], 0, 0);
  layer3 = map.createStaticLayer("background collider 2", [tileset2], 0, 0);
  // Adicionar música de fundo
  musica = this.sound.add("sound");
  playcoin = this.sound.add("soundcoin");
  playdead = this.sound.add("deadsound");

  //Movimentação da camera
  this.cameras.main.setBounds(0, 0, 12800, 600);
  this.physics.world.setBounds(0, 0, 12800, 600);

  // posição personagem
  player = this.physics.add.sprite(100, 200, "dude");
  player2 = this.physics.add.sprite(150, 200, "martchelo");

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  player2.setBounce(0.2);
  player2.setCollideWorldBounds(true);

  this.cameras.main.startFollow(player, true, 0.05, 0.05);
  this.cameras.main.startFollow(player2, true, 0.05, 0.05);

  //player 1

  this.anims.create({
    key: "left-dude",
    frames: this.anims.generateFrameNumbers("dude", {
      start: 1,
      end: 3
    }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: "turn-dude",
    frames: [{ key: "dude", frame: 0 }],
    frameRate: 20
  });

  this.anims.create({
    key: "right-dude",
    frames: this.anims.generateFrameNumbers("dude", { start: 4, end: 6 }),
    frameRate: 10,
    repeat: -1
  });

  //player 2

  this.anims.create({
    key: "left-martchelo",
    frames: this.anims.generateFrameNumbers("martchelo", {
      start: 1,
      end: 3
    }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: "turn-martchelo",
    frames: [{ key: "martchelo", frame: 0 }],
    frameRate: 20
  });

  this.anims.create({
    key: "right-martchelo",
    frames: this.anims.generateFrameNumbers("martchelo", { start: 4, end: 6 }),
    frameRate: 10,
    repeat: -1
  });

  //  Input Events
  cursors = this.input.keyboard.createCursorKeys();

  //  Some moeda to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
  moedas = this.physics.add.group({
    key: "moeda",
    repeat: 200,
    setXY: { x: 12, y: 0, stepX: 75 }
  });

  bombs = this.physics.add.group();

  //  The score
  scoreText = this.add.text(16, 16, "Pendente: 0", {
    fontSize: "32px",
    fill: "#000"
  });
  scoreText.setScrollFactor(0);

  scoreText2 = this.add.text(300, 16, "Reprovado: 0", {
    fontSize: "32px",
    fill: "#000"
  });
  scoreText2.setScrollFactor(0);

  // fulscreen
  var button = this.add
    .image(800 - 16, 16, "fullscreen", 0)
    .setOrigin(1, 0)
    .setInteractive()
    .setScrollFactor(0, 0);

  button.on(
    "pointerup",
    function() {
      if (this.scale.isFullscreen) {
        button.setFrame(0);

        this.scale.stopFullscreen();
      } else {
        button.setFrame(1);

        this.scale.startFullscreen();
      }
    },
    this
  );

  var FKey = this.input.keyboard.addKey("F");

  FKey.on(
    "down",
    function() {
      if (this.scale.isFullscreen) {
        button.setFrame(0);
        this.scale.stopFullscreen();
      } else {
        button.setFrame(1);
        this.scale.startFullscreen();
      }
    },
    this
  );

  //  Collide the player and the stars with the platforms
  layer1.setCollisionByProperty({ collides: true });
  layer3.setCollisionByProperty({ collides: true });
  this.physics.add.collider(player, layer1); //, checkKill, null, this);
  this.physics.add.collider(player, layer3, checkKill, null, this);
  this.physics.add.collider(player2, layer3, checkKill, null, this);
  this.physics.add.collider(player2, layer1); //, checkKill, null, this);
  this.physics.add.collider(moedas, layer1);

  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  this.physics.add.overlap(player, moedas, collectMoeda, null, this);
  this.physics.add.overlap(player2, moedas, collectMoeda, null, this);
  this.physics.add.collider(bombs, layer1);
  this.physics.add.collider(player, bombs, hitBomb, null, this);
  this.physics.add.collider(player2, bombs, hitBomb, null, this);

  musica.setLoop(true).play();

  keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
};

playgame.update = function() {
  if (gameOver) {
    return;
  }

  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play("left-dude", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);

    player.anims.play("right-dude", true);
  } else {
    player.setVelocityX(0);

    player.anims.play("turn-dude");
  }

  if (keyA.isDown) {
    player2.setVelocityX(-160);

    player2.anims.play("left-martchelo", true);
  } else if (keyD.isDown) {
    player2.setVelocityX(160);

    player2.anims.play("right-martchelo", true);
  } else {
    player2.setVelocityX(0);

    player2.anims.play("turn-martchelo");
  }

  if (cursors.up.isDown && player.body.blocked.down) {
    player.setVelocityY(-330);
  }
  if (keyW.isDown && player2.body.blocked.down) {
    player2.setVelocityY(-330);
  }
};
function collectMoeda(player, moeda) {
  moeda.disableBody(true, true);
  var playerName = player.anims.currentFrame.textureKey;
  //  Add and update the score
  if (playerName === "dude") {
    scorePlayer1 += 10;
    scoreText.setText("Pendente: " + scorePlayer1);
  } else {
    scorePlayer2 += 10;
    scoreText2.setText("Reprovado: " + scorePlayer2);
  }

  if (moedas.countActive() % 5 === 0) {
    var x = Phaser.Math.Between(player.x - 100, player.x + 100);

    var bomb = bombs.create(x, 5, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
  }
  playcoin.play();
}

function hitBomb(player, bomb) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play("turn-dude");

  gameOver = true;
  musica.stop();
  playdead.play();
}

function checkKill(player, layer3) {
  if (layer1.kill === true) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play("turn-dude");
    gameOver = true;
    musica.stop();
    playdead.play();
  }
}

export { playgame };
