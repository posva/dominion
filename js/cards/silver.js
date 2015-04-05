var Card = require('../card');
var Treasure = require('../treasure');

var Silver = Card.extend(Treasure, {
  initialize: function() {
    Card.initialize.call(this, {
      name: 'Silver',
      text: '2',
      cost: 3,
      img: ''
    });
    Treasure.initialize.call(this, 2);
  }
});

module.exports = Silver;
