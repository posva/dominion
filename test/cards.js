/*jshint -W030 */
'use strict';
require('should');
var Game = require('../js/game');
var ActionEvent = require('../js/action-event');
var Card = require('../js/card');
var Action = require('../js/action');
var Curse = require('../js/curse');
var Treasure = require('../js/treasure');
var Victory = require('../js/victory');
require('../js/utils');
var Gold = require('../js/cards/gold');
var base = require('../js/modes/base');

describe('Card Testing', function() {

  describe('#instanciation', function() {
    it('should create cards with costs, names, texts and images', function() {
      Card.should.have.property('new');
      var c1 = Card.new('name', 1);
      var c2 = Card.new();
      var c3 = Card.new({
        cost: 3,
        name: 'test',
      });
      c1.should.have.property('name', 'name');
      c1.should.have.property('cost');
      c1.cost.should.be.a.Function;
      c1.cost().should.be.eql(1);
      c1.should.have.property('type').and.be.an.instanceOf(Array).and.have.length(0);

      c2.should.have.property('cost');
      c2.cost.should.be.a.Function;
      c2.cost().should.be.eql(0);
      c2.should.have.property('type').and.be.an.instanceOf(Array).and.have.length(0);

      c3.should.have.property('cost');
      c3.cost.should.be.a.Function;
      c3.cost().should.be.eql(3);
      c3.should.have.property('name', 'test');
      c3.should.have.property('type').and.be.an.instanceOf(Array).and.have.length(0);
    });
    it('should have a variable cost', function() {
      var i = 0;
      var f = function(/*game*/) {
        return i++;
      };
      var c = Card.new('name', f);
      c.cost().should.be.eql(0);
      c.cost().should.be.eql(1);
      c.cost().should.be.eql(2);
      c = Card.new({
        cost: f,
        name: 'test',
      });
      i = 0;
      c.cost().should.be.eql(0);
      c.cost().should.be.eql(1);
      c.cost().should.be.eql(2);
    });
  });

  describe('#Combining', function() {
    it('should be able to create some victory cards', function() {
      var Estate = Card.extend(Victory, {
        initialize: function() {
          Card.initialize.call(this, {
            cost: 2
          });
          Victory.initialize.call(this, 1);
        },
      });

      Card.isPrototypeOf(Estate).should.be.true;

      var e = Estate.new();
      e.cost().should.be.eql(2);
      e.points().should.be.eql(1);
      e.should.not.have.property('money');
      e.type.should.have.length(1);
      e.type.should.containEql('victory');
      e.is('victory').should.be.ok;
      e.is('treasure').should.not.be.ok;
    });

    it('should be able to create some treasure cards', function() {
      var Copper = Card.extend(Treasure, {
        initialize: function() {
          Card.initialize.call(this, {
            cost: 0
          });
          Treasure.initialize.call(this, 1);
        }
      });

      Card.isPrototypeOf(Copper).should.be.true;

      var c = Copper.new();
      c.should.have.property('money');
      c.money().should.be.eql(1);
      c.should.not.have.property('points');
      c.cost().should.be.eql(0);
      c.type.should.have.length(1);
      c.type.should.containEql('treasure');
      c.is('treasure').should.be.ok;
    });

    it('should be able to create some mixted cards (cf Harem) cards', function() {
      var Harem = Card.extend(Treasure, Victory, {
        initialize: function() {
          Card.initialize.call(this, {
            cost: 6
          });
          Treasure.initialize.call(this, 2);
          Victory.initialize.call(this, 2);
        }
      });

      Card.isPrototypeOf(Harem).should.be.true;

      var c = Harem.new();
      c.should.have.property('money');
      c.money().should.be.eql(2);
      c.points().should.be.eql(2);
      c.cost().should.be.eql(6);
      c.type.should.have.length(2);
      c.type.should.containEql('treasure').and.containEql('victory');
      c.is('treasure').should.be.ok;
      c.is('victory').should.be.ok;
    });

    it('should create an action card', function() {
      var game = Game.new();
      game.startGame.bind(game, {
        players: 2,
        cards: [Gold],
        mode: base
      }).should.not.throw();
      var events = [

        function() {
          // do something
        },
        ActionEvent.new(game, 'cards 1')
      ];
      var Ac = Card.extend(Action, {
        initialize: function() {
          Card.initialize.call(this, {
            cost: 2
          });
          Action.initialize.call(this, events);
        }
      });
      Ac.new.bind(Ac).should.not.throw();
      var c = Ac.new(game);
      c.checkEventArray.bind(c).should.not.throw();
      c.play.should.be.a.Function;
      c.play.bind(c).should.not.throw();
      c.is('action').should.be.ok;
      c.is('treasure').should.not.be.ok;
    });

    it('should fail creating invalid actions cards', function() {
      var A = Card.extend(Action, {
        initialize: function() {
          Card.initialize.call(this, {
            cost: 2
          });
          Action.initialize.call(this, 1);
        }
      });
      var a;
      a = A.new();
      a.events.should.be.a.Number;
      a.checkEventArray.bind(a).should.throw(/is not an array/);

      A = Card.extend(Action, {
        initialize: function() {
          Card.initialize.call(this, {
            cost: 2
          });
          Action.initialize.call(this, ['choose 2',
            function() {}
          ]);
        }
      });
      a = A.new();
      a.checkEventArray.bind(a).should.throw(/too much choices/);

      A = Card.extend(Action, {
        initialize: function() {
          Card.initialize.call(this, {
            cost: 2
          });
          Action.initialize.call(this, ['choose -1',
            function() {}
          ]);
        }
      });
      a = A.new();
      a.checkEventArray.bind(a).should.throw(/invalid parameter/);

      A = Card.extend(Action, {
        initialize: function() {
          Card.initialize.call(this, {
            cost: 2
          });
          Action.initialize.call(this, ['choose dafs',
            function() {}
          ]);
        }
      });
      a = A.new();
      a.checkEventArray.bind(a).should.throw(/invalid parameter/);

      A = Card.extend(Action, {
        initialize: function() {
          Card.initialize.call(this, {
            cost: 2
          });
          Action.initialize.call(this, ['choose']);
        }
      });
      a = A.new();
      a.checkEventArray.bind(a).should.throw(/too much choices/);

      A = Card.extend(Action, {
        initialize: function() {
          Card.initialize.call(this, {
            cost: 2
          });
          Action.initialize.call(this, ['choose',
            function() {},
            [
              function() {},
              1
            ]
          ]);
        }
      });
      a = A.new();
      a.checkEventArray.bind(a).should.throw(/invalid events/);

      A = Card.extend(Action, {
        initialize: function() {
          Card.initialize.call(this, {
            cost: 2
          });
          Action.initialize.call(this, ['sdfsd',
            function() {},
            [
              function() {},
              1
            ]
          ]);
        }
      });
      a = A.new();
      a.checkEventArray.bind(a).should.throw(/not a valid string/);

      A = Card.extend(Action, {
        initialize: function() {
          Card.initialize.call(this, {
            cost: 2
          });
          Action.initialize.call(this, [null]);
        }
      });
      a = A.new();
      a.checkEventArray.bind(a).should.throw(/valid.*event/);
    });
  });


  describe('#Chained inheritance', function() {
    it('should be the same as multiple args extend()', function() {
      var obj = {
        initialize: function() {
          Card.initialize.call(this, {
            cost: 6
          });
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
        c.cost().should.be.eql(6);
        c.type.should.have.length(2);
        c.type.should.containEql('treasure').and.containEql('victory');
      };

      test(h1);
      test(h2);
    });
  });

  describe('#treasure with variable money', function() {
    it('should return a variable value', function() {
      var TestCard = Card.extend(Treasure, {
        initialize: function() {
          Card.initialize.call(this);
          Treasure.initialize.call(this, function() {
            return Math.floor(Math.random() * 10);
          });
        }
      });
      var t = TestCard.new(),
        i;
      for (i = 0; i < 10; i++) {
        t.money().should.be.within(0, 10);
      }
    });
  });

  describe('#victory with variable points', function() {
    it('should return a variable value', function() {
      var TestCard = Card.extend(Victory, {
        initialize: function() {
          Card.initialize.call(this);
          Victory.initialize.call(this, function() {
            return Math.floor(Math.random() * 10);
          });
        }
      });
      var t = TestCard.new(),
        i;
      for (i = 0; i < 10; i++) {
        t.points().should.be.within(0, 10);
      }
    });
  });

  describe('#curses cards', function() {
    it('should create some curses cards', function() {
      var TestCurse = Card.extend(Curse, {
        initialize: function() {
          Card.initialize.call(this);
          Curse.initialize.call(this, -1);
        }
      });
      var TestCurse2 = Card.extend(Curse, {
        initialize: function() {
          Card.initialize.call(this);
          Curse.initialize.call(this, -4);
        }
      });
      var curse = TestCurse.new();
      curse.points().should.be.eql(-1);
      curse = TestCurse2.new();
      curse.points().should.be.eql(-4);
    });
    it('should create a curse with variable points', function() {
      var TestCurse = Card.extend(Curse, {
        initialize: function() {
          Card.initialize.call(this);
          Curse.initialize.call(this, function() {
            return -Math.floor(Math.random() * 3);
          });
        }
      });
      var curse = TestCurse.new();
      curse.points().should.be.within(-3, 0);
    });

  });

});
