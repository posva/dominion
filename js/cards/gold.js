'use strict';
var Card = require('../card');
var Treasure = require('../treasure');

var Gold = Card.extend(Treasure, {
  initialize: function() {
    Card.initialize.call(this, {
      name: 'Gold',
      text: '3',
      cost: 6,
      img: ''
    });
    Treasure.initialize.call(this, 3);
  }
});

module.exports = Gold;
