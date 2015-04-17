'use strict';
var Card = require('../card');
var Treasure = require('../treasure');

var Gold = Card.extend(Treasure, {
  initialize: function() {
    Card.initialize.call(this, {
      name: 'Gold',
      cost: 6,
    });
    Treasure.initialize.call(this, 3);
  }
});

module.exports = Gold;
