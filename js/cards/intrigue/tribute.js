'use strict';
var Card = require('../card');
var Action = require('../action');
var _ = require('lodash');

var Tribute = Card.extend(Action, {
  initialize: function() {
    Card.initialize.call(this, {
      name: 'Tribute',
      text: 'The player to your left reveals then discards the top two cards of his deck. For each differently concerned card revealed, if it is an:\nAction Card: +2 Actions\nTreasure Card: +2%g\nVictory Card: +2 Cards',
      cost: 5,
      img: 'data/card/tribute.jpg'
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
