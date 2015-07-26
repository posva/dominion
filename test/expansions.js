/*jshint -W030 */
'use strict';
var should = require('should');
var _ = require('lodash');
var fs = require('fs');
var Player = require('../js/player');

var expansionsDir = 'js/expansions';
var expansionsArray;

try {
  expansionsArray = _.filter(fs.readdirSync(expansionsDir), function(file) {
    return file.match(/.js$/);
  });
} catch (e) {
  expansionsArray = [];
}

var expansions = {};
_.forEach(expansionsArray, function(expansion) {
  expansions[expansion] = require('../' + expansionsDir + '/' + expansion);
});

describe('Expansions testing', function() {
  _.forOwn(expansions, function(v, k) {
    describe('#' + k, function() {
      v = expansions[k];
      it('should have a cards object', function() {
        v.should.have.property('cards');
      });
      it('should be able to get amounts of cards', function() {
        v.getAmounts.should.be.a.Function;
        should(v.getAmounts('1')).be.ko;
        should(v.getAmounts({})).be.ko;
        should(v.getAmounts([])).be.ko;
        should(v.getAmounts(1)).be.ko;
        v.getAmounts(2).should.be.ok.and.be.an.Object;
        v.getAmounts(3).should.be.ok.and.be.an.Object;
        v.getAmounts(4).should.be.ok.and.be.an.Object;
      });
      it('should have an amount for every card in \'cards\'', function() {
        var i, amounts;
        var floop = function(_v, card) {
          amounts.should.have.property(card).and.be.a.Number;
        };
        for (i = 2; i < 6; i++) {
          amounts = v.getAmounts(i);
          if (amounts) {
            _.forOwn(v.cards, floop);
          }
        }
      });
      it('should have a working playerInitializer', function() {
        v.playerInitializer.should.be.a.Function;
        Player.new.bind(Player, v.playerInitializer).should.not.throw();
      });
      describe('Card creation', function() {
        _.forOwn(v.cards, function(c, name) {
          it('should be able to create ' + name, function() {
            c.new().should.be.ok;
          });
        });
      });
    });
  });
});
