/*jshint -W030 */
'use strict';
require('should');
var Card = require('../js/card');
var Game = require('../js/game');
var Gold = require('../js/cards/gold');
var Duchy = require('../js/cards/duchy');
var _ = require('lodash');
var fs = require('fs');

var modesDir = 'js/modes';
var modesArray = _.filter(fs.readdirSync(modesDir), function(file) {
  return file.match(/.js$/);
});

var modes = {};
_.forEach(modesArray, function(mode) {
  modes[mode] = require('../' + modesDir + '/' + mode);
});

describe('Modes testing', function() {
  _.forOwn(modes, function(v, k) {
    describe(k + '.js', function() {
      v = modes[k];
      describe('#Common', function() {
        var game;
        before(function() {
          game = Game.new();
          game.startGame({
            players: 2,
            cards: [Gold],
            mode: v
          });
        });
        it('should have a valid cards object', function() {
          v.should.have.property('cards');
          _.forOwn(v.cards, function(c) {
            c.should.have.property('card');
            if (c.card) {
              Card.isPrototypeOf(c.card).should.be.ok;
            }
          });
        });
        it('should match key and card name in cards object', function() {
          _.forOwn(v.cards, function(c, name) {
            if (c.card) {
              var i = c.card.new(game);
              i.name.should.be.eql(name);
            }
          });
        });
        it('should have special card named \'kingdom-card\' and \'victory-card\'', function() {
          v.cards.should.have.property('kingdom-card');
          v.cards.should.have.property('victory-card');
          v.cards['kingdom-card'].should.have.property('card', null);
          v.cards['victory-card'].should.have.property('card', null);
        });
        it('should be able to get amounts of cards', function() {
          _.forOwn(v.cards, function(c) {
            c.should.have.property('amount');
            c.amount.should.be.instanceof(Array).and.have.lengthOf(5);
            _.forOwn(c.amount, function(amount) {
              amount.should.be.a.Number;
            });
          });
        });
        it('should start a game', function() {
          v.playerInitializer.should.be.a.Function;
          var g = Game.new();
          g.startGame.bind(g, {
            players: 2,
            cards: [Duchy],
            mode: v
          }).should.not.throw();
        });
        it('should have working isGameOver', function() {
          game = Game.new();
          game.startGame({
            players: 2,
            cards: [Gold],
            mode: v
          });
          v.isGameOver.should.be.a.Function;
          v.isGameOver.bind(v, game).should.not.throw();
        });
      });
      describe('#Card creation', function() {
        var game;
        before(function() {
          game = Game.new();
          game.startGame({
            players: 2,
            cards: [Gold],
            mode: v
          });
        });
        _.forOwn(v.cards, function(c, name) {
          if (c.card) {
            it('should be able to create ' + name, function() {
              c.card.new(game).should.be.ok;
            });
          }
        });
      });
    });
  });
});
