var Card = require('../card');
var Treasure = require('../treasure');

var Copper = Card.extend(Treasure, {
  initialize: function() {
    Card.initialize.call(this, {
      name: 'Copper',
      text: '1',
      cost: 0,
      img: ''
    });
    Treasure.initialize.call(this, 1);
  }
});

module.exports = Copper;
