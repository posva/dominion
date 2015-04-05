'use strict';
var Card = require('../../card');
var Victory = require('../../victory');
var Action = require('../../action');
var ActionEvent = require('../../action-event');

var GreatHall = Card.extend(Action, Victory, {
  initialize: function(game) {
    Card.initialize.call(this, {
      name: 'Great Hall',
      text: '+1 Card\n+1 Action\n---\n1%V',
      cost: 3,
      img: 'data/card/greatHall.jpg'
    });
    Victory.initialize.call(this, 1);
    Action.initialize.call(this, [
      ActionEvent.new(game, 'cards 1'),
      ActionEvent.new(game, 'actions 1'),
    ]);
  }
});

module.exports = GreatHall;
