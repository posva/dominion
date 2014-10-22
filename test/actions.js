/*jshint -W030 */
var requirejs = require('requirejs');
var assert = require('assert');
var should = require('should');
requirejs.config({
  baseUrl: 'js',
  nodeRequire: require
});

describe('Actions Testing', function() {
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

  describe('#Event based actions', function(){
    it('should work with a single event action');
    it('should work with a multi event action');
    it('should fail if event is invalid');
  });
  describe('#Function based actions', function(){
    it('should work with a single function action');
    it('should work with a multi function action');
    it('should fail if function is invalid');
  });
  describe('#Mixed actions', function(){
    it('should work with actions with one event and one function');
    it('should work with actions with one event and multiple functions');
    it('should work with actions with multiple events and one function');
  });
  describe('#Prefixed actions', function(){
    it('should work with a "choose" functions cards');
    it('should work with a "choose" events cards');
    it('should work with a "choose" with mixed events and functions cards');
    it('should work with a "random" card');
  });
  describe('#Recursive actions', function(){
    it('should randomly branch');
    it('should wisely branch (choose)');
  });

});
