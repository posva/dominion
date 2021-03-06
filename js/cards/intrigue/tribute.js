'use strict';
var Card = require('../card');
var Action = require('../action');
var _ = require('lodash');

var Tribute = Card.extend(Action, {
  initialize: function() {
    Card.initialize.call(this, {
      name: 'Tribute',
      cost: 5,
    });
    Action.initialize.call(this, [
      function(game) {
        var pleft = game.currentPlayer(-1),
          cards, p;
        p = game.currentPlayer();
        cards = pleft.extractFromDeck(2);
        if (cards[0] && cards[1] && cards[0].name === cards[1].name) {
          cards.splice(0, 1);
        }
        _.forEach(cards, function(v) {
          if (v.is('victory')) {
            p.draws(2);
          } else if (v.is('treasure')) {
            game.addMoney(2);
          } else if (v.is('action')) {
            game.addActions(2);
          }
          p.graveyard.push(v);
        });
      }
    ]);
  }
});

module.exports = Tribute;
