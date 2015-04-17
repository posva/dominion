'use strict';
var Card = require('../card');
var Treasure = require('../treasure');

var Copper = Card.extend(Treasure, {
  initialize: function() {
    Card.initialize.call(this, {
      name: 'Copper',
      cost: 0,
    });
    Treasure.initialize.call(this, 1);
  }
});

module.exports = Copper;
