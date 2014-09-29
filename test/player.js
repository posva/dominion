var requirejs = require('requirejs');
var assert = require('assert');
var should = require('should');
requirejs.config({
  baseUrl: 'js',
  nodeRequire: require
});

describe('Player tests', function() {
  // Load modules with requirejs before tests
  var Copper, Estate, Player;
  before(function(done) {
    requirejs(['player', 'cards/copper', 'cards/estate'], function(player, copper, estate) {
      Player = player;
      Copper = copper;
      Estate = estate;
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

  describe('#Player instances', function(){
    it('should create some players', function(){
      Player.new.bind(Player, playerInitializer).should.not.throw();
      var p = Player.new(playerInitializer);
      p.should.be.ok;
      p.deck.should.have.lengthOf(10);
      p.hand.should.have.length(0);
      p.field.should.have.length(0);
      p.graveyard.should.have.length(0);
    });
    it('should fail creating some players', function(){
      Player.new.bind(Player).should.throw();
    });
    it('should be able to end turns', function() {
      var p = Player.new(playerInitializer);
      var i;
      for (i = 0; i < 20; i++) {
        p.endTurn.bind(p).should.not.throw();
      }
      (p.deck.length + p.graveyard.length + p.hand.length).should.be.eql(10);
      p.hand.should.have.lengthOf(5);
    });
    it('should not be able to draw too much cards');
  });

});
