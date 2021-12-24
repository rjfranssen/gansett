// Modified
class gansett extends Phaser.Scene {

    constructor() {
        super({
            key: 'gansett'
        })
    }

    preload ()
    {
        console.log("executing preload()...");

        this.load.image('boyz', 'assets/boyz.png');
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('can', 'assets/can.png');
        this.load.image('shark', 'assets/shark.png');
        this.load.spritesheet('ckdude', 'assets/ckdude.png', { frameWidth: 32, frameHeight: 48 });
        
    }
    
    create ()
    {

        console.log("executing create()...");

        // Title Image and text
        this.add.image(400, 300, 'boyz');
        this.add.text(80, 560, 'Game Title: ' + game.config.gameTitle, { font: '16px Courier', fill: '#ffffff' });
    
        //  A simple background for our game
        this.add.image(400, 300, 'sky');
    
        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = this.physics.add.staticGroup();
    
        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    
        //  Now let's create some ledges
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');
    
        // The player and its settings
        player = this.physics.add.sprite(100, 450, 'ckdude');
    
        //  Player physics properties. Give the little guy a slight bounce.
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
    
        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('ckdude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'ckdude', frame: 4 } ],
            frameRate: 20
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('ckdude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    
        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();
    
        //  Some cans to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
        cans = this.physics.add.group({
            key: 'can',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
    
        cans.children.iterate(function (child) {
    
            //  Give each can a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    
        });
    
        sharks = this.physics.add.group();
    
        //  The score
        scoreText = this.add.text(16, 16, 'Gansetts: 0', { fontSize: '32px', fill: '#000' });
    
        //  Collide the player and the cans with the platforms
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(cans, platforms);
        this.physics.add.collider(sharks, platforms);
    
        //  Checks to see if the player overlaps with any of the cans, if he does call the collectCan function
        this.physics.add.overlap(player, cans, collectCan, null, this);
    
        this.physics.add.collider(player, sharks, hitshark, null, this);
    }
    
    update ()
    {

        console.log("executing update...");

        if (gameOver)
        {
            return;
        }
    
        if (cursors.left.isDown)
        {
            player.setVelocityX(-160);
    
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);
    
            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);
    
            player.anims.play('turn');
        }
    
        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-330);
        }
    }

}


var config = {
    type: Phaser.AUTO,
    title: 'Get the Gansett',
	scene: gansett,
    //scene: {
    //    preload: preload,
    //    create: create,
    //    update: update
    //},
    // Responsive canvas: https://stackoverflow.com/questions/51518818/how-to-make-canvas-responsive-using-phaser-3
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

var player;
var cans;
var sharks;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

var game = new Phaser.Game(config);
