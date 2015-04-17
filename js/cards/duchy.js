'use strict';
var Card = require('../card');
var Victory = require('../victory');

var Duchy = Card.extend(Victory, {
  initialize: function() {
    Card.initialize.call(this, {
      name: 'Duchy',
      cost: 5,
    });
    Victory.initialize.call(this, 3);
  }
});

module.exports = Duchy;
