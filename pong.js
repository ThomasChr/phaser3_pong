/* this is our game basic config */
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

/* send the basic config to phaser */
new Phaser.Game(config);

function preload()
{
    /* Set global variables */
    this.game.points = 0;
    this.game.lost = 0;

    /* preload images */
    this.load.image('paddle', 'sprites/paddle.png');
    this.load.image('ball', 'sprites/ball.png');
}

function create()
{
    /* create and initialize the game */
    /* set the world bounds so we can bounce (the ball) and collide (the paddels) at the upper and lower bounds */
    this.physics.world.setBounds(0, 0, this.game.config.width, this.game.config.height, false, false, true, true);

    /* first the paddles */
    this.lPaddle = this.physics.add.sprite(10, 300, 'paddle');
    this.lPaddle.setCollideWorldBounds(true);
    this.lPaddle.body.immovable = true;

    this.rPaddle = this.physics.add.sprite(790, 300, 'paddle');
    this.rPaddle.setCollideWorldBounds(true);
    this.rPaddle.body.immovable = true;

    /* now the ball */
    this.ball = this.physics.add.sprite(400, 300, 'ball');
    this.ball.setCollideWorldBounds(true);
    this.ball.onWorldBounds = true;
    this.ball.setBounce(1);
    /* let it move! */
    let ballVelocity = this.physics.velocityFromAngle(Phaser.Math.Between(140, 220), Phaser.Math.Between(200, 800))
    this.ball.setVelocity(ballVelocity.x, ballVelocity.y);

    /* Make sure we collide with the paddles */
    this.physics.add.collider(this.ball, this.lPaddle, lPaddleCollide.bind(this));
    this.physics.add.collider(this.ball, this.rPaddle, rPaddleCollide.bind(this));

    /* Initialize the keys */
    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

    /* Show the score */
    this.pointsText = this.add.text(16, 16, 'Points: 0', { fontSize: '32px', fill: '#FF0000' });
}

function update()
{
    if (!this.game.lost) {
        /* check if lost */
        if (this.ball.x < 0) {
            this.game.lost = 1;
            this.ball.velocity = 0;
            this.add.text(300, 300, '*** YOU LOST ***', { fontSize: '32px', fill: '#FF0000' });
        }

        /* react to key presses */
        if (this.upKey.isDown) {
            this.lPaddle.y -= 10;
        }
        if (this.downKey.isDown) {
            this.lPaddle.y += 10;
        }

        /* move the computer paddle */
        this.rPaddle.y = this.ball.y;
    }
}

function lPaddleCollide()
{
    /* We got a point */
    this.game.points++;
    this.pointsText.setText('Points: ' + this.game.points);

    let ballVelocity = this.physics.velocityFromAngle(Phaser.Math.Between(-40, 40), Phaser.Math.Between(200, 800))
    this.ball.setVelocity(ballVelocity.x, ballVelocity.y);
}

function rPaddleCollide()
{
    let ballVelocity = this.physics.velocityFromAngle(Phaser.Math.Between(140, 220), Phaser.Math.Between(200, 800))
    this.ball.setVelocity(ballVelocity.x, ballVelocity.y);
}