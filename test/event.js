var requirejs = require('requirejs');
var assert = require('assert');
var should = require('should');
requirejs.config({
  baseUrl: 'js',
  nodeRequire: require
});

describe('Event Testing', function() {
  // Load modules with requirejs before tests
  var Event, Game;
  before(function(done) {
    requirejs(['game', 'event'], function(game, event) {
      Game = game;
      Event = event;
      done();
    });
  });

  describe('#Event instances', function(){
    it('should create valid events');
    it('should fail creating bad events');
  });
  describe('#Event execution', function(){
    it('should draw cards');
    it('should add money');
    it('should add actions');
  });

});
