var config = {
    type: Phaser.AUTO,
    title: 'Get the Gansett',
    // Responsive canvas: https://stackoverflow.com/questions/51518818/how-to-make-canvas-responsive-using-phaser-3
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-gansett',
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
    },
    scene: {
        preload: preload,
        create: create,
        update: update
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

function preload ()
{
    this.load.image('boyz', '../assets/boyz.png');
    this.load.image('sky', '../assets/sky.png');
    this.load.image('ground', '../assets/platform.png');
    this.load.image('can', '../assets/can.png');
    this.load.image('shark', '../assets/shark.png');
    this.load.spritesheet('ckdude', '../assets/ckdude.png', { frameWidth: 32, frameHeight: 48 });

}

function create ()
{
    // Title Image and text
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

function collectCan (player, can)
{
    can.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Gansetts: ' + score);

    if (cans.countActive(true) === 0)
    {
        //  A new batch of cans to collect
        cans.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var shark = sharks.create(x, 16, 'shark');
        shark.setBounce(1);
        shark.setCollideWorldBounds(true);
        shark.setVelocity(Phaser.Math.Between(-200, 200), 20);
        shark.allowGravity = false;

    }
}

function hitshark (player, shark)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}