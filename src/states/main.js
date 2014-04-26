// states/main.js
var
GeoPattern = require('geopattern'),
pattern = GeoPattern.generate(Date().toLocaleString());

console.log(pattern);

var main = function(game) {
};

// Load images and sounds
main.prototype.preload = function() {
    this.game.load.image('ground', './assets/gfx/ground.png');
    this.game.load.image('player', './assets/gfx/player.png');
};

// Setup the example
main.prototype.create = function() {
    // Set stage background to something sky colored
    // this.game.stage.backgroundColor = 0x4488cc;

    // Define movement constants
    this.MAX_SPEED = 250; // pixels/second
    this.ACCELERATION = 600; // pixels/second/second
    this.DRAG = 400; // pixels/second
    this.GRAVITY = 980; // pixels/second/second
    this.JUMP_SPEED = -300; // pixels/second (negative y is up)

    // Create a player sprite
    this.player = this.game.add.sprite(this.game.width/2, this.game.height - 64, 'player');

    // Enable physics on the player
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

    // Make player collide with world boundaries so he doesn't leave the stage
    this.player.body.collideWorldBounds = true;

    // Set player minimum and maximum movement speed
    this.player.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10); // x, y

    // Add drag to the player that slows them down when they are not accelerating
    this.player.body.drag.setTo(this.DRAG, 0); // x, y

    // Since we're jumping we need gravity
    this.game.physics.arcade.gravity.y = this.GRAVITY;

    // Create some ground for the player to walk on
    this.ground = this.game.add.group();
    for(var x = 0; x < this.game.width; x += 32) {
        // Add the ground blocks, enable physics on each, make them immovable
        var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'ground');
        this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
        groundBlock.body.immovable = true;
        groundBlock.body.allowGravity = false;
        this.ground.add(groundBlock);
    }

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
    this.game.physics.arcade.collide(this.player, this.ground);

    if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        // If the LEFT key is down, set the player velocity to move left
        this.player.body.acceleration.x = -this.ACCELERATION;
    } else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        // If the RIGHT key is down, set the player velocity to move right
        this.player.body.acceleration.x = this.ACCELERATION;
    } else {
        this.player.body.acceleration.x = 0;
    }

    // Set a variable that is true when the player is touching the ground
    var onTheGround = this.player.body.touching.down;

    if (onTheGround && this.input.keyboard.justPressed(Phaser.Keyboard.UP)) {
        // Jump when the player is touching the ground and the up arrow is pressed
        this.player.body.velocity.y = this.JUMP_SPEED;
    }
};

module.exports = main;
