/*jshint -W030 */
var requirejs = require('requirejs');
var assert = require('assert');
var should = require('should');
requirejs.config({
  baseUrl: 'js',
  nodeRequire: require
});

describe.skip('Actions Testing', function() {
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
  beforeEach(function() {
    game.startGame({
      players: 2,
      cards: [Gold, Silver, Duchy],
      mode: base
    });
  });

  describe('#Event based actions', function(){
    it('should work with a single event action', function() {
      var A = Card.extend(Action, {
        initialize: function(game)  {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            Event.new(game, 'cards 2')
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      // add it to the player hand (what a cheater!)
      p.hand.push(a);
      game.play.bind(game, 5).should.not.throw(); // play card at index 5 in players hand
      p.hand.should.have.lengthOf(6); // he played one card and drew 2
    });
    it('should work with a multi event action', function() {
      var A = Card.extend(Action, {
        initialize: function(game)  {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            Event.new(game, 'cards 2'),
            Event.new(game, 'buys 2')
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      p.hand.push(a);
      game.play.bind(game, 5).should.not.throw();
      p.hand.should.have.lengthOf(6);
      game.buys.should.be.eql(3);
    });
    it('should fail if event is invalid', function() {
      var A = Card.extend(Action, {
        initialize: function(game)  {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            Event.new(game, 'wrong 2'),
            Event.new(game, 'buys 2')
          ]);
        },
      });
      A.new.bind(A, game).should.throw(/wrong.*valid.*event/);
    });
  });
  describe('#Function based actions', function(){
    it('should work with a single function action', function() {
      var A = Card.extend(Action, {
        initialize: function(game)  {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            (function(game) {
              game.currentPlayer().graveyard.push(Gold.new());
            }).bind(null, game)
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      p.hand.push(a);
      game.play.bind(game, 5).should.not.throw();
      p.graveyard.should.containEql(Gold.new());
    });
    it('should work with a multi function action', function() {
      var A = Card.extend(Action, {
        initialize: function(game)  {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            (function(game) {
              game.currentPlayer().graveyard.push(Gold.new());
            }).bind(null, game),
            (function(game) {
              game.currentPlayer().graveyard.push(Silver.new());
            }).bind(null, game),
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      p.hand.push(a);
      game.play.bind(game, 5).should.not.throw();
      p.graveyard.should.containEql(Gold.new());
      p.graveyard.should.containEql(Silver.new());
    });
    it('should be able to detect if function is invalid', function() {
      var A = Card.extend(Action, {
        initialize: function(game)  {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            null // not a valid thing
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      a.checkEventArray.bind(a).should.throw(/invalid.*event/);
    });
  });
  describe('#Mixed actions', function(){
    it('should work with actions with one event and one function', function() {
      var A = Card.extend(Action, {
        initialize: function(game)  {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            Event.new(game, 'cards 1'),
            (function(game) {
              game.currentPlayer().graveyard.push(Silver.new());
            }).bind(null, game),
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      p.hand.push(a);
      game.play.bind(game, 5).should.not.throw();
      p.graveyard.should.containEql(Silver.new());
      p.hand.should.have.lengthOf(5);
    });
    it('should work with actions with one event and multiple functions', function() {
      var A = Card.extend(Action, {
        initialize: function(game)  {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            Event.new(game, 'cards 1'),
            (function(game) {
              game.currentPlayer().graveyard.push(Silver.new());
            }).bind(null, game),
            (function(game) {
              game.currentPlayer().graveyard.push(Gold.new());
            }).bind(null, game),
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      p.hand.push(a);
      game.play.bind(game, 5).should.not.throw();
      p.graveyard.should.containEql(Silver.new());
      p.graveyard.should.containEql(Gold.new());
      p.hand.should.have.lengthOf(5);
    });
    it('should work with actions with multiple events and one function', function() {
      var A = Card.extend(Action, {
        initialize: function(game)  {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            Event.new(game, 'cards 1'),
            Event.new(game, 'buys 1'),
            (function(game) {
              game.currentPlayer().graveyard.push(Gold.new());
            }).bind(null, game),
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      p.hand.push(a);
      game.play.bind(game, 5).should.not.throw();
      p.graveyard.should.containEql(Gold.new());
      p.hand.should.have.lengthOf(5);
      game.buys.should.be.eql(2);
    });
    it('should work with actions with multiple events and multiple functions', function() {
      var A = Card.extend(Action, {
        initialize: function(game)  {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            Event.new(game, 'cards 1'),
            Event.new(game, 'buys 1'),
            (function(game) {
              game.currentPlayer().graveyard.push(Gold.new());
            }).bind(null, game),
            (function(game) {
              game.currentPlayer().graveyard.push(Silver.new());
            }).bind(null, game),
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      p.hand.push(a);
      game.play.bind(game, 5).should.not.throw();
      p.graveyard.should.containEql(Gold.new());
      p.graveyard.should.containEql(Silver.new());
      p.hand.should.have.lengthOf(5);
      game.buys.should.be.eql(2);
    });
  });
  describe('#Prefixed actions', function(){
    it('should work with "choose" functions cards', function() {
      var A = Card.extend(Action, {
        initialize: function(game)  {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            'choose', // eq to choose 1
            (function(game) {
              game.currentPlayer().graveyard.push(Gold.new());
            }).bind(null, game),
            (function(game) {
              game.currentPlayer().graveyard.push(Silver.new());
            }).bind(null, game),
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      p.hand.push(a);
      game.play.bind(game, 5).should.not.throw();
      game.choose(0);
      p.graveyard.should.containEql(Gold.new());
      p.graveyard.should.not.containEql(Silver.new());

      // play again
      p.hand.push(a);
      game.addActions(1); // or we won't be able to play
      game.play.bind(game, 5).should.not.throw();
      game.choose(1);
      p.graveyard.should.containEql(Gold.new());
      p.graveyard.should.containEql(Silver.new());
    });
    it('should work with "choose" events cards', function() {
      var A = Card.extend(Action, {
        initialize: function(game)  {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            'choose',
            Event.new(game, 'cards 1'),
            Event.new(game, 'buys 1'),
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      p.hand.push(a);
      game.play.bind(game, 5).should.not.throw();
      game.choose(0);
      p.hand.should.have.lengthOf(5);
      game.buys.should.be.eql(1);

      game.addActions(1); // or we won't be able to play
      p.hand.push(a);
      game.play.bind(game, 5).should.not.throw();
      game.choose(1);
      game.buys.should.be.eql(2);
    });
    it('should work with a "choose" with mixed events and functions cards', function() {
      var A = Card.extend(Action, {
        initialize: function(game)  {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            'choose',
            Event.new(game, 'cards 1'),
            Event.new(game, 'buys 1'),
            (function(game) {
              game.currentPlayer().graveyard.push(Gold.new());
            }).bind(null, game),
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      p.hand.push(a);
      game.play.bind(game, 5).should.not.throw();
      game.choose(0);
      p.hand.should.have.lengthOf(5);
      game.buys.should.be.eql(1);
      p.graveyard.should.not.containEql(Gold.new());

      game.addActions(1); // or we won't be able to play
      p.hand.push(a);
      game.play.bind(game, 5).should.not.throw();
      game.choose(2);
      p.graveyard.should.containEql(Gold.new());
    });
    it('should work with a "random" card');
  });
  describe('#Recursive actions', function(){
    it('should fire all events in a simple recursive array');
    it('should randomly branch');
    it('should wisely branch (choose)');
  });

});
