'use strict';
var Card = require('../card');
var Victory = require('../victory');
var Treasure = require('../treasure');

var Harem = Card.extend(Treasure, Victory, {
  initialize: function() {
    Card.initialize.call(this, {
      name: 'Harem',
      text: '2%G\n2%V',
      cost: 6,
      img: 'data/card/harem.jpg'
    });
    Treasure.initialize.call(this, 2);
    Victory.initialize.call(this, 2);
  }
});

module.exports = Harem;
