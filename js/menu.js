let Game = {};

Game.MainMenu = function(game){

};

let titlescreen;

Game.MainMenu.prototype = {
    create:function(game){
        this.createButton(game, "Play", game.world.centerX, game.world.centerY + 32, 300, 100, function(){
            this.state.start("GameState");
        });
        titlescreen = game.add.sprite(game.world.centerX, game.world.centerY -192, "titlescreen");
        titlescreen.anchor.setTo(0.5,0.5);
    },
    update:function(game){

    },
    createButton:function(game, string, x, y, w, h, callback){
        let button1 = game.add.button(x, y, 'button', callback, this,2,1,0);
        button1.anchor.setTo(0.5, 0.5);
        button1.width = w;
        button1.height = h;
        let text = game.add.text(button1.x, button1.y, string, {font: '14px Arial',
            fill: "#fff", align: center});
        text.anchor.setTo(0.5, 0.5);
    }
};

let game = new Phaser.Game(360, 592, Phaser.AUTO);

game.state.add("Game", Game);
// game.state.add("GameState", GameState);
game.state.start("Game");