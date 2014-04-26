var
$ = require("./vendor/jquery.min.js"),


GeoPattern = require('geopattern'),
// pattern = GeoPattern.generate(Date().toLocaleString()),
pattern = GeoPattern.generate(''),

// Phaser
game = new Phaser.Game(1024, 576, Phaser.CANVAS, "game-container"),

// load main game state
MainState = require('./states/main.js');

// Phaser bootstrap
game.transparent = true;
game.state.add("game-container", MainState, true);

$(function() {
    $('body').css('background-image', pattern.toDataUrl());
});
