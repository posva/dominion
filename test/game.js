var requirejs = require('requirejs');
var assert = require('assert');
var should = require('should');
var _ = require('lodash');
requirejs.config({
  baseUrl: 'js',
  nodeRequire: require
});

describe('Game tests', function() {
  // Load modules with requirejs before tests
  var Game, base;
  before(function(done) {
    requirejs(['game', 'modes/base'], function(game, b) {
      Game = game;
      base = b;
      done();
    });
  });

  var playerInitializer = function() {
    var i = 0;
    for (i = 0; i < 7; i++) {
      this.deck.push(Copper.new());
    }
    for (i = 0; i < 3; i++) {
      this.deck.push(Estate.new());
    }
  };

  describe('#Game initialization', function() {
    it('should throw errors for empty conf', function() {
      var g = Game.new();
      g.startGame.bind(g).should.throw(/configuration.*given/);
    });
    it('should throw errors for wrong number of players', function() {
      var g = Game.new();
      g.startGame.bind(g, {}).should.throw(/number.*players/);
      g.startGame.bind(g, { players: 'im not a number'}).should.throw(/number.*players/);
      g.startGame.bind(g, { players: 1}).should.throw(/number.*players/);
      g.startGame.bind(g, { players: 7}).should.throw(/number.*players/);
    });
    it('should throw errors for extensions', function() {
      var g = Game.new();
      g.startGame.bind(g, {
        players: 2,
        extensions: []
      }).should.throw(/[nN]o extensions? given/);
      g.startGame.bind(g, {
        players: 2,
        extensions: [{}, {cards: {}}]
      }).should.throw(/one.*extensions?.*invalid/);

    });
    it('should throw errors for modes', function() {
      var g = Game.new();
      g.startGame.bind(g, {
        players: 2,
        extensions: [{cards: {}}],
        mode: {}
      }).should.throw(/mode.*invalid/);
    });
    it('should start the game', function() {
      var g = Game.new();
      g.startGame.bind(g, {
        players: 2,
        extensions: [{cards: {}}],
        mode: base
      }).should.not.throw();
      g.players.should.have.length(2);
    });
    it('should start the game multiple times', function() {
      var g = Game.new();
      g.startGame.bind(g, {
        players: 2,
        extensions: [{cards: {}}],
        mode: base
      }).should.not.throw();
      g.startGame.bind(g, {
        players: 2,
        extensions: [{cards: {}}],
        mode: base
      }).should.not.throw();
      g.startGame.bind(g, {
        players: 2,
        extensions: [{cards: {}}],
        mode: base
      }).should.not.throw();
      g.players.should.have.length(2);
    });
  });

  describe('#Game interactions', function() {
    it('should get relative players with 2 players', function() {
      var g = Game.new();
      g.startGame.bind(g, {
        players: 2,
        extensions: [{cards: {}}],
        mode: base
      }).should.not.throw();
      var p1 = g.players[0], p2 = g.players[1];
      g.currentPlayer(0).should.be.eql(p1)
      g.currentPlayer(1).should.be.eql(p2)
      g.currentPlayer(-1).should.be.eql(p2)
      g.currentPlayer(2).should.be.eql(p1)
      g.currentPlayer(-2).should.be.eql(p1)
      g.playerTurn = 1;
      g.currentPlayer(0).should.be.eql(p2)
      g.currentPlayer(1).should.be.eql(p1)
      g.currentPlayer(-1).should.be.eql(p1)
      g.currentPlayer(2).should.be.eql(p2)
      g.currentPlayer(-2).should.be.eql(p2)
    });
  });

});
