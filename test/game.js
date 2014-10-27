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
  var Game, base, Gold, Silver, Duchy;
  before(function(done) {
    requirejs(['game', 'modes/base', 'cards/gold', 'cards/silver', 'cards/duchy'], function(game, b, gold, silver, duchy) {
      Game = game;
      base = b;
      Gold = gold;
      Silver = silver;
      Duchy = duchy;
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
    // check that a started game is ok for  base mode an with a Gold card as a fake kingdom card
    var checkGame = function(game) {
      var cards = ['Copper', 'Estate'];
      var p = game.currentPlayer();
      var estates = 0, coppers = 0;
      game.trash.should.be.empty;
      p.deck.should.have.lengthOf(5);
      p.hand.should.have.lengthOf(5);
      p.graveyard.should.be.empty;
      p.field.should.be.empty;
      _.forOwn(p.deck, function(v) {
        v.should.have.property('name');
        cards.should.containEql(v.name);
        if (v.name === 'Copper')
          coppers++;
        else
          estates++;
      });
      coppers.should.be.within(2, 5);
      estates.should.be.within(0, 3);
      var shE = 3 - estates, shC = 7 - coppers, oE = estates, oC = coppers;
      coppers = 0;
      estates = 0;
      _.forOwn(p.hand, function(v) {
        v.should.have.property('name');
        cards.should.containEql(v.name);
        if (v.name === 'Copper')
          coppers++;
        else
          estates++;
      });
      coppers.should.be.eql(shC);
      estates.should.be.eql(shE);

      // new turn
      game.currentPlayer().should.be.equal(p);
      game.endTurn();
      game.currentPlayer().should.not.be.equal(p);
      game.playerTurn.should.be.eql(1);
      p.deck.should.be.empty;
      coppers = 0;
      estates = 0;
      _.forOwn(p.hand, function(v) {
        v.should.have.property('name');
        cards.should.containEql(v.name);
        if (v.name === 'Copper')
          coppers++;
        else
          estates++;
      });
      coppers.should.be.eql(oC);
      estates.should.be.eql(oE);
    };
    it('should start the game', function() {
      var g = Game.new();
      g.startGame.bind(g, {
        players: 2,
        cards: [Gold],
        mode: base
      }).should.not.throw();
      g.players.should.have.length(2);
      checkGame(g);
    });
    it('should start the game multiple times', function() {
      var g = Game.new();
      g.startGame.bind(g, {
        players: 2,
        cards: [Gold],
        mode: base
      }).should.not.throw();
      checkGame(g);
      g.startGame.bind(g, {
        players: 2,
        cards: [Gold],
        mode: base
      }).should.not.throw();
      g.players.should.have.length(2);
      checkGame(g);
      g.startGame.bind(g, {
        players: 2,
        cards: [Gold],
        mode: base
      }).should.not.throw();
      g.players.should.have.length(2);
      checkGame(g);
    });
    it('should start the game multiple times with different confs', function() {
      var g = Game.new();
      g.startGame.bind(g, {
        players: 2,
        cards: [Gold],
        mode: base
      }).should.not.throw();
      g.players.should.have.length(2);
      checkGame(g);
      g.startGame.bind(g, {
        players: 4,
        cards: [Silver],
        mode: base
      }).should.not.throw();
      g.players.should.have.length(4);
      checkGame(g);
      g.startGame.bind(g, {
        players: 2,
        cards: [Gold],
        mode: base
      }).should.not.throw();
      g.players.should.have.length(2);
      checkGame(g);
    });
    it('should have the right number of availabe cards', function() {
      var g = Game.new();
      g.startGame.bind(g, {
        players: 2,
        cards: [Gold, Silver],
        mode: base
      }).should.not.throw();
      g.should.have.property('cards').and.be.an.Object;
      _.forOwn(g.cards, function(v) {
        v.should.have.property('card');
        v.should.have.property('instance');
        if (v.instance.is('victory'))
          v.should.have.property('amount', 8);
        else // kingdom
          v.should.have.property('amount', 10);
      });
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
    it('should start over again after last player', function() {
      var g = Game.new();
      g.startGame.bind(g, {
        players: 2,
        cards: [Gold],
        mode: base
      }).should.not.throw();
      var p = g.currentPlayer();
      g.playerTurn.should.be.eql(0);
      g.endTurn.bind(g).should.not.throw();
      g.playerTurn.should.be.eql(1);
      g.endTurn.bind(g).should.not.throw();
      g.currentPlayer().should.be.equal(p);
      g.playerTurn.should.be.eql(0);
    });
    it.skip('should be able to buy cards and add them to the deck', function() {
      var g = Game.new();
      g.startGame.bind(g, {
        players: 2,
        cards: [Gold],
        mode: base
      }).should.not.throw();
      var p = g.currentPlayer();
      g.buy('gold');
    });
  });

});
