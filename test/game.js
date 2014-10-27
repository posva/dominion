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
  var Game, base, Gold, Silver;
  before(function(done) {
    requirejs(['game', 'modes/base', 'cards/gold', 'cards/silver'], function(game, b, gold, silver) {
      Game = game;
      base = b;
      Gold = gold;
      Silver = silver;
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
    it('should throw errors for cards', function() {
      var g = Game.new();
      g.startGame.bind(g, {
        players: 2,
        cards: []
      }).should.throw(/[nN]o cards? given/);
      g.startGame.bind(g, {
        players: 2,
        cards: [{}]
      }).should.throw(/one.*cards?.*invalid/);

    });
    it('should throw errors for modes', function() {
      var g = Game.new();
      g.startGame.bind(g, {
        players: 2,
        cards: [Gold],
        mode: {}
      }).should.throw(/mode.*invalid/);
    });
    it('should start the game', function() {
      var g = Game.new();
      g.startGame.bind(g, {
        players: 2,
        cards: [Gold],
        mode: base
      }).should.not.throw();
      g.players.should.have.length(2);
    });
    it('should start the game multiple times', function() {
      var g = Game.new();
      g.startGame.bind(g, {
        players: 2,
        cards: [Gold],
        mode: base
      }).should.not.throw();
      g.startGame.bind(g, {
        players: 2,
        cards: [Gold],
        mode: base
      }).should.not.throw();
      g.players.should.have.length(2);
      g.startGame.bind(g, {
        players: 2,
        cards: [Gold],
        mode: base
      }).should.not.throw();
      g.players.should.have.length(2);
    });
    it('should start the game multiple times with different confs', function() {
      var g = Game.new();
      g.startGame.bind(g, {
        players: 2,
        cards: [Gold],
        mode: base
      }).should.not.throw();
      g.players.should.have.length(2);
      g.startGame.bind(g, {
        players: 4,
        cards: [Silver],
        mode: base
      }).should.not.throw();
      g.players.should.have.length(4);
      g.startGame.bind(g, {
        players: 2,
        cards: [Gold],
        mode: base
      }).should.not.throw();
      g.players.should.have.length(2);
    });
  });

  describe('#Game in-turn events', function() {
    it('should add actions', function() {
      var g = Game.new();
      g.actions.should.be.eql(0);
      g.addActions(1);
      g.actions.should.be.eql(1);
      g.addActions(4);
      g.actions.should.be.eql(5);
    });
    it('should add buys', function() {
      var g = Game.new();
      g.buys.should.be.eql(0);
      g.addBuys(1);
      g.buys.should.be.eql(1);
      g.addBuys(4);
      g.buys.should.be.eql(5);
    });
    it('should add money', function() {
      var g = Game.new();
      g.money.should.be.eql(0);
      g.addMoney(1);
      g.money.should.be.eql(1);
      g.addMoney(4);
      g.money.should.be.eql(5);
    });
  });

  describe('#Game interactions', function() {
    it('should get relative players with 2 players', function() {
      var g = Game.new();
      g.startGame.bind(g, {
        players: 2,
        cards: [Gold],
        mode: base
      }).should.not.throw();
      var p1 = g.players[0], p2 = g.players[1];
      g.currentPlayer(0).should.be.eql(p1);
      g.currentPlayer(1).should.be.eql(p2);
      g.currentPlayer(-1).should.be.eql(p2);
      g.currentPlayer(2).should.be.eql(p1);
      g.currentPlayer(-2).should.be.eql(p1);
      g.playerTurn = 1;
      g.currentPlayer(0).should.be.eql(p2);
      g.currentPlayer(1).should.be.eql(p1);
      g.currentPlayer(-1).should.be.eql(p1);
      g.currentPlayer(2).should.be.eql(p2);
      g.currentPlayer(-2).should.be.eql(p2);
    });
  });

});
