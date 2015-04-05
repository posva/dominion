'use strict';
var Card = require('../card');
var Victory = require('../victory');

var Duchy = Card.extend(Victory, {
  initialize: function() {
    Card.initialize.call(this, {
      name: 'Duchy',
      text: '3',
      cost: 5,
      img: ''
    });
    Victory.initialize.call(this, 3);
  }
});

module.exports = Duchy;
