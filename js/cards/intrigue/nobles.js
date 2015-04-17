'use strict';
var Card = require('../card');
var Victory = require('../victory');
var Action = require('../action');
var ActionEvent = require('../action-event');

var Nobles = Card.extend(Action, Victory, {
  initialize: function(game) {
    Card.initialize.call(this, {
      name: 'Nobles',
      cost: 6,
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
