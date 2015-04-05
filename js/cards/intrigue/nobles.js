var Card = require('../card');
var Victory = require('../victory');
var Action = require('../action');
var ActionEvent = require('../action-event');

var Nobles = Card.extend(Action, Victory, {
  initialize: function(game) {
    Card.initialize.call(this, {
      name: 'Nobles',
      text: 'Choose one: +2 Cards or +2 Actions\n---\n2%V',
      cost: 6,
      img: 'data/card/nobles.jpg'
    });
    Victory.initialize.call(this, 1);
    Action.initialize.call(this, [
      'choose',
      ActionEvent.new(game, 'cards 3'),
      ActionEvent.new(game, 'actions 2'),
    ]);
  }
});

module.exports = Nobles;
