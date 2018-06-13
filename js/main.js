let socket = io.connect();
//this game will have only 1 state
let GameState = {
  //initiate game settings
  init() {
    //adapt to screen size, fit all the game
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1000;
    this.game.world.setBounds(0, 0, 360, 700);

    this.RUNNING_SPEED = 180;
    this.JUMPING_SPEED = 530;

    this.socket = socket;
  },
  //load the game assets before the game starts
  preload() {
    this.load.image("ground", "assets/images/ground.png");
    this.load.image("platform", "assets/images/platform.png");
    this.load.image("goal", "assets/images/gorilla3.png");
    this.load.image("arrowButton", "assets/images/arrowButton.png");
    this.load.image("actionButton", "assets/images/actionButton.png");
    this.load.image("barrel", "assets/images/barrel.png");

    this.load.spritesheet(
      "player",
      "assets/images/player_spritesheet.png",
      28,
      30,
      5,
      1,
      1
    );
    this.load.spritesheet(
      "fire",
      "assets/images/fire_spritesheet.png",
      20,
      21,
      2,
      1,
      1
    );

    this.load.text("level", "assets/data/level.json");
  },
  //executed after everything is loaded
  create() {

    this.movingRight = false;
    this.movingLeft = false;
    this.ground = this.add.sprite(0, 638, "ground");
    this.game.physics.arcade.enable(this.ground);
    this.ground.body.allowGravity = false;
    this.ground.body.immovable = true;


    var UPDATE_TIME = 175;
    this.updateMovementTimer = game.time.events.add(UPDATE_TIME, this.checkForMovement, this);
    //parse the file
    this.levelData = JSON.parse(this.game.cache.getText("level"));

    this.platforms = this.add.group();
    this.platforms.enableBody = true;

    this.levelData.platformData.forEach(function(element) {
      this.platforms.create(element.x, element.y, "platform");
    }, this);

    this.platforms.setAll("body.immovable", true);
    this.platforms.setAll("body.allowGravity", false);

    //fires
    this.fires = this.add.group();
    this.fires.enableBody = true;

    let fire;
    this.levelData.fireData.forEach(function(element) {
      fire = this.fires.create(element.x, element.y, "fire");
      fire.animations.add("fire", [0, 1], 4, true);
      fire.play("fire");
    }, this);

    this.fires.setAll("body.allowGravity", false);

    //goal
    this.goal = this.add.sprite(
      this.levelData.goal.x,
      this.levelData.goal.y,
      "goal"
    );
    this.game.physics.arcade.enable(this.goal);
    this.goal.body.allowGravity = false;

    //create player
    this.player = this.add.sprite(
      this.levelData.playerStart.x,
      this.levelData.playerStart.y,
      "player",
      3
    );
    this.player.anchor.setTo(0.5);
    this.player.animations.add("walking", [0, 1, 2, 1], 6, true);
    this.game.physics.arcade.enable(this.player);
    this.player.customParams = {};
    this.player.body.collideWorldBounds = true;

    this.game.camera.follow(this.player);


    this.barrels = this.add.group();
    this.barrels.enableBody = true;

    this.createBarrel();
    this.barrelCreator = this.game.time.events.loop(
      Phaser.Timer.SECOND * this.levelData.barrelFrequency,
      this.createBarrel,
      this
    );
  },

  checkForMovement() {

    this.socket.on("stopped", () => {
      this.isMovingRight = false;
      this.isMovingLeft = false;
      this.player.customParams.isMovingLeft = false;
      this.player.customParams.isMovingRight = false;
      this.player.customParams.mustJump = false;
    })

    this.socket.on("jumped", () => {
      this.player.customParams.mustJump = true;
    });

    this.socket.on("nojump", () => this.player.customParams.mustJump = false)
    
    this.socket.on('movedRight', () => {

     this.isMovingRight  = true;
     this.isMovingLeft = false;
     this.player.customParams.isMovingLeft = false;
     this.player.customParams.isMovingRight = true;
      //console.log("right");
    })
    this.socket.on('movedLeft', () => {
      this.isMovingRight = false;
      this.isMovingLeft = true;
      this.player.customParams.isMovingLeft = true;
      this.player.customParams.isMovingRight = false;
      //console.log("left");
    })

  },

  moveToRight() {
    this.player.customParams.isMovingRight = true;
    this.player.customParams.isMovingLeft = false;
    this.player.body.velocity.x = this.RUNNING_SPEED;
      this.player.scale.setTo(-1, 1);
      this.player.play("walking");
  },
  moveToLeft() {
    this.player.customParams.isMovingRight = false;
    this.player.customParams.isMovingLeft = true;
    this.player.body.velocity.x = -this.RUNNING_SPEED;
    this.player.scale.setTo(1, 1);
    this.player.play("walking");

  },

  update() {
    this.speed = 6;
    this.prevX = 508;
    this.player.animations.stop();
    this.player.frame = 3;
    this.game.physics.arcade.collide(this.player, this.ground);
    this.game.physics.arcade.collide(this.player, this.platforms);
    this.game.physics.arcade.collide(this.barrels, this.ground);
    this.game.physics.arcade.collide(this.barrels, this.platforms);
    this.game.physics.arcade.overlap(this.player, this.fires, this.killPlayer);
    this.game.physics.arcade.overlap(
      this.player,
      this.barrels,
      this.killPlayer
    );
    this.game.physics.arcade.overlap(this.player, this.goal, this.win);
    this.player.body.velocity.x = 0;

    if ( this.isMovingLeft ) {
      this.player.body.velocity.x = -this.RUNNING_SPEED;
      this.player.scale.setTo(1, 1);
      this.player.play("walking");
    } else if (
      this.isMovingRight
    ) {
      this.player.body.velocity.x = this.RUNNING_SPEED;
      this.player.scale.setTo(-1, 1);
      this.player.play("walking");
    } else {
      this.player.animations.stop();
      this.player.frame = 3;
    }
    if (
      ( this.player.customParams.mustJump ) &&
      this.player.body.touching.down
    ) {
      this.player.body.velocity.y = -this.JUMPING_SPEED;
      //this.player.customParams.mustJump = false;
    }

    this.barrels.forEach(function(element) {
      if (element.x < 10 && element.y > 600) {
        element.kill();
      }
    }, this);
  },
  
  killPlayer(player, fire) {
    console.log("ouch!");
    game.state.start("Game");
    socket.emit("gameOver");
    //this.game(); ???
  },
  win(player, goal) {
    alert("you win!");
    game.state.start("Game");
    socket.emit("won");
    this.game();
  },
  createBarrel() {
    //give me the first dead sprite
    let barrel = this.barrels.getFirstExists(false);

    if (!barrel) {
      barrel = this.barrels.create(0, 0, "barrel");
    }
    barrel.body.collideWorldBounds = true;
    barrel.body.bounce.set(1, 0);

    barrel.reset(this.levelData.goal.x, this.levelData.goal.y);
    barrel.body.velocity.x = this.levelData.barrelSpeed;
  },
  finishGame() {
    this.socket.emit("gamefinished")
  }
};

let titlescreen;
let Game = {
    preload: function(game){
        this.load.image("background","assets/images/background.jpg");
        this.load.image("button1", "assets/buttons/button1.png");
        this.load.image("button2", "assets/buttons/button2.png");
    },
    create: function (game) {
        let background = game.add.tileSprite(0, 0, 360, 600, 'background');
        this.createButton(game, "Play", game.world.centerX, game.world.centerY , 150, 50, function () {
            this.state.start("GameState");
        });
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    },
    createButton: function (game, string, x, y, w, h, callback) {
        let button1 = game.add.button(x, y + 120, 'button1', callback, this, 2, 1, 0);
        button1.anchor.setTo(0.5, 0.5);
        button1.width = w;
        button1.height = h;
        let text = game.add.text(button1.x, button1.y, string, {
            font: '20px Arial',
            fill: "#000000", align: "center"
        });
        text.anchor.setTo(0.5, 0.5);
        button1.onInputOver.add(over , this);
        button1.onInputOut.add(out, this);
        function over(button) {
            button.loadTexture('button2')
        }
        function out(button) {
            button.loadTexture('button1')
        }
    }

};
let game = new Phaser.Game(360, 592, Phaser.AUTO);
game.state.add("Game", Game);
game.state.add("GameState", GameState);
game.state.start("Game");

