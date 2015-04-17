'use strict';
var Card = require('../../card');
var Victory = require('../../victory');
var _ = require('lodash');

var Duke = Card.extend(Victory, {
  initialize: function() {
    Card.initialize.call(this, {
      name: 'Duke',
      cost: 5,
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
