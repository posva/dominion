/*jshint -W030 */
var requirejs = require('requirejs');
var assert = require('assert');
var should = require('should');
requirejs.config({
  baseUrl: 'js',
  nodeRequire: require
});

describe('Event Testing', function() {
  // Load modules with requirejs before tests
  var Event, Game, Card, Action, game, Gold, Silver, Duchy, base;
  before(function(done) {
    requirejs(['game', 'event', 'card', 'action', 'cards/gold', 'cards/silver', 'cards/duchy', 'modes/base'], function(game, event, card, action, gold, silver, duchy, B) {
      Game = game;
      Event = event;
      Action = action;
      Card = card;
      Gold = gold;
      Silver = silver;
      Duchy = duchy;
      base = B;
      done();
    });
  });

  before(function(done) {
    game = Game.new();
    done();
  });

  describe('#Event instances', function() {
    it('should create valid events', function() {
      Event.new.bind(Event, game, 'cards 1').should.not.throw();
      Event.new.bind(Event, game, 'actions 1').should.not.throw();
      Event.new.bind(Event, game, 'buys 1').should.not.throw();
      Event.new.bind(Event, game, 'money 1').should.not.throw();
      var e = Event.new(game, 'cards 2');
      e.should.have.property('fire');
      e.fire.should.be.a.Function;
    });
    it('should fail creating invalid events', function() {
      Event.new.bind(Event).should.throw();
      Event.new.bind(Event, game).should.throw();
      Event.new.bind(Event, game, 'badevent').should.throw(/not a valid event/);
      Event.new.bind(Event, game, 'cards1').should.throw(/not a valid event/);
      Event.new.bind(Event, game, 23).should.throw();
    });
  });
  describe('#Event execution', function() {
    it('should draw cards', function() {
      game.startGame.bind(game, {
        players: 2,
        cards: [Gold, Silver, Duchy],
        mode: base
      }).should.not.throw();
      var e = Event.new(game, 'cards 1');
      var p = game.currentPlayer();
      e.fire.bind(e).should.not.throw();
      p.hand.should.have.lengthOf(6);

      e = Event.new(game, 'cards 3');
      e.fire.bind(e).should.not.throw();
      p.hand.should.have.lengthOf(9);
    });
    it('should add money', function() {
      game.startGame.bind(game, {
        players: 2,
        cards: [Gold, Silver, Duchy],
        mode: base
      }).should.not.throw();
      var e = Event.new(game, 'money 1');
      e.fire.bind(e).should.not.throw();
      game.money.should.be.eql(1);

      e = Event.new(game, 'money 3');
      e.fire.bind(e).should.not.throw();
      game.money.should.be.eql(4);
    });
    it('should add actions', function() {
      game.startGame.bind(game, {
        players: 2,
        cards: [Gold, Silver, Duchy],
        mode: base
      }).should.not.throw();
      var e = Event.new(game, 'actions 1');
      e.fire.bind(e).should.not.throw();
      game.actions.should.be.eql(2);

      e = Event.new(game, 'actions 3');
      e.fire.bind(e).should.not.throw();
      game.actions.should.be.eql(5);
    });
    it('should add buys', function() {
      game.startGame.bind(game, {
        players: 2,
        cards: [Gold, Silver, Duchy],
        mode: base
      }).should.not.throw();
      var e = Event.new(game, 'buys 1');
      e.fire.bind(e).should.not.throw();
      game.buys.should.be.eql(2);

      e = Event.new(game, 'buys 3');
      e.fire.bind(e).should.not.throw();
      game.buys.should.be.eql(5);
    });
  });

});
