'use strict';
var Card = require('../card');
var Victory = require('../victory');

var Estate = Card.extend(Victory, {
  initialize: function() {
    Card.initialize.call(this, {
      name: 'Estate',
      text: '1',
      cost: 2,
      img: ''
    });
    Victory.initialize.call(this, 1);
  }
});

module.exports = Estate;
