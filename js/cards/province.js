var Card = require('../card');
var Victory = require('../victory');

var Province = Card.extend(Victory, {
  initialize: function() {
    Card.initialize.call(this, {
      name: 'Province',
      text: '6',
      cost: 8,
      img: ''
    });
    Victory.initialize.call(this, 6);
  }
});

module.exports = Province;
