var requirejs = require("requirejs");
var assert = require("assert");
var should = require("should");
requirejs.config({
  baseUrl: 'js',
  nodeRequire: require
});

describe('Card Testing', function() {
  // module loading
  // Load modules with requirejs before tests
  var Card, Victory, Treasure;
  before(function(done) {
    requirejs(['card', 'victory', 'treasure'], function(card, victory, treasure) {
      Card = card;
      Victory = victory;
      Treasure = treasure;
      done();
    });
  });

  describe('#instanciation', function(){
    it('should work without problems', function(){
      Card.should.have.property('new');
      var c1 = Card.new(1);
      var c2 = Card.new();
      c1.should.have.property('img', "");
      c1.should.have.property('cost', 1);
      c2.should.have.property('img', "");
      c2.should.have.property('cost', 0);
    });
  });

  describe('#Victory+Card', function() {
    it('should be able to create some victory cards', function() {
      var Estate = Card.extend(Victory, {
        initialize: function() {
          Card.initialize.call(this, 2);
          Victory.initialize.call(this, 1);
        },
      });

      Card.isPrototypeOf(Estate).should.be.true;

      var e = Estate.new();
      e.should.have.property('cost', 2);
      e.should.have.property('points', 1);
      e.should.not.have.property('money');
      e.type.should.have.length(1);
      e.type.should.containEql('victory');
    });
  });

  describe('#Treasure+Card', function() {
    it('should be able to create some treasure cards', function() {
      var Copper = Card.extend(Treasure, {
        initialize: function() {
          Card.initialize.call(this, 0);
          Treasure.initialize.call(this, 1);
        }
      });

      Card.isPrototypeOf(Copper).should.be.true;

      var c = Copper.new();
      c.should.have.property('money', 1);
      c.should.not.have.property('points');
      c.should.have.property('cost', 0);
      c.type.should.have.length(1);
      c.type.should.containEql('treasure');
    });
  });

  describe('#Treasure+Victory+Card', function() {
    it('should be able to create some mixted cards (cf Harem) cards', function() {
      var Harem = Card.extend(Treasure, Victory, {
        initialize: function() {
          Card.initialize.call(this, 6);
          Treasure.initialize.call(this, 2);
          Victory.initialize.call(this, 2);
        }
      });

      Card.isPrototypeOf(Harem).should.be.true;

      var c = Harem.new();
      c.should.have.property('money', 2);
      c.should.have.property('points', 2);
      c.should.have.property('cost', 6);
      c.type.should.have.length(2);
      c.type.should.containEql('treasure').and.containEql('victory');
    });
  });
});
