'use strict';
var Treasure = require('./treasure');
var selfish = require('selfish');
var Curse = require('./cards/curse');
var Duke = require('./cards/intrigue/duke');

var app = {
  start: function() {
    window.Treasure = Treasure;
    window.Base = selfish.Base;
    window.Curse = Curse;
    window.Duke = Duke;
  }
};

module.exports = app;

