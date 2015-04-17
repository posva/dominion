'use strict';
var Card = require('../card');
var Treasure = require('../treasure');

var Silver = Card.extend(Treasure, {
  initialize: function() {
    Card.initialize.call(this, {
      name: 'Silver',
      cost: 3,
    });
    Treasure.initialize.call(this, 2);
  }
});

module.exports = Silver;
