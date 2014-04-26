// states/main.js



var main = function(game) {
};

// Load images and sounds
main.prototype.preload = function() {

    this.player = {};
    this.player.height = 92;
    this.player.width = 636/6;

    this.game.load.image('ground', './assets/gfx/ground.png');
    this.game.load.spritesheet('players', './assets/gfx/avatar.png', this.player.width, this.player.height);

    // this.data = {};
    // this.data.player = {};
    // this.data.player.height = 105;
    // this.data.player.width = 92;

    // Define movement constants
    this.MAX_SPEED = 250; // pixels/second
    this.ACCELERATION = 600; // pixels/second/second
    this.DRAG = 400; // pixels/second
    this.GRAVITY = 980; // pixels/second/second
    this.JUMP_SPEED = -300; // pixels/second (negative y is up)

};

// Setup the example
main.prototype.create = function() {

    // Set stage background to something sky colored
    // this.game.stage.backgroundColor = 0x4488cc;

    // Create some ground for the player to walk on
    this.ground = this.game.add.group();
    this.ground.data = {};
    this.ground.data.height = 32;
    this.ground.data.offset = 32/2;

    var
    // ground
    ground_bound_offset = 32/2;

    for(var x = 0; x < this.game.width; x += 32) {

        // Add the ground blocks, enable physics on each, make them immovable
        var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'ground');

        this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
        groundBlock.body.immovable = true;
        groundBlock.body.allowGravity = false;

        // change ground collision bounds
        groundBlock.body.setSize(32, 32 - ground_bound_offset, 0, ground_bound_offset);

        this.ground.add(groundBlock);
    }


    // Create players
    var player_pos_y = this.game.height - this.player.height - ground_bound_offset;

    this.player.one = this.game.add.sprite(this.game.width/2, player_pos_y, 'players', 0);
    this.player.two = this.game.add.sprite(this.game.width/2-200, player_pos_y, 'players', 7);



    // this.player_one.scale.setTo(0.7, 0.7);
    // this.player_two.scale.setTo(0.7, 0.7);


    // Enable physics on the players
    this.game.physics.enable(this.player.one, Phaser.Physics.ARCADE);
    this.game.physics.enable(this.player.two, Phaser.Physics.ARCADE);


    // Make player collide with world boundaries so he doesn't leave the stage
    this.player.one.body.collideWorldBounds = true;
    this.player.two.body.collideWorldBounds = true;



    // Set player minimum and maximum movement speed
    this.player.one.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10); // x, y

    // Add drag to the player that slows them down when they are not accelerating
    this.player.one.body.drag.setTo(this.DRAG, 0); // x, y

    // Since we're jumping we need gravity
    this.game.physics.arcade.gravity.y = this.GRAVITY;



    // Capture certain keys to prevent their default actions in the browser.
    // This is only necessary because this is an HTML5 game. Games on other
    // platforms may not need code like this.
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN
    ]);


    // Show FPS
    this.game.time.advancedTiming = true;
    this.fpsText = this.game.add.text(
        20, 20, '', { font: '16px Arial', fill: '#ffffff' }
    );
};

// The update() method is called every frame
main.prototype.update = function() {


    if (this.game.time.fps !== 0) {
        this.fpsText.setText(this.game.time.fps + ' FPS');
    }

    // Collide the player with the ground
    this.game.physics.arcade.collide(this.player.one, this.ground);
    this.game.physics.arcade.collide(this.player.two, this.ground);

    this.player.one.body.acceleration.x = -this.ACCELERATION;


    if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        // If the LEFT key is down, set the player velocity to move left
        this.player.one.body.acceleration.x = -this.ACCELERATION;
    } else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        // If the RIGHT key is down, set the player velocity to move right
        this.player.one.body.acceleration.x = this.ACCELERATION;
    } else {
        this.player.one.body.acceleration.x = 0;
        // this.player.one.body.acceleration.x = -this.ACCELERATION;
    }

    // Set a variable that is true when the player is touching the ground
    var onTheGround = this.player.one.body.touching.down;

    if (onTheGround && this.input.keyboard.justPressed(Phaser.Keyboard.UP)) {
        // Jump when the player is touching the ground and the up arrow is pressed
        // this.player.body.velocity.y = this.JUMP_SPEED;
    }
};

module.exports = main;
