// states/main.js

var _ = require('lodash');


var main = function(game) {
};

// Load images and sounds
main.prototype.preload = function() {

    this.layer = {};
    this.layer.popover = {};

    this.player = {};
    this.player.height = 92;
    this.player.width = 636/6;
    this.player.data = {};

	this.score = 0;
	this.scoreText;

    var one = {};
    one.pos = {};
    one.pos.x = this.game.width - this.player.width;
    one.frame = 0;

    this.player.data.one = one;

    var two = {};
    two.pos = {};
    two.pos.x = this.game.width - this.player.width;
    two.frame = 7;

    this.player.data.two = two;


    this.game.load.spritesheet('players', './assets/gfx/avatar.png', this.player.width, this.player.height);

    // popover stuff
    //this.game.load.image('popover.bg', './assets/gfx/popover/DungeonWall.png');
    // popover buttons
    this.game.load.image('popover.button.sword.lowblow', './assets/gfx/popover/buttons/Low_Blow.png');
    this.game.load.image('popover.button.sword.overheadstrike', './assets/gfx/popover/buttons/Overhead_Strike.png');
    this.game.load.image('popover.button.sword.thrust', './assets/gfx/popover/buttons/Thrust.png');
    this.game.load.image('popover.button.shield', './assets/gfx/popover/buttons/Shield.png');

    // space bg
    this.game.load.image('space.castle.back', './assets/gfx/backgrounds/asset_castleWall_back.png');
    this.game.load.image('space.castle.front', './assets/gfx/backgrounds/asset_castleWall_front.png');
    this.game.load.image('space.bigplanet', './assets/gfx/backgrounds/asset_bigPlanet.png');
    // this.game.load.image('space.rockfield', './assets/gfx/backgrounds/asset_rockLine.png');


    // animation results
    this.game.load.spritesheet('results.blood_spatter', './assets/gfx/results/Blood_Splatter.png', 426/6, 91);
	this.game.load.spritesheet('results.Sword_Slash', './assets/gfx/results/Sword_Slash.png', 523/4, 125);
	this.game.load.spritesheet('results.Block_Animation', './assets/gfx/results/Block_Animation.png', 328/3, 91);
	this.game.load.spritesheet('results.Sword_Clash', './assets/gfx/results/Sword_Clash.png', 278/3, 80);


    // Define movement constants
    this.MAX_SPEED = 125; // pixels/second
    this.ACCELERATION = 600; // pixels/second/second
    this.DRAG = 400; // pixels/second
    this.GRAVITY = 980; // pixels/second/second
    this.JUMP_SPEED = -300; // pixels/second (negative y is up)

    // some font
    this.game.load.bitmapFont('font_48', 'assets/fonts/perfect_dos_vga_437_regular_48.png', 'assets/fonts/perfect_dos_vga_437_regular_48.fnt');
    this.game.load.bitmapFont('font_64', 'assets/fonts/perfect_dos_vga_437_regular_64.png', 'assets/fonts/perfect_dos_vga_437_regular_64.fnt');


};



// Setup the example
main.prototype.create = function() {

    // Set stage background to something sky colored
    // this.game.stage.backgroundColor = 0x4488cc;


    // space bg
    this.layer.space = {};

    this.layer.space.bigplanet = this.game.add.sprite(10, 50, 'space.bigplanet');
    // this.layer.space.rockfield = this.game.add.sprite(0, 100, 'space.rockfield');

    // this.layer.space.castleback.scale.setTo(1, 1);

	//  The score
    this.scoreText = this.game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

	//  Add and update the score
    //this.score += 10;
    this.scoreText.text = 'Score: ' + this.score;




// high - overhead
// medium - thrust
// low - low blow
// Shield raised for all 3 heights, (Raised, Deflect, Low Block)

    var ground_bound_offset = 50;

    // main layer
    this.layer.main = this.game.add.group();

    // space - castle back
    var t_height = this.game.cache.getImage('space.castle.back').height + this.game.cache.getImage('space.castle.front').height*0.83;
    this.layer.space.castleback = this.game.add.tileSprite(0, this.game.height - t_height, this.game.width,
        this.game.cache.getImage('space.castle.back').height, 'space.castle.back', 0, this.layer.main);


    // Create players
    var player_pos_y = this.game.height - this.player.height
        - (this.game.cache.getImage('space.castle.front').height - ground_bound_offset);
    this.player.one = this.game.add.sprite(this.game.width - this.player.width-150, player_pos_y, 'players', 0, this.layer.main);
    this.player.two = this.game.add.sprite(150, player_pos_y, 'players', 7, this.layer.main);



    // space - castle front
    var t_height = this.game.cache.getImage('space.castle.front').height;
    this.layer.space.castlefront = this.game.add.tileSprite(0, this.game.height - t_height, this.game.width,
        t_height, 'space.castle.front', 0, this.layer.main);

    this.game.physics.enable(this.layer.space.castlefront, Phaser.Physics.ARCADE);
    this.layer.space.castlefront.body.immovable = true;
    this.layer.space.castlefront.body.allowGravity = false;


    this.layer.space.castlefront.body.setSize(this.game.width,
        this.game.cache.getImage('space.castle.front').height - ground_bound_offset, 0, ground_bound_offset);



    // this.player_one.scale.setTo(0.7, 0.7);
    // this.player_two.scale.setTo(0.7, 0.7);

    // Add animation
    this.player.one.animations.add('one.idle', [0, 1, 2, 3, 4, 5], 5, true);
    this.player.two.animations.add('two.idle', [6, 7, 8, 9, 10, 11], 5, true);

    this.player.one.animations.play('one.idle');
    this.player.two.animations.play('two.idle');

    // Enable physics on the players
    this.game.physics.enable(this.player.one, Phaser.Physics.ARCADE);
    this.game.physics.enable(this.player.two, Phaser.Physics.ARCADE);


    // Make player collide with world boundaries so he doesn't leave the stage
    this.player.one.body.collideWorldBounds = true;
    this.player.two.body.collideWorldBounds = true;


    // Set player minimum and maximum movement speed
    this.player.one.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10); // x, y
    this.player.two.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10); // x, y

    // Add drag to the player that slows them down when they are not accelerating
    this.player.one.body.drag.setTo(this.DRAG, 0); // x, y
    this.player.two.body.drag.setTo(this.DRAG, 0); // x, y

    this.player.collided = false;

    this.player.collide = function() {

        if(this.player.collided)
            return;

        this.player.collided = true;

        // hide stuff
        //this.layer.main.alpha = 0;
        // this.player.one.alpha = 0;
        // this.player.two.alpha = 0;

        // show popover stuff
        //this.layer.popover.group.alpha = 1;

    }

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
        20, 50, '', { font: '16px Arial', fill: '#ffffff' }
    );


    // timer to Fight
    // TODO: align
	this.timeText = this.game.add.bitmapText(512, 115, 'font_64','', 64);
    this.timeText.tint = 0xC8FF00;

 //    this.game.add.text(
 //        512, 115, '', { font: '64px Arial', fill: '#C8FF00' }
	// );

    // var bmpText = this.game.add.bitmapText(512, 115, 'font_48','Phaser & Pixi \nrocking!', 48);
    // bmpText.tint = 0xC8FF00;


    this.joust = false;
    var beginJoust = function() {
        this.player.one.body.acceleration.x = 0;
        this.player.two.body.acceleration.x = 0;
        this.joust = true;
    };


	var displayTime1 = function() {
		this.timeText.setText('3');
    };
	var displayTime2 = function() {
		this.timeText.setText('2');
    };
	var displayTime3 = function() {
		this.timeText.setText('1');
    };
	var displayTime4 = function() {
		this.timeText.setText('');
    };

    // timer to Begin Jouse (3 sec) and the countdown
	this.game.time.events.add(Phaser.Timer.SECOND*0.5, displayTime1, this);
	this.game.time.events.add(Phaser.Timer.SECOND*1, displayTime2, this);
	this.game.time.events.add(Phaser.Timer.SECOND*1.5, displayTime3, this);
	this.game.time.events.add(Phaser.Timer.SECOND * 2, beginJoust, this);
	this.game.time.events.add(Phaser.Timer.SECOND*2.1, displayTime4, this);

	// popover stuffs

    this.layer.popover = {};
    this.layer.popover.group = this.game.add.group();
    //this.layer.popover.bg = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'popover.bg', null,this.layer.popover.group);

    this.layer.popover.button = {};

    // popover sword buttons
    var swords = {};
    var offset_y = 50;
    var offset_x = 50;

    swords.overheadstrike = this.game.add.sprite(offset_x, offset_y, 'popover.button.sword.overheadstrike',null,this.layer.popover.group);

    offset_y += this.game.cache.getImage('popover.button.sword.overheadstrike').height;
    swords.thrust = this.game.add.sprite(offset_x, offset_y, 'popover.button.sword.thrust',null,this.layer.popover.group);

    offset_y += this.game.cache.getImage('popover.button.sword.thrust').height;
    swords.lowblow = this.game.add.sprite(offset_x, offset_y, 'popover.button.sword.lowblow',null,this.layer.popover.group);

    this.layer.popover.button.swords = swords;

    // popover shield buttons
    var shields = {};
    offset_x = this.game.width - 50 - this.game.cache.getImage('popover.button.shield').width;
    offset_y = 50;

    shields.raised = this.game.add.sprite(offset_x, offset_y, 'popover.button.shield', null, this.layer.popover.group);

    offset_y += this.game.cache.getImage('popover.button.shield').height;
    shields.deflect = this.game.add.sprite(offset_x, offset_y, 'popover.button.shield', null, this.layer.popover.group);

    offset_y += this.game.cache.getImage('popover.button.shield').height;
    shields.lowblock = this.game.add.sprite(offset_x, offset_y, 'popover.button.shield', null, this.layer.popover.group);

    // animation results


    this.layer.popover.results = {};


	// blood spatter
    this.layer.popover.results.blood_spatter = this.game.add.sprite(
        this.game.world.centerX - 426/6/2 *2,
        this.game.world.centerY - 91/2 *2,
        'results.blood_spatter', 0, this.layer.popover.group);

    this.layer.popover.results.blood_spatter.animations.add('results.blood_spatter', [0, 1, 2, 3, 4, 5], 5, true);
    this.layer.popover.results.blood_spatter.animations.play('results.blood_spatter');

    this.layer.popover.results.blood_spatter.scale.setTo(2, 2);/*


	// sword slash
	this.layer.popover.results.Sword_Slash = this.game.add.sprite(
        this.game.world.centerX - 523/4/2 *2,
        this.game.world.centerY - 125/2 *2,
        'results.Sword_Slash', 0, this.layer.popover.group);

    this.layer.popover.results.Sword_Slash.animations.add('results.Sword_Slash', [0, 1, 2, 3], 5, true);
    this.layer.popover.results.Sword_Slash.animations.play('results.Sword_Slash');

    this.layer.popover.results.Sword_Slash.scale.setTo(2, 2);


	// block animation
	this.layer.popover.results.Block_Animation = this.game.add.sprite(
        this.game.world.centerX - 328/3/2 *2,
        this.game.world.centerY - 91/2 *2,
        'results.Block_Animation', 0, this.layer.popover.group);

    this.layer.popover.results.Block_Animation.animations.add('results.Block_Animation', [0, 1, 2], 5, true);
    this.layer.popover.results.Block_Animation.animations.play('results.Block_Animation');

    this.layer.popover.results.Block_Animation.scale.setTo(2, 2);

	// sword clash
	this.layer.popover.results.Sword_Clash = this.game.add.sprite(
        this.game.world.centerX - 287/3/2 *2,
        this.game.world.centerY - 80/2 *2,
        'results.Sword_Clash', 0, this.layer.popover.group);

    this.layer.popover.results.Sword_Clash.animations.add('results.Sword_Clash', [0, 1, 2], 5, true);
    this.layer.popover.results.Sword_Clash.animations.play('results.Sword_Clash');

    this.layer.popover.results.Sword_Clash.scale.setTo(2, 2);*/

    // hide all popover stuff
    //this.layer.popover.group.alpha = 0;



};

// The update() method is called every frame

main.prototype.update = function() {


    if (this.game.time.fps !== 0) {
        this.fpsText.setText(this.game.time.fps + ' FPS');
    }

    // Collide the player with the ground
    this.game.physics.arcade.collide(this.player.one, this.layer.space.castlefront);
    this.game.physics.arcade.collide(this.player.two, this.layer.space.castlefront);

    // Collision between players
    this.game.physics.arcade.collide(this.player.two, this.player.one, this.player.collide, null, this);

    if(this.joust) {
        this.player.one.body.acceleration.x = -this.ACCELERATION;
        this.player.two.body.acceleration.x = this.ACCELERATION;
    }





    // if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    //     // If the LEFT key is down, set the player velocity to move left
    //     this.player.one.body.acceleration.x = -this.ACCELERATION;
    // } else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    //     // If the RIGHT key is down, set the player velocity to move right
    //     this.player.one.body.acceleration.x = this.ACCELERATION;
    // } else {
    //     this.player.one.body.acceleration.x = 0;
    //     // this.player.one.body.acceleration.x = -this.ACCELERATION;
    // }

    // // Set a variable that is true when the player is touching the ground
    // var onTheGround = this.player.one.body.touching.down;

    // if (onTheGround && this.input.keyboard.justPressed(Phaser.Keyboard.UP)) {
    //     // Jump when the player is touching the ground and the up arrow is pressed
    //     // this.player.body.velocity.y = this.JUMP_SPEED;
    // }
};

main.prototype.render = function() {

    // this.game.debug.body(this.layer.space.castlefront);
    // this.game.debug.body(this.player.one);
    // this.game.debug.body(this.player.two);

};

module.exports = main;
