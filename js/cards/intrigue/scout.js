var Card = require('../card');
var Action = require('../action');
var ActionEvent = require('../action-event');
var _ = require('lodash');

var Scout = Card.extend(Action, {
  initialize: function() {
    Card.initialize.call(this, {
      name: 'Scout',
      text: '+1 Action\n\nReveal the top 4 cards of your deck. Put the revealed Victory cards into your hand. Put the other cards on top of your deck in any order.',
      cost: 4,
      img: 'data/card/scout.jpg'
    });
    Action.initialize.call(this, [
      ActionEvent.new('actions 1'),
      function(game) {
        var rest, cards, p;
        p = game.currentPlayer();
        cards = p.extractFromDeck(4);
        _.forEach(cards, function(v) {
          if (v.is('victory')) {
            p.hand.push(v);
          } else {
            rest.push(v);
          }
        });
        // TODO choix d'ordre
        _.forEach(rest, function(v) {
          p.deck.unshift(v);
        });
      }
    ]);
  }
});

module.exports = Scout;
