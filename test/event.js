/*jshint -W030 */
'use strict';
require('should');
var Game = require('../js/game');
var ActionEvent = require('../js/action-event');
var Silver = require('../js/cards/silver');
var Gold = require('../js/cards/gold');
var Duchy = require('../js/cards/duchy');
var base = require('../js/modes/base');

describe('Event Testing', function() {
  var game;
  before(function(done) {
    game = Game.new();
    done();
  });

  describe('#Event instances', function() {
    it('should create valid events', function() {
      ActionEvent.new.bind(ActionEvent, game, 'cards 1').should.not.throw();
      ActionEvent.new.bind(ActionEvent, game, 'actions 1').should.not.throw();
      ActionEvent.new.bind(ActionEvent, game, 'buys 1').should.not.throw();
      ActionEvent.new.bind(ActionEvent, game, 'money 1').should.not.throw();
      ActionEvent.new.bind(ActionEvent, game, 'none').should.not.throw();
      var e = ActionEvent.new(game, 'cards 2');
      e.should.have.property('fire');
      e.fire.should.be.a.Function;
    });
    it('should fail creating invalid events', function() {
      ActionEvent.new.bind(ActionEvent).should.throw();
      ActionEvent.new.bind(ActionEvent, game).should.throw();
      ActionEvent.new.bind(ActionEvent, game, 'badevent').should.throw(/not a valid event/);
      ActionEvent.new.bind(ActionEvent, game, 'cards1').should.throw(/not a valid event/);
      ActionEvent.new.bind(ActionEvent, game, 23).should.throw();
    });
  });
  describe('#Event execution', function() {
    beforeEach(function() {
      game.startGame({
        players: 2,
        cards: [Gold, Silver, Duchy],
        mode: base
      });
    });
    it('should draw cards', function() {
      var e = ActionEvent.new(game, 'cards 1');
      var p = game.currentPlayer();
      e.fire.bind(e).should.not.throw();
      p.hand.should.have.lengthOf(6);

      e = ActionEvent.new(game, 'cards 3');
      e.fire.bind(e).should.not.throw();
      p.hand.should.have.lengthOf(9);
    });
    it('should add money', function() {
      var e = ActionEvent.new(game, 'money 1');
      e.fire.bind(e).should.not.throw();
      game.money.should.be.eql(1);

      e = ActionEvent.new(game, 'money 3');
      e.fire.bind(e).should.not.throw();
      game.money.should.be.eql(4);
    });
    it('should add actions', function() {
      var e = ActionEvent.new(game, 'actions 1');
      e.fire.bind(e).should.not.throw();
      game.actions.should.be.eql(2);

      e = ActionEvent.new(game, 'actions 3');
      e.fire.bind(e).should.not.throw();
      game.actions.should.be.eql(5);
    });
    it('should add buys', function() {
      var e = ActionEvent.new(game, 'buys 1');
      e.fire.bind(e).should.not.throw();
      game.buys.should.be.eql(2);

      e = ActionEvent.new(game, 'buys 3');
      e.fire.bind(e).should.not.throw();
      game.buys.should.be.eql(5);
    });
    it('should do nothing', function() {
      var e = ActionEvent.new(game, 'none');
      e.fire.bind(e).should.not.throw();
      game.buys.should.be.eql(1);
      game.money.should.be.eql(0);
      game.actions.should.be.eql(1);
      game.currentPlayer().hand.should.have.lengthOf(5);
    });
  });

});
