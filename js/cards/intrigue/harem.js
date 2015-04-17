'use strict';
var Card = require('../card');
var Victory = require('../victory');
var Treasure = require('../treasure');

var Harem = Card.extend(Treasure, Victory, {
  initialize: function() {
    Card.initialize.call(this, {
      name: 'Harem',
      cost: 6,
    });
    Treasure.initialize.call(this, 2);
    Victory.initialize.call(this, 2);
  }
});

module.exports = Harem;
