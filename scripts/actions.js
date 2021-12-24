function collectCan (player, can)
{

    console.log("executing collectCan()...");

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

    console.log("executing hitshark()...");

    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}