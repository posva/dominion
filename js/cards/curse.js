'use strict';
var Card = require('../card');
var Curse = require('../curse');

var CurseCard = Card.extend(Curse, {
  initialize: function() {
    Card.initialize.call(this, {
      name: 'Curse',
      cost: 0,
    });
    Curse.initialize.call(this, -1);
  }
});

module.exports = CurseCard;
