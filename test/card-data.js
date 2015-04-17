/*jshint -W030 */
'use strict';
require('should');
var _ = require('lodash');
var fs = require('fs');

var cardsDir = 'data/card';
var cardsArray = _.filter(fs.readdirSync(cardsDir), function(file) {
  return file.match(/.json$/);
});

var cards = {};
_.forEach(cardsArray, function(card) {
  cards[card] = require('../' + cardsDir + '/' + card);
});

describe('#Card Data', function() {
  _.forOwn(cards, function(v, k) {
    it(k + ' should be valid', function() {
      v.should.have.property('cost').and.be.a.Number;
      v.should.have.property('name').and.be.a.String;
      v.should.have.property('text').and.be.a.String;
      v.should.have.property('img').and.be.a.String;
    });
  });
});
