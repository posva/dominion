'use strict';
var Card = require('../card');
var Victory = require('../victory');
var _ = require('lodash');

var Duke = Card.extend(Victory, {
  initialize: function() {
    Card.initialize.call(this, {
      name: 'Duke',
      text: 'Worth 1%v per Duchy you have.',
      cost: 5,
      img: 'data/card/duke.jpg'
    });
    Victory.initialize.call(this, function(game) {
      var p = game.currentPlayer(),
        cards;
      cards = p.deck.concat(p.hand, p.graveyard);
      var count = 0;
      _.forEach(cards, function(v) {
        if (v.name === 'Duchy') {
          count++;
        }
      });
      return count;
    });
  }
});

module.exports = Duke;
