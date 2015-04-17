'use strict';
var Card = require('../card');
var Victory = require('../victory');

var Estate = Card.extend(Victory, {
  initialize: function() {
    Card.initialize.call(this, {
      name: 'Estate',
      cost: 2,
    });
    Victory.initialize.call(this, 1);
  }
});

module.exports = Estate;
