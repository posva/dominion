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
  var Event, Game, Card, Action, game;
  before(function(done) {
    requirejs(['game', 'event', 'card', 'action'], function(game, event, card, action) {
      Game = game;
      Event = event;
      Action = action;
      Card = card;
      done();
    });
  });

  before(function(done) {
    game = Game.new();
    done();
  });

  describe('#Event instances', function(){
    it('should create valid events', function() {
      Event.new.bind(Event, game, 'cards 1').should.not.throw();
      Event.new.bind(Event, game, 'actions 1').should.not.throw();
      Event.new.bind(Event, game, 'buys 1').should.not.throw();
      Event.new.bind(Event, game, 'money 1').should.not.throw();
      var e = Event.new(game, 'cards 2');
      e.should.have.property('fire');
      e.fire.should.be.a.Function;
    });
    it('should fail creating invalid events', function(){
      Event.new.bind(Event).should.throw();
      Event.new.bind(Event, game).should.throw();
      Event.new.bind(Event, game, 'badevent').should.throw(/not a valid event/);
      Event.new.bind(Event, game, 'cards1').should.throw(/not a valid event/);
      Event.new.bind(Event, game, 23).should.throw();
    });
  });
  describe('#Event execution', function(){
    it('should draw cards');
    it('should add money');
    it('should add actions');
  });

});
