'use strict';
var Card = require('../card');
var Victory = require('../victory');

var Province = Card.extend(Victory, {
  initialize: function() {
    Card.initialize.call(this, {
      name: 'Province',
      cost: 8,
    });
    Victory.initialize.call(this, 6);
  }
});

module.exports = Province;
