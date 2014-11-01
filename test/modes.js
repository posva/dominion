/*jshint -W030 */
var requirejs = require('requirejs');
var assert = require('assert');
var should = require('should');
var _ = require('lodash');
var fs = require('fs');
requirejs.config({
  baseUrl: 'js',
  nodeRequire: require
});

describe('Dummy Suite for Modes', function() {
  var modes = {}, modes_array = [], Player, Card, Game, Gold, Duchy;
  before(function(done) {
    requirejs(['player', 'card', 'game', 'cards/gold', 'cards/duchy'], function(player, card, game, gold, duchy) {
      Player = player;
      Card = card;
      Game = game;
      Gold = gold;
      Duchy = duchy;
      fs.readdir('js/modes', function(err, files) {
        // find modes files
        _.forEach(files, function(v) {
          if (v.match(/.js$/)) {
            var new_mode = 'modes/' + v.replace(/.js$/, '');
            modes_array.push(new_mode);
            modes[new_mode] = null;
          }
        });
        // require them
        requirejs(modes_array, function() {
          var i;
          for (i = 0; i < modes_array.length; i++) {
            modes[modes_array[i]] = arguments[i];
          }
          describe('Modes testing', function() {
            _.forOwn(modes, function(v, k) {
              describe(k+ '.js', function(){
                v = modes[k];
                describe('#Common', function(){
                  var game;
                  before(function() {
                    game = Game.new();
                    game.startGame({
                      players: 2,
                      cards: [Gold],
                      mode: v
                    });
                  });
                  it('should have a valid cards object', function(){
                    v.should.have.property('cards');
                    _.forOwn(v.cards, function(c, k) {
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
                  it('should be able to get amounts of cards', function(){
                    _.forOwn(v.cards, function(c, k) {
                      c.should.have.property('amount');
                      c.amount.should.be.an.Array.and.have.lengthOf(5);
                      _.forOwn(c.amount, function(v) {
                        v.should.be.a.Number;
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
                    var game = Game.new();
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
          done();
        });
      });
    });
  });

    it(':D', function(done) {
      var a = {};
      a.should.be.ok;
      done();
    });

  // TODO automate the test for every mode
});
