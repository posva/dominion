var requirejs = require('requirejs');
var assert = require('assert');
var should = require('should');
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
      var c1 = Card.new('name', 'text', 1, 'img.jpg');
      var c2 = Card.new();
      var c3 = Card.new({
        cost: 3,
        name: 'test',
        text: 'sample text',
        img: 'img.png'
      });
      c1.should.have.property('img', 'img.jpg');
      c1.should.have.property('name', 'name');
      c1.should.have.property('text', 'text');
      c1.should.have.property('cost', 1);
      c1.should.have.property('type').and.be.an.instanceOf(Array).and.have.length(0);

      c2.should.have.property('img', '');
      c2.should.have.property('cost', 0);
      c2.should.have.property('type').and.be.an.instanceOf(Array).and.have.length(0);

      c3.should.have.property('img', 'img.png');
      c3.should.have.property('cost', 3);
      c3.should.have.property('name', 'test');
      c3.should.have.property('text', 'sample text');
      c3.should.have.property('type').and.be.an.instanceOf(Array).and.have.length(0);
    });
  });

  describe('#Victory+Card', function() {
    it('should be able to create some victory cards', function() {
      var Estate = Card.extend(Victory, {
        initialize: function() {
          Card.initialize.call(this, {cost: 2});
          Victory.initialize.call(this, 1);
        },
      });

      Card.isPrototypeOf(Estate).should.be.true;

      var e = Estate.new();
      e.should.have.property('cost', 2);
      e.points().should.be.eql(1);
      e.should.not.have.property('money');
      e.type.should.have.length(1);
      e.type.should.containEql('victory');
    });
  });

  describe('#Treasure+Card', function() {
    it('should be able to create some treasure cards', function() {
      var Copper = Card.extend(Treasure, {
        initialize: function() {
          Card.initialize.call(this, {cost:0});
          Treasure.initialize.call(this, 1);
        }
      });

      Card.isPrototypeOf(Copper).should.be.true;

      var c = Copper.new();
      c.should.have.property('money');
      c.money().should.be.eql(1);
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
          Card.initialize.call(this, {cost:6});
          Treasure.initialize.call(this, 2);
          Victory.initialize.call(this, 2);
        }
      });

      Card.isPrototypeOf(Harem).should.be.true;

      var c = Harem.new();
      c.should.have.property('money');
      c.money().should.be.eql(2);
      c.points().should.be.eql(2);
      c.should.have.property('cost', 6);
      c.type.should.have.length(2);
      c.type.should.containEql('treasure').and.containEql('victory');
    });
  });

  describe('#Chained inheritance', function() {
    it('should be the same as multiple args extend()', function() {
      var obj = {
        initialize: function() {
          Card.initialize.call(this, {cost:6});
          Treasure.initialize.call(this, 2);
          Victory.initialize.call(this, 2);
        }
      };

      var Harem = Card.extend(Treasure, Victory, obj);

      var Harem2 = Card.extend(Treasure);
      Harem2 = Harem2.extend(Victory, obj);
      // it's necessary to add an object litteral with the initialize function
      // Furthermore it must be added at the end

      // the prototype is Card
      Card.isPrototypeOf(Harem).should.be.true;
      Treasure.isPrototypeOf(Harem).should.be.false;
      Victory.isPrototypeOf(Harem).should.be.false;

      Card.isPrototypeOf(Harem2).should.be.true;
      Treasure.isPrototypeOf(Harem2).should.be.false;
      Victory.isPrototypeOf(Harem2).should.be.false;

      var h1 = Harem.new(),
      h2 = Harem2.new();

      var test = function(c) {
        c.should.have.property('money');
        c.money().should.be.eql(2);
        c.points().should.be.eql(2);
        c.should.have.property('cost', 6);
        c.type.should.have.length(2);
        c.type.should.containEql('treasure').and.containEql('victory');
      };

      test(h1);
      test(h2);
    });
  });

  describe('#treasure with variable money', function(){
    it('should return a variable value', function(){
      var TestCard = Card.extend(Treasure, {
        initialize: function() {
          Card.initialize.call(this);
          Treasure.initialize.call(this, function() {
            return Math.floor(Math.random()*10);
          });
        }
      });
      var t = TestCard.new(), i;
      for (i = 0; i < 10; i++) {
        t.money().should.be.within(0, 10);
      }
    });
  });

  describe('#victory with variable points', function(){
    it('should return a variable value', function(){
      var TestCard = Card.extend(Victory, {
        initialize: function() {
          Card.initialize.call(this);
          Victory.initialize.call(this, function() {
            return Math.floor(Math.random()*10);
          });
        }
      });
      var t = TestCard.new(), i;
      for (i = 0; i < 10; i++) {
        t.points().should.be.within(0, 10);
      }
    });
  });

});
