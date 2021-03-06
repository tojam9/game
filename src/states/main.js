/* jshint node:true, browser: true, undef: true, unused: true, devel: true */
/* global Phaser */
// states/main.js

// var events = require('events');
var _ = require('lodash');
var sha256 = require('../sha256.js');

var main = function() {};

// Load images and sounds
main.prototype.preload = function() {

	this.game.load.audio('boden', ['./assets/audio/Battle_Music.mp3', './assets/audio/Battle_Music.ogg']);
    var R = 0;
    // layers object
    this.layers = {};

    // space background
    this.layers.space = {};
    this.layers.space.group = this.game.add.group();
    this.layers.space.group.z = R++;

    // backdrop
    this.layers.backdrop = {};
    this.layers.backdrop.group = this.game.add.group();
    this.layers.backdrop.group.z = R++;

    // main layer with players
    this.layers.main = this.game.add.group();
    this.layers.main.z = R++;

    // foreground
    this.layers.foreground = {};
    this.layers.foreground.group = this.game.add.group();
    this.layers.foreground.group.z = R++;

    // popover layer
    this.layers.popover = {};
    this.layers.popover.group = this.game.add.group();
    this.layers.popover.group.z = R++;

    // parry layer
    this.layers.parry = {};
    this.layers.parry.group = this.game.add.group();
    this.layers.parry.group.z = R++;

    // player object
    this.player_idle = {
        height: 92,
        width: 636/6
    };

    this.player = {
        height: 130,
        width: 453/4
    };

    /// asset loading ///

    // this.game.load.spritesheet('players', './assets/gfx/avatar.png', this.player.width, this.player.height);
    this.game.load.spritesheet('player1', './assets/gfx/Paladin_Running.png', this.player.width, this.player.height);
    this.game.load.spritesheet('player2', './assets/gfx/Dark_Knight_Running.png', this.player.width, this.player.height);

    this.game.load.spritesheet('players idle', './assets/gfx/avatar.png', this.player_idle.width, this.player_idle.height);

    // RPS buttons
    this.game.load.image('popover.button.sword.lowblow', './assets/gfx/popover/buttons/Low_Blow.png');
    this.game.load.image('popover.button.sword.overheadstrike', './assets/gfx/popover/buttons/Overhead_Strike.png');
    this.game.load.image('popover.button.sword.thrust', './assets/gfx/popover/buttons/Thrust.png');
    this.game.load.image('popover.button.shield', './assets/gfx/popover/buttons/Shield.png');

    // RPS result animations
    this.game.load.spritesheet('results.blood_spatter', './assets/gfx/results/Blood_Splatter.png', 426/6, 91);
    this.game.load.spritesheet('results.Sword_Slash', './assets/gfx/results/Sword_Slash.png', 523/4, 125);
    this.game.load.spritesheet('results.Block_Animation', './assets/gfx/results/Block_Animation.png', 328/3, 91);
    this.game.load.spritesheet('results.Sword_Clash', './assets/gfx/results/Sword_Clash.png', 278/3, 80);

    // scene images
    this.game.load.image('scene.castle.back', './assets/gfx/backgrounds/asset_castleWall_back.png');
    this.game.load.image('scene.castle.foreground', './assets/gfx/backgrounds/asset_castleWall_front.png');
    this.game.load.image('space.bigplanet', './assets/gfx/backgrounds/asset_bigPlanet.png');
    this.game.load.image('space.mountains', './assets/gfx/backgrounds/asset_mountains_choco.png');

    this.game.load.image('title', './assets/gfx/asset_titleScreen.png');

    // deferred to css
    // this.game.load.image('space.rockfield', './assets/gfx/backgrounds/asset_rockLine.png');


    // font loading
    this.game.load.bitmapFont('font_32', 'assets/fonts/perfect_dos_vga_437_regular_32.png', 'assets/fonts/perfect_dos_vga_437_regular_32.fnt');
    this.game.load.bitmapFont('font_48', 'assets/fonts/perfect_dos_vga_437_regular_48.png', 'assets/fonts/perfect_dos_vga_437_regular_48.fnt');
    this.game.load.bitmapFont('font_64', 'assets/fonts/perfect_dos_vga_437_regular_64.png', 'assets/fonts/perfect_dos_vga_437_regular_64.fnt');

    // Define player movement constants
    this.MAX_SPEED = 500; // pixels/second
    this.ACCELERATION = 600; // pixels/second/second
    this.DRAG = 400; // pixels/second
    this.GRAVITY = 980; // pixels/second/second
    this.JUMP_SPEED = -300; // pixels/second (negative y is up)


    /// data setup ///

    // TODO: unused
    this.player.data = {};

    var buffer = 150;

    var one = {};
    one.pos = {};
    one.pos.x = this.game.width - this.player.width - buffer;
    one.frame = 0;

    this.player.data.one = one;

    var two = {};
    two.pos = {};
    two.pos.x = buffer;
    two.frame = 7;

    this.player.data.two = two;

    // score object
    this.score = {};

};



// Setup the example
main.prototype.create = function() {


    this.music = this.game.add.audio('boden');
    this.music.play();
    var
    t_height,
    // resize castle foreground collision box height
    ground_bound_offset = 100;

    // set up scene

    // add bigplanet
    this.layers.space.bigplanet = this.game.add.sprite(10, 25, 'space.bigplanet', this.layers.space.group);
    this.layers.space.group.add(this.layers.space.bigplanet);


    // castle backdrop
    // y position
    t_height = this.game.cache.getImage('scene.castle.back').height +
    this.game.cache.getImage('scene.castle.foreground').height*0.55;

    this.layers.space.castleback = this.game.add.tileSprite(0, this.game.height - t_height, this.game.width,
        this.game.cache.getImage('scene.castle.back').height, 'scene.castle.back', 0, this.layers.backdrop.group);

    this.layers.backdrop.group.add(this.layers.space.castleback);


    // castle foreground
    t_height = this.game.cache.getImage('scene.castle.foreground').height;
    this.layers.space.castlefront = this.game.add.tileSprite(0, this.game.height - t_height + 50, this.game.width,
        t_height, 'scene.castle.foreground', 0, this.layers.foreground.group);

    this.layers.foreground.group.add(this.layers.space.castlefront);

    // castle foregroud - physics
    this.game.physics.enable(this.layers.space.castlefront, Phaser.Physics.ARCADE);
    this.layers.space.castlefront.body.immovable = true;
    this.layers.space.castlefront.body.allowGravity = false;

    // castle foreground - collision body resizing
    // it's ground_bound_offset px shorted in height
    this.layers.space.castlefront.body.setSize(this.game.width,
        this.game.cache.getImage('scene.castle.foreground').height - ground_bound_offset, 0, ground_bound_offset);

    // note: deferred to css
    // this.layers.space.rockfield = this.game.add.sprite(0, 100, 'space.rockfield');

    // parry button
    this.parry = {};
    this.parry.shield = this.game.add.sprite(
        this.game.world.centerX - this.game.cache.getImage('popover.button.sword.thrust').width/2,
        this.game.world.centerY - this.game.cache.getImage('popover.button.sword.thrust').height/2,
        'popover.button.sword.thrust', null, this.layers.parry.group);

    this.parry.text = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY, 'font_32','PARRY', 32, this.layers.parry.group);
    this.parry.text.tint = 0xFFDC00;
    this.parry.text.align = 'center';
    this.parry.text.x = this.game.width / 2 - this.parry.text.textWidth / 2;
    this.parry.text.y = this.game.height / 2 - this.parry.text.textHeight / 2 + 32;

    this.parry.text.inputEnabled = true;
    this.parry.shield.inputEnabled = true;

    this.parry.text.alpha = 0;
    this.parry.shield.alpha = 0;
    this.parry.text.input.enabled = false;
    this.parry.shield.input.enabled = false;

    this.parry.shield.events.onInputDown.add(function() {

        // console.log('parried');

        this.parry.text.alpha = 0;
        this.parry.shield.alpha = 0;

        this.parry.text.input.enabled = false;
        this.parry.shield.input.enabled = false;

        this.score.num += 2;

        this.score.text.text = 'Score: ' + this.score.num;

    }, this);

    this.parry.text.events.onInputDown.add(function() {

        // console.log('parried');

        this.parry.text.alpha = 0;
        this.parry.shield.alpha = 0;

        this.parry.text.input.enabled = false;
        this.parry.shield.input.enabled = false;

        this.score.num += 2;

        this.score.text.text = 'Score: ' + this.score.num;

    }, this);


    // popover buttons
    this.layers.popover.button = {};

    // RPS sword buttons
    var swords = {};
    var offset_y = 50;
    var offset_x = 50;

    swords.overheadstrike = this.game.add.sprite(offset_x, offset_y, 'popover.button.sword.overheadstrike', null, this.layers.popover.group);
    this.layers.popover.group.add(swords.overheadstrike);
    swords.overheadstrike.inputEnabled = true;

    swords.overheadstrike.events.onInputDown.add(function() {
        this.rps.player.input = 'R';
        this.rps.player.type = 'sword';

        if(this.rps.player.choice) {
            this.rps.player.choice.alpha = 0.5;
        }

        this.rps.player.choice = swords.overheadstrike;

        this.rps.player.choice.alpha = 1;
    }, this);


    offset_y += this.game.cache.getImage('popover.button.sword.overheadstrike').height;
    swords.thrust = this.game.add.sprite(offset_x, offset_y, 'popover.button.sword.thrust',null,this.layers.popover.group);
    this.layers.popover.group.add(swords.thrust);
    swords.thrust.inputEnabled = true;

    swords.thrust.events.onInputDown.add(function() {
        this.rps.player.input = 'P';
        this.rps.player.type = 'sword';

        if(this.rps.player.choice) {
            this.rps.player.choice.alpha = 0.5;
        }

        this.rps.player.choice = swords.thrust;

        this.rps.player.choice.alpha = 1;
    }, this);

    offset_y += this.game.cache.getImage('popover.button.sword.thrust').height;
    swords.lowblow = this.game.add.sprite(offset_x, offset_y, 'popover.button.sword.lowblow',null,this.layers.popover.group);
    this.layers.popover.group.add(swords.lowblow);
    swords.lowblow.inputEnabled = true;

    swords.lowblow.events.onInputDown.add(function() {
        this.rps.player.input = 'S';
        this.rps.player.type = 'sword';

        if(this.rps.player.choice) {
            this.rps.player.choice.alpha = 0.5;
        }

        this.rps.player.choice = swords.lowblow;

        this.rps.player.choice.alpha = 1;
    }, this);


    this.layers.popover.button.swords = swords;

    // RPS shield buttons
    var shields = {};
    offset_x = this.game.width - 50 - this.game.cache.getImage('popover.button.shield').width;
    offset_y = 50;

    shields.raised = this.game.add.sprite(offset_x, offset_y, 'popover.button.shield', null, this.layers.popover.group);
    this.layers.popover.group.add(shields.raised);
    shields.raised.inputEnabled = true;

    shields.raised.events.onInputDown.add(function() {
        this.rps.player.input = 'R';
        this.rps.player.type = 'shield';

        if(this.rps.player.choice) {
            this.rps.player.choice.alpha = 0.5;
        }

        this.rps.player.choice = shields.raised;

        this.rps.player.choice.alpha = 1;
    }, this);

    offset_y += this.game.cache.getImage('popover.button.shield').height;
    shields.deflect = this.game.add.sprite(offset_x, offset_y, 'popover.button.shield', null, this.layers.popover.group);
    this.layers.popover.group.add(shields.deflect);
    shields.deflect.inputEnabled = true;

    shields.deflect.events.onInputDown.add(function() {
        this.rps.player.input = 'P';
        this.rps.player.type = 'shield';

        if(this.rps.player.choice) {
            this.rps.player.choice.alpha = 0.5;
        }

        this.rps.player.choice = shields.deflect;

        this.rps.player.choice.alpha = 1;
    }, this);

    offset_y += this.game.cache.getImage('popover.button.shield').height;
    shields.lowblock = this.game.add.sprite(offset_x, offset_y, 'popover.button.shield', null, this.layers.popover.group);
    this.layers.popover.group.add(shields.lowblock);
    shields.lowblock.inputEnabled = true;

    shields.lowblock.events.onInputDown.add(function() {
        this.rps.player.input = 'S';
        this.rps.player.type = 'shield';

        if(this.rps.player.choice) {
            this.rps.player.choice.alpha = 0.5;
        }

        this.rps.player.choice = shields.lowblock;

        this.rps.player.choice.alpha = 1;
    }, this);

    this.layers.popover.button.shields = shields;


    // RPS result animations
    this.layers.popover.results = {};

    // blood spatter
    this.layers.popover.results.blood_spatter = this.game.add.sprite(
        this.game.world.centerX - 426/6/2 *2,
        this.game.world.centerY - 91/2 *2,
        'results.blood_spatter', 0, this.layers.popover.group);

    this.layers.popover.group.add(this.layers.popover.results.blood_spatter);

    this.layers.popover.results.blood_spatter.animations.add('results.blood_spatter', [0, 1, 2, 3, 4, 5], 5, true);
    this.layers.popover.results.blood_spatter.animations.play('results.blood_spatter');
    this.layers.popover.results.blood_spatter.scale.setTo(2, 2);
    this.layers.popover.results.blood_spatter.alpha = 0;


    // sword slash
    this.layers.popover.results.swordslash = this.game.add.sprite(
        this.game.world.centerX - 523/4/2,
        this.game.world.centerY - 125/2,
        'results.Sword_Slash', 0, this.layers.popover.group);

    this.layers.popover.results.swordslash.animations.add('results.Sword_Slash', [0, 1, 2, 3], 5, true);
    this.layers.popover.results.swordslash.animations.play('results.Sword_Slash');
    // this.layers.popover.results.swordslash.scale.setTo(2, 2);
    this.layers.popover.results.swordslash.alpha = 0;

    // block animation
    this.layers.popover.results.block = this.game.add.sprite(
        this.game.world.centerX - 328/3/2,
        this.game.world.centerY - 91/2,
        'results.Block_Animation', 0, this.layers.popover.group);

    this.layers.popover.results.block.animations.add('results.Block_Animation', [0, 1, 2], 5, true);
    this.layers.popover.results.block.animations.play('results.Block_Animation');
    // this.layers.popover.results.block.scale.setTo(2, 2);
    this.layers.popover.results.block.alpha = 0;

    // sword clash
    this.layers.popover.results.swordclash = this.game.add.sprite(
        this.game.world.centerX - 287/3/2,
        this.game.world.centerY - 80/2,
        'results.Sword_Clash', 0, this.layers.popover.group);

    this.layers.popover.results.swordclash.animations.add('results.Sword_Clash', [0, 1, 2], 5, true);
    this.layers.popover.results.swordclash.animations.play('results.Sword_Clash');
    // this.layers.popover.results.Sword_Clash.scale.setTo(2, 2);
    this.layers.popover.results.swordclash.alpha = 0;





    // Create players
    var player_pos_y = this.game.height -
                       this.player.height -
                       (this.game.cache.getImage('scene.castle.foreground').height - ground_bound_offset);

    var player_pos_y_idle = this.game.height -
                       this.player_idle.height -
                       (this.game.cache.getImage('scene.castle.foreground').height - ground_bound_offset);

    this.player.one = this.game.add.sprite(this.player.data.one.pos.x, player_pos_y, 'player1', 0, this.layers.main);
    this.player.two = this.game.add.sprite(this.player.data.two.pos.x, player_pos_y, 'player2', 0, this.layers.main);

    this.player.one_idle = this.game.add.sprite(this.player.data.one.pos.x, player_pos_y_idle, 'players idle', 0, this.layers.main);
    this.player.two_idle = this.game.add.sprite(this.player.data.two.pos.x, player_pos_y_idle, 'players idle', 7, this.layers.main);

    this.layers.main.add(this.player.one);
    this.layers.main.add(this.player.two);
    this.layers.main.add(this.player.one_idle);
    this.layers.main.add(this.player.two_idle);

    // animate players

    // Add animation
    this.player.one.animations.add('one.running', [0, 1, 2, 3], 5, true);
    this.player.two.animations.add('two.running', [0, 1, 2, 3], 5, true);
    this.player.one.animations.play('one.running');
    this.player.two.animations.play('two.running');

    this.player.one_idle.animations.add('one.idle', [0, 1, 2, 3, 4, 5], 5, true);
    this.player.two_idle.animations.add('two.idle', [6, 7, 8, 9, 10, 11], 5, true);
    this.player.one_idle.animations.play('one.idle');
    this.player.two_idle.animations.play('two.idle');

    // Enable physics on the players
    this.game.physics.enable(this.player.one, Phaser.Physics.ARCADE);
    this.game.physics.enable(this.player.two, Phaser.Physics.ARCADE);

    this.game.physics.enable(this.player.one_idle, Phaser.Physics.ARCADE);
    this.game.physics.enable(this.player.two_idle, Phaser.Physics.ARCADE);

    // Make player collide with world boundaries so he doesn't leave the stage
    this.player.one.body.collideWorldBounds = true;
    this.player.two.body.collideWorldBounds = true;

    this.player.one_idle.body.collideWorldBounds = true;
    this.player.two_idle.body.collideWorldBounds = true;

    // Set player minimum and maximum movement speed
    this.player.one.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10); // x, y
    this.player.two.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10); // x, y


    // Add drag to the player that slows them down when they are not accelerating
    this.player.one.body.drag.setTo(this.DRAG, 0); // x, y
    this.player.two.body.drag.setTo(this.DRAG, 0); // x, y


    // Capture certain keys to prevent their default actions in the browser.
    // This is only necessary because this is an HTML5 game. Games on other
    // platforms may not need code like this.
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN
    ]);


    /// events ///
    this.events = {

        timer: {
            begin: true,
            end: false
        },

        players: {
            collided: false,
            joust: false
        },

        results: {
            begin: false,
            end: false
        }
    };


    this.player.collide = function() {

        if(this.events.players.collided)
            return;

        // stop jousting
        this.events.players.joust = false;
        this.events.players.collided = true;

        this.player.one.animations.stop('one.running');
        this.player.two.animations.stop('two.running');

        // console.log('collided');

        // reset game
        this.events.players.collided = false;
        this.events.results.begin = true;

    };


    //  Scoring
    this.score.text = this.game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });
    this.score.num = 0;

    //  Add and update the score
    //this.score += 10;
    this.score.text.text = 'Score: ' + this.score.num;


    // timer to fight
    this.timer = {};
    this.timer.duration = 3;
    this.timer.text = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY, 'font_64','', 64);
    this.timer.text.tint = 0xFFDC00;
    this.timer.text.align = 'center';
    this.timer.text.x = this.game.width / 2 - this.timer.text.textWidth / 2;
    this.timer.text.y = this.game.height / 2 - this.timer.text.textHeight / 2;


    // status text
    this.status = {};
    this.status.text = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY, 'font_64','', 64);
    this.status.text.tint = 0x01FF70;
    this.status.text.align = 'center';
    this.status.text.x = this.game.width / 2 - this.status.text.textWidth / 2;
    this.status.text.y = this.game.height - this.status.text.textHeight - 50;

    // Show FPS
    this.game.time.advancedTiming = true;
    this.fpsText = this.game.add.text(
        20, 50, '', { font: '16px Arial', fill: '#ffffff' }
    );

    // rps object
    this.rps = {};
    this.rps.ai = {
        input: 'R',
        type: 'sword',
        state: 'e+4sk5jfPPON3muIQJPM-KBCJPyYHgkkgXgpprL2'
    };

    this.rps.player = {
        input: null,
        type: null,
        last_move: ''
    };

    // title
    this.title_screen = this.game.add.sprite(0, 0, 'title');
    this.title_screen.alpha = 1;

    // delay results
    this.game.time.events.add(Phaser.Timer.SECOND*3, function() {
        this.title_screen.alpha = 0;
    }, this);

};

// The update() method is called every frame

main.prototype.update = function() {

    if(this.title_screen.alpha === 1) {
        return;
    }

    // FPS
    if (this.game.time.fps !== 0) {
        this.fpsText.setText(this.game.time.fps + ' FPS');
    }

    // Collide the player with the ground
    this.game.physics.arcade.collide(this.player.one, this.layers.space.castlefront);
    this.game.physics.arcade.collide(this.player.two, this.layers.space.castlefront);

    // Collision between players
    this.game.physics.arcade.collide(this.player.two, this.player.one, this.player.collide, null, this);


    // setup timer
    if(this.events.timer.begin) {
        // console.log('begin timer');
        this.events.timer.begin = false;

        // disable buttons
        _.each(this.layers.popover.button.shields, function(val) {
            val.input.enabled = false;
            val.alpha = 0;
        });
        _.each(this.layers.popover.button.swords, function(val) {
            val.input.enabled = false;
            val.alpha = 0;
        });

        this.player.two_idle.alpha = 1;
        this.player.one_idle.alpha = 1;
        this.player.two.alpha = 0;
        this.player.one.alpha = 0;


        // reset data
        this.timer.duration = 3;

        var updateTimer = function() {
            // console.log('update timer', this.timer.duration);

            if(this.timer.duration === 0) {
                this.timer.text.text = '';
                this.events.timer.end = true;
                this.events.players.joust = true;

                // reenable buttons
                _.each(this.layers.popover.button.shields, function(val) {
                    val.input.enabled = true;
                    val.alpha = 0.5;
                });
                _.each(this.layers.popover.button.swords, function(val) {
                    val.input.enabled = true;
                    val.alpha = 0.5;
                });

                // ai choose move
                this.rps.ai.state = this.rps.player.last_move && this.rps.ai.state + this.rps.player.last_move ||  'e+4sk5jfPPON3muIQJPM-KBCJPyYHgkkgXgpprL2';

                this.rps.ai.input = 'RPS'[parseInt(sha256.hash(this.rps.ai.state),16)%3]
                this.rps.ai.type = ['sword', 'shield'][Math.floor(Math.random() * (1 + 1))];

                this.player.two_idle.alpha = 0;
                this.player.one_idle.alpha = 0;

                this.player.two.alpha = 1;
                this.player.one.alpha = 1;

                // console.log('timer end');

            } else {
                this.timer.text.text = this.timer.duration;

                this.timer.text.x = this.game.width / 2 - this.timer.text.textWidth / 2;
                this.timer.text.y = this.game.height / 2 - this.timer.text.textHeight / 2;
            }

            this.timer.duration--;
        };

        this.game.time.events.repeat(Phaser.Timer.SECOND, this.timer.duration + 1, updateTimer, this);

    }

    // begin joust
    if(this.events.players.joust) {

        if(this.events.timer.end)
            this.events.timer.end = false;

        this.player.one.body.acceleration.x = -this.ACCELERATION;
        this.player.two.body.acceleration.x = this.ACCELERATION;
    } else {

        this.player.one.body.acceleration.x = 0;
        this.player.two.body.acceleration.x = 0;
    }

    // show results
    if(this.events.results.begin) {
        this.events.results.begin = false;

        // disable buttons from changing
        // _.each(this.layers.popover.button.shields, function(val) {
        //     val.input.enabled = false;
        // });
        // _.each(this.layers.popover.button.swords, function(val) {
        //     val.input.enabled = false;
        // });

        var anim_sprite = null;

        // process RPS
        if(this.rps.player.input === null || this.rps.player.type == null) {

            this.status.text.text = 'CHOOSE SOMETHING!';
            this.events.results.begin = true;


        } else {

            // record player's last move
            this.rps.player.last_move = this.rps.player.input;

            // null case
            if (this.rps.player.input === this.rps.ai.input) {

                // parry chance
                this.parry.text.alpha = 1;
                this.parry.shield.alpha = 1;

                this.parry.text.input.enabled = true;
                this.parry.shield.input.enabled = true;


                if (this.rps.player.type === this.rps.ai.type) {

                    if(this.rps.player.type === 'sword') {

                        anim_sprite = this.layers.popover.results.swordclash;

                        this.status.text.text = 'SWORDS CLASHED!';
                    } else {
                        // shield
                        this.status.text.text = 'YOU BOTH BLOCKED!';

                        anim_sprite = this.layers.popover.results.block;
                    }

                } else {

                    // player sword vs AI shield
                    if(this.rps.player.type === 'sword') {
                        this.status.text.text = 'YOU GOT BLOCKED!';
                    } else {
                        this.status.text.text = 'YOU BLOCKED!';
                    }

                    anim_sprite = this.layers.popover.results.block;

                }

            } else {

                // case: this.rps.player.input !== this.rps.ai.input

                switch(this.rps.player.input) {
                    case 'R':

                        if(this.rps.ai.input == 'P') {

                            if(this.rps.ai.type == 'sword') {
                                // this.rps.player.type = 'sword' or 'shield'
                                this.status.text.text = 'YOU GOT HIT!';

                                anim_sprite = this.layers.popover.results.blood_spatter;

                            } else {

                                // case: this.rps.ai.type == 'shield'

                                if(this.rps.player.type == 'sword') {

                                    this.status.text.text = 'YOU GOT BLOCKED!';

                                } else {
                                    // this.rps.player.type == 'shield'
                                    this.status.text.text = 'YOU BOTH BLOCKED!';
                                }

                                anim_sprite = this.layers.popover.results.block;
                            }

                        } else {
                            // this.rps.ai.input == 'S'
                            // this.rps.ai.type == 'sword' or 'shield'

                            if(this.rps.player.type == 'sword') {
                                this.status.text.text = 'YOU HIT!';

                                this.score.num += 1;

                                anim_sprite = this.layers.popover.results.swordslash;

                            } else {
                                // this.rps.player.type == 'shield'
                                this.status.text.text = 'YOU BLOCKED!';

                                anim_sprite = this.layers.popover.results.block;
                            }
                        }

                        break;
                    case 'P':

                        if(this.rps.ai.input == 'S') {

                            if(this.rps.ai.type == 'sword') {
                                // this.rps.player.type = 'sword' or 'shield'
                                this.status.text.text = 'YOU GOT HIT!';

                                anim_sprite = this.layers.popover.results.blood_spatter;

                            } else {

                                // case: this.rps.ai.type == 'shield'
                                if(this.rps.player.type == 'sword') {

                                    this.status.text.text = 'YOU GOT BLOCKED!';

                                } else {
                                    // this.rps.player.type == 'shield'
                                    this.status.text.text = 'YOU BOTH BLOCKED!';
                                }

                                anim_sprite = this.layers.popover.results.block;
                            }

                        } else {
                            // this.rps.ai.input == 'R'
                            // this.rps.ai.type == 'sword' or 'shield'

                            if(this.rps.player.type == 'sword') {
                                this.status.text.text = 'YOU HIT!';

                                this.score.num += 1;

                                anim_sprite = this.layers.popover.results.swordslash;

                            } else {
                                // this.rps.player.type == 'shield'
                                this.status.text.text = 'YOU BLOCKED!';

                                anim_sprite = this.layers.popover.results.block;
                            }
                        }

                        break;
                    case 'S':

                        if(this.rps.ai.input == 'R') {

                            if(this.rps.ai.type == 'sword') {
                                // this.rps.player.type = 'sword' or 'shield'
                                this.status.text.text = 'YOU GOT HIT!';

                                anim_sprite = this.layers.popover.results.blood_spatter;

                            } else {

                                // case: this.rps.ai.type == 'shield'
                                if(this.rps.player.type == 'sword') {

                                    this.status.text.text = 'YOU GOT BLOCKED!';

                                } else {
                                    // this.rps.player.type == 'shield'
                                    this.status.text.text = 'YOU BOTH BLOCKED!';
                                }

                                anim_sprite = this.layers.popover.results.block;
                            }

                        } else {
                            // this.rps.ai.input == 'P'
                            // this.rps.ai.type == 'sword' or 'shield'

                            if(this.rps.player.type == 'sword') {
                                this.status.text.text = 'YOU HIT!';

                                anim_sprite = this.layers.popover.results.swordslash;

                                this.score.num += 1;

                            } else {
                                // this.rps.player.type == 'shield'
                                this.status.text.text = 'YOU BLOCKED!';

                                anim_sprite = this.layers.popover.results.block;
                            }
                        }

                        break;
                    default:
                        throw new Error('fucccck');
                }

            }


            // this.status.text.text = this.rps.player.input + ' ' + this.rps.player.type;
        }

        // show animation sprite
        if(anim_sprite !== null) {
            anim_sprite.alpha = 1;
        }

        // console.log('show results');

        // console.log(this.rps.player.input, this.rps.player.type);
        // console.log(this.rps.ai.input, this.rps.ai.type);

        // align text
        this.status.text.updateTransform();
        this.status.text.y = this.game.height - this.status.text.textHeight - 50;
        this.status.text.x = this.game.width / 2 - this.status.text.textWidth / 2;

        if(this.events.results.begin === false) {

            this.score.text.text = 'Score: ' + this.score.num;

            // reset choice
            this.rps.player.input = null;
            this.rps.player.type = null;

            var showResults = function() {

                if(anim_sprite !== null) {
                    anim_sprite.alpha = 0;
                }

                this.events.results.end = true;
                // console.log('finish showing results');

                this.status.text.text = '';
            };

            // delay results
            this.game.time.events.add(Phaser.Timer.SECOND*2, showResults, this);

        }
    }

    if(this.events.results.end) {

        // hide any parry
        this.parry.text.alpha = 0;
        this.parry.shield.alpha = 0;

        this.parry.text.input.enabled = false;
        this.parry.shield.input.enabled = false;

        // console.log('results end');
        this.events.results.end = false;
        this.events.timer.begin = true;

        // reset game
        this.player.one.x = this.player.data.one.pos.x;
        this.player.two.x = this.player.data.two.pos.x;

        this.player.one.animations.play('one.running');
        this.player.two.animations.play('two.running');

    }

};

main.prototype.render = function() {

    // this.game.debug.body(this.layers.space.castlefront);
    // this.game.debug.body(this.player.one_idle);
    // this.game.debug.body(this.player.two);

};

module.exports = main;
