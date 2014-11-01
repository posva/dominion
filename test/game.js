/*jshint -W030 */
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
  var Game, base, Gold, Silver, Duchy, GreatHall, Player;
  before(function(done) {
    requirejs(['game', 'modes/base', 'cards/gold', 'cards/silver', 'cards/duchy', 'cards/intrigue/great-hall', 'player'], function(game, b, gold, silver, duchy, gh, player) {
      Game = game;
      base = b;
      Gold = gold;
      Silver = silver;
      Duchy = duchy;
      GreatHall = gh;
      Player = player;
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
        if (v.name === 'Copper') {
          coppers++;
        }else{
          estates++;
        }
      });
      coppers.should.be.within(2, 5);
      estates.should.be.within(0, 3);
      var shE = 3 - estates, shC = 7 - coppers, oE = estates, oC = coppers;
      coppers = 0;
      estates = 0;
      _.forOwn(p.hand, function(v) {
        v.should.have.property('name');
        cards.should.containEql(v.name);
        if (v.name === 'Copper') {
          coppers++;
        }else{
          estates++;
        }
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
        if (v.name === 'Copper') {
          coppers++;
        }else{
          estates++;
        }
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
    it('should have the right number of available cards', function() {
      var g = Game.new();
      g.startGame.bind(g, {
        players: 2,
        cards: [Duchy],
        mode: base
      }).should.not.throw();
      g.should.have.property('cards').and.be.an.Object;
      _.forOwn(g.cards, function(v) {
        v.should.have.property('card');
        v.should.have.property('instance');
        if (v.instance.is('victory')) {
          v.should.have.property('amount', 8);
        }else if (v.instance.is('action')) { // kingdom
          v.should.have.property('amount', 10);
        } else {
          v.should.have.property('amount', base.cards[v.instance.name].amount[0]);
        }
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
    var g;
    beforeEach(function() {
      g = Game.new();
      g.startGame({
        players: 2,
        cards: [Gold, GreatHall],
        mode: base
      });
    });
    it('should get relative players with 2 players', function() {
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
      var p = g.currentPlayer();
      var i, o;
      for (i = 0; i < 10; i++) {
        g.playerTurn.should.be.eql(0);
        g.endTurn.bind(g).should.not.throw();
        g.playerTurn.should.be.eql(1);
        o = g.currentPlayer();
        (o.hand.length + o.graveyard.length + o.deck.length).should.be.eql(10);
        g.endTurn.bind(g).should.not.throw();
        g.currentPlayer().should.be.equal(p);
        o = g.currentPlayer();
        (o.hand.length + o.graveyard.length + o.deck.length).should.be.eql(10);
      }
    });
    it('should be able to buy cards and actually get them', function() {
      var p = g.currentPlayer();
      var gold = g.cards.Gold.instance;
      g.endActions();
      g.addMoney(20);
      g.addBuys(1);
      g.buy('Gold').should.be.eql(gold);
      g.buys.should.be.eql(1);
      g.buy('Gold').should.be.eql(gold);
      g.buys.should.be.eql(0);
      p.field.should.have.lengthOf(2);
      p.field.should.containEql(gold);
      g.endTurn();
      p.field.should.have.lengthOf(0);
      p.graveyard.should.containEql(gold);
    });
    it('should buy cards from expansion and from mode', function() {
      var p = g.currentPlayer();
      var gold = g.cards.Gold.instance;
      var copper = g.cards.Copper.instance;
      var province = g.cards.Province.instance;
      g.endActions();
      g.addMoney(14);
      g.addBuys(2);
      g.buy('Gold').should.be.eql(gold);
      g.buy('Copper').should.be.eql(copper);
      g.buy('Province').should.be.eql(province);
      g.buys.should.be.eql(0);
      p.field.should.have.lengthOf(3);
      p.field.should.containEql(gold);
      p.field.should.containEql(province);
      p.field.should.containEql(copper);
    });
    it('should not be able to buy more than allowed', function() {
      var p = g.currentPlayer();
      var gold = g.cards.Gold.instance;
      g.endActions();
      g.addMoney(20);
      g.buys.should.be.eql(1);
      g.buy('Gold').should.be.eql(gold);
      should(g.buy('Gold')).be.eql(null); // no more buys
      should(g.buy('Gold')).be.eql(null);
      p.field.should.have.lengthOf(1);
      g.buys.should.be.eql(0);
      p.field.should.containEql(gold);
    });
    it('should not be able to buy cards that doesn\'t exist', function() {
      should(g.buy('Bad card name')).be.eql(null);
    });
    it('should not be able to buy with less money', function() {
      var p = g.currentPlayer();
      var gold = g.cards.Gold.instance;
      g.endActions();
      g.buys.should.be.eql(1);
      should(g.buy('Gold')).be.eql(null); // no more buys
      g.addMoney(1);
      should(g.buy('Gold')).be.eql(null);
      g.addMoney(1);
      should(g.buy('Gold')).be.eql(null);
      g.addMoney(1);
      should(g.buy('Gold')).be.eql(null);
      p.field.should.have.lengthOf(0);
      g.buys.should.be.eql(1);
      g.money.should.be.eql(3);
    });
    it('should be able to play an action if not buying', function() {
      var p = g.currentPlayer();
      var greatH = g.cards['Great Hall'].instance;
      p.hand.push(greatH);
      p.hand.containCard('Great Hall').should.be.ok;
      // the first phase is always action
      g.phase.should.be.eql('action');
      p.hand.should.have.lengthOf(6);
      g.play(5).should.be.eql(greatH); // we played the right card
      p.field.should.have.lengthOf(1);
      p.hand.should.have.lengthOf(6); // +1 card from GH
      p.field.containCard('Great Hall').should.be.ok;
      p.hand.containCard('Great Hall').should.not.be.ok;
      g.actions.should.be.eql(1); // because of Great Hall
    });
    it('should not be able to play an action if buying', function() {
      var p = g.currentPlayer();
      var greatH = g.cards['Great Hall'].instance;
      p.hand.push(greatH);
      p.hand.containCard('Great Hall').should.be.ok;
      // the first phase is always action
      g.endActions();
      g.phase.should.be.eql('buy');
      p.hand.should.have.lengthOf(6);
      should(g.play(5)).be.eql(null); // we cannot play the card!
      should(g.play(5)).be.eql(null);
      should(g.play(5)).be.eql(null);
      p.field.should.have.lengthOf(0);
      p.hand.should.have.lengthOf(6);
      p.hand[5].should.be.eql(greatH);
      g.actions.should.be.eql(1); // we played nothing
    });
    it('should not be able to play an action if no actions are left', function() {
      var p = g.currentPlayer();
      var greatH = g.cards['Great Hall'].instance;
      p.hand.push(greatH);
      p.hand.containCard('Great Hall').should.be.ok;
      // the first phase is always action
      g.actions = 0;
      p.hand.should.have.lengthOf(6);
      should(g.play(5)).be.eql(null); // we cannot play the card!
      should(g.play(5)).be.eql(null);
      should(g.play(5)).be.eql(null);
      p.field.should.have.lengthOf(0);
      p.hand.should.have.lengthOf(6);
      p.hand[5].should.be.eql(greatH);
      g.actions.should.be.eql(0); // we played nothing
    });
    it('should be able to play treasures if not playing actions', function() {
      var p = g.currentPlayer();
      var gg = g.cards.Gold.instance;
      p.hand.push(gg);
      p.hand.containCard('Gold').should.be.ok;
      g.endActions();
      p.hand.should.have.lengthOf(6);
      g.play(5).should.be.eql(gg); // we cannot play the card!
      p.field.should.have.lengthOf(1);
      p.hand.should.have.lengthOf(5);
      p.field[0].should.be.eql(gg);
      g.money.should.be.eql(3); // we played nothing
    });
    it('should not be able to play treasures if playing actions', function() {
      var p = g.currentPlayer();
      var gg = g.cards.Gold.instance;
      p.hand.push(gg);
      p.hand.containCard('Gold').should.be.ok;
      p.hand.should.have.lengthOf(6);
      should(g.play(5)).be.eql(null); // we cannot play the card!
      should(g.play(5)).be.eql(null);
      should(g.play(5)).be.eql(null);
      p.field.should.have.lengthOf(0);
      p.hand.should.have.lengthOf(6);
      p.hand[5].should.be.eql(gg);
      g.money.should.be.eql(0); // we played nothing
    });
  });

});
