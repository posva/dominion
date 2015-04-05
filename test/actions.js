/*jshint -W030 */
var should = require('should');
var Game = require('../js/game');
var ActionEvent = require('../js/action-event');
var Card = require('../js/card');
var Action = require('../js/action');
var Silver = require('../js/cards/silver');
var Gold = require('../js/cards/gold');
var Duchy = require('../js/cards/duchy');
var base = require('../js/modes/base');

describe('Actions Testing', function() {
  var game;
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

  describe('#Event based actions', function() {
    it('should work with a single event action', function() {
      var A = Card.extend(Action, {
        initialize: function(game) {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            ActionEvent.new(game, 'cards 2')
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      // add it to the player hand (what a cheater!)
      p.hand.push(a);
      game.play(5).should.be.eql(a); // play card at index 5 in players hand
      p.hand.should.have.lengthOf(7); // he played one card and drew 2
    });
    it('should work with a multi event action', function() {
      var A = Card.extend(Action, {
        initialize: function(game) {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            ActionEvent.new(game, 'cards 2'),
            ActionEvent.new(game, 'buys 2')
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      p.hand.push(a);
      game.play(5).should.be.eql(a);
      p.hand.should.have.lengthOf(7);
      game.buys.should.be.eql(3);
    });
    it('should fail if event is invalid', function() {
      var A = Card.extend(Action, {
        initialize: function(game) {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            ActionEvent.new(game, 'wrong 2'),
            ActionEvent.new(game, 'buys 2')
          ]);
        },
      });
      A.new.bind(A, game).should.throw(/wrong.*valid.*event/);
    });
  });
  describe('#Function based actions', function() {
    it('should work with a single function action', function() {
      var A = Card.extend(Action, {
        initialize: function(game) {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            (function(game) {
              game.currentPlayer().graveyard.push(gold);
            }).bind(null, game)
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      var gold = game.cards.Gold.instance;
      p.hand.push(a);
      game.play(5).should.be.eql(a);
      p.graveyard.should.containEql(gold);
    });
    it('should work with a multi function action', function() {
      var A = Card.extend(Action, {
        initialize: function(game) {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            (function(game) {
              game.currentPlayer().graveyard.push(gold);
            }).bind(null, game), (function(game) {
              game.currentPlayer().graveyard.push(silver);
            }).bind(null, game),
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      var gold = game.cards.Gold.instance;
      var silver = game.cards.Silver.instance;
      p.hand.push(a);
      game.play(5).should.be.eql(a);
      p.graveyard.should.containEql(gold);
      p.graveyard.should.containEql(silver);
    });
    it('should be able to detect if function is invalid', function() {
      var A = Card.extend(Action, {
        initialize: function(game) {
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
  describe('#Mixed actions', function() {
    it('should work with actions with one event and one function', function() {
      var A = Card.extend(Action, {
        initialize: function(game) {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            ActionEvent.new(game, 'cards 1'), (function(game) {
              game.currentPlayer().graveyard.push(silver);
            }).bind(null, game),
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      var gold = game.cards.Gold.instance;
      var silver = game.cards.Silver.instance;
      p.hand.push(a);
      game.play(5).should.be.eql(a);
      p.graveyard.should.containEql(silver);
      p.hand.should.have.lengthOf(6);
    });
    it('should work with actions with one event and multiple functions', function() {
      var A = Card.extend(Action, {
        initialize: function(game) {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            ActionEvent.new(game, 'cards 1'), (function(game) {
              game.currentPlayer().graveyard.push(silver);
            }).bind(null, game), (function(game) {
              game.currentPlayer().graveyard.push(gold);
            }).bind(null, game),
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      var gold = game.cards.Gold.instance;
      var silver = game.cards.Silver.instance;
      p.hand.push(a);
      game.play(5).should.be.eql(a);
      p.graveyard.should.containEql(silver);
      p.graveyard.should.containEql(gold);
      p.hand.should.have.lengthOf(6);
    });
    it('should work with actions with multiple events and one function', function() {
      var A = Card.extend(Action, {
        initialize: function(game) {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            ActionEvent.new(game, 'cards 1'),
            ActionEvent.new(game, 'buys 1'), (function(game) {
              game.currentPlayer().graveyard.push(gold);
            }).bind(null, game),
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      var gold = game.cards.Gold.instance;
      var silver = game.cards.Silver.instance;
      p.hand.push(a);
      game.play(5).should.be.eql(a);
      p.graveyard.should.containEql(gold);
      p.hand.should.have.lengthOf(6);
      game.buys.should.be.eql(2);
    });
    it('should work with actions with multiple events and multiple functions', function() {
      var A = Card.extend(Action, {
        initialize: function(game) {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            ActionEvent.new(game, 'cards 1'),
            ActionEvent.new(game, 'buys 1'), (function(game) {
              game.currentPlayer().graveyard.push(gold);
            }).bind(null, game), (function(game) {
              game.currentPlayer().graveyard.push(silver);
            }).bind(null, game),
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      var gold = game.cards.Gold.instance;
      var silver = game.cards.Silver.instance;
      p.hand.push(a);
      game.play(5).should.be.eql(a);
      p.graveyard.should.containEql(gold);
      p.graveyard.should.containEql(silver);
      p.hand.should.have.lengthOf(6);
      game.buys.should.be.eql(2);
    });
  });
  describe('#Prefixed actions', function() {
    it('should work with "choose" functions cards', function() {
      var A = Card.extend(Action, {
        initialize: function(game) {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            'choose', // eq to choose 1
            (function(game) {
              game.currentPlayer().graveyard.push(gold);
            }).bind(null, game), (function(game) {
              game.currentPlayer().graveyard.push(silver);
            }).bind(null, game),
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      var gold = game.cards.Gold.instance;
      var silver = game.cards.Silver.instance;
      p.hand.push(a);
      game.play(5).should.be.eql(a);
      game.chooseAction(0);
      p.graveyard.should.containEql(gold);
      p.graveyard.should.not.containEql(silver);

      // play again
      p.hand.push(a);
      game.addActions(1); // or we won't be able to play
      game.play(5).should.be.eql(a);
      game.chooseAction(1);
      p.graveyard.should.containEql(gold);
      p.graveyard.should.containEql(silver);
    });
    it('should work with "choose" events cards', function() {
      var A = Card.extend(Action, {
        initialize: function(game) {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            'choose',
            ActionEvent.new(game, 'cards 1'),
            ActionEvent.new(game, 'buys 1'),
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      p.hand.push(a);
      game.play(5).should.be.eql(a);
      game.chooseAction(0);
      p.hand.should.have.lengthOf(6);
      game.buys.should.be.eql(1);

      game.addActions(1); // or we won't be able to play
      p.hand.push(a);
      game.play(6).should.be.eql(a);
      game.chooseAction(1);
      game.buys.should.be.eql(2);
    });
    it('should work with a "choose" with mixed events and functions cards', function() {
      var A = Card.extend(Action, {
        initialize: function(game) {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            'choose',
            ActionEvent.new(game, 'cards 1'),
            ActionEvent.new(game, 'buys 1'), (function(game) {
              game.currentPlayer().graveyard.push(gold);
            }).bind(null, game),
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      var gold = game.cards.Gold.instance;
      var silver = game.cards.Silver.instance;
      p.hand.push(a);
      game.play(5).should.be.eql(a);
      game.chooseAction(0);
      p.hand.should.have.lengthOf(6);
      game.buys.should.be.eql(1);
      p.graveyard.should.not.containEql(gold);

      game.addActions(1); // or we won't be able to play
      p.hand.push(a);
      game.play(6).should.be.eql(a);
      game.chooseAction(2);
      p.graveyard.should.containEql(gold);
    });
    it('should be able to choose more than 1', function() {
      var A = Card.extend(Action, {
        initialize: function(game) {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            'choose 2',
            ActionEvent.new(game, 'cards 1'),
            ActionEvent.new(game, 'buys 1'), (function(game) {
              game.currentPlayer().graveyard.push(gold);
            }).bind(null, game),
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      var gold = game.cards.Gold.instance;
      var silver = game.cards.Silver.instance;
      p.hand.push(a);
      game.play(5).should.be.eql(a);
      game.chooseAction([0, 1]);
      p.hand.should.have.lengthOf(6);
      game.buys.should.be.eql(2);
      p.graveyard.should.not.containEql(gold);

      game.addActions(1); // or we won't be able to play
      p.hand.push(a);
      game.play(6).should.be.eql(a);
      game.chooseAction([1, 2]);
      p.hand.should.have.lengthOf(6);
      game.buys.should.be.eql(3);
      p.graveyard.should.containEql(gold);
    });
    it('should refuse to choose a wrong number of actions', function() {
      var A = Card.extend(Action, {
        initialize: function(game) {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            'choose 2',
            ActionEvent.new(game, 'cards 1'),
            ActionEvent.new(game, 'buys 1'), (function(game) {
              game.currentPlayer().graveyard.push(gold);
            }).bind(null, game),
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      var gold = game.cards.Gold.instance;
      var silver = game.cards.Silver.instance;
      p.hand.push(a);
      game.play(5).should.be.eql(a);
      game.chooseAction.bind(game, 0).should.throw(/1 choices instead of 2/);
      p.hand.should.have.lengthOf(5);
      game.buys.should.be.eql(1);
      p.graveyard.should.not.containEql(gold);
      game.chooseAction.bind(game, [1, 2, 0]).should.throw(/3 choices instead of 2/);
      p.hand.should.have.lengthOf(5);
      game.buys.should.be.eql(1);
      p.graveyard.should.not.containEql(gold);
    });
    it('should refuse to choose an action that doesn\'t exist (wrong index)', function() {
      var A = Card.extend(Action, {
        initialize: function(game) {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            'choose 2',
            ActionEvent.new(game, 'cards 1'),
            ActionEvent.new(game, 'buys 1'), (function(game) {
              game.currentPlayer().graveyard.push(gold);
            }).bind(null, game),
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      var gold = game.cards.Gold.instance;
      var silver = game.cards.Silver.instance;
      p.hand.push(a);
      game.play(5).should.be.eql(a);
      game.chooseAction.bind(game, -1).should.throw(/Cannot choose option -1/);
      p.hand.should.have.lengthOf(5);
      game.buys.should.be.eql(1);
      p.graveyard.should.not.containEql(gold);
      game.chooseAction.bind(game, [1, 3]).should.throw(/Cannot choose option 3/);
      p.hand.should.have.lengthOf(5);
      game.buys.should.be.eql(1);
      p.graveyard.should.not.containEql(gold);
    });
    it('should refuse to choose the same action for a choose >1', function() {
      var A = Card.extend(Action, {
        initialize: function(game) {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            'choose 2',
            ActionEvent.new(game, 'cards 1'),
            ActionEvent.new(game, 'buys 1'), (function(game) {
              game.currentPlayer().graveyard.push(gold);
            }).bind(null, game),
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      var gold = game.cards.Gold.instance;
      var silver = game.cards.Silver.instance;
      p.hand.push(a);
      game.play(5).should.be.eql(a);
      game.chooseAction.bind(game, [1, 1]).should.throw(/Cannot choose the same option twice/);
      p.hand.should.have.lengthOf(5);
      game.buys.should.be.eql(1);
      p.graveyard.should.not.containEql(gold);
    });
    it('should work with a "random" card');
  });
  describe('#Recursive actions', function() {
    it('should fire all events in a simple recursive array', function() {
      var A = Card.extend(Action, {
        initialize: function(game) {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            ActionEvent.new(game, 'cards 1'),
            ActionEvent.new(game, 'buys 1'), (function(game) {
              game.currentPlayer().graveyard.push(gold);
            }).bind(null, game), [
              ActionEvent.new(game, 'cards 1'),
              ActionEvent.new(game, 'buys 1'),
              function(game) {
                game.currentPlayer().graveyard.push(silver);
              },
              [
                ActionEvent.new(game, 'actions 1'),
              ]
            ]
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      var gold = game.cards.Gold.instance;
      var silver = game.cards.Silver.instance;
      p.hand.push(a);
      game.play(5).should.be.eql(a);
      p.hand.should.have.lengthOf(7);
      game.buys.should.be.eql(3);
      p.graveyard.should.containEql(gold);
      p.graveyard.should.containEql(silver);
      game.actions.should.be.eql(1);
    });
    it('should randomly branch');
    it('should wisely branch (choose)', function() {
      var fun = [
        'choose',
        ActionEvent.new(game, 'cards 2'),
        ActionEvent.new(game, 'buys 2'),
        ActionEvent.new(game, 'money 2'),
      ];
      var A = Card.extend(Action, {
        initialize: function(game) {
          Card.initialize.call(this, {
            name: 'name',
            text: 'text',
            cost: 1,
            img: ''
          });
          Action.initialize.call(this, [
            'choose 1', [
              ActionEvent.new(game, 'cards 1'),
              fun
            ],
            [
              ActionEvent.new(game, 'buys 1'),
              fun
            ],
            [
              ActionEvent.new(game, 'money 1'),
              fun
            ],
          ]);
        },
      });
      A.new.bind(A, game).should.not.throw();
      var a = A.new(game);
      var p = game.currentPlayer();
      p.hand.push(a);
      game.play(5).should.be.eql(a);
      game.chooseAction(0);
      game.chooseAction(2);
      p.hand.should.have.lengthOf(6);
      game.buys.should.be.eql(1);
      game.money.should.be.eql(2);
    });
    describe('#Deeper choose', function() {
      var A, a;
      before(function() {
        var mad = [
          'choose',
          ActionEvent.new(game, 'cards 3'),
          ActionEvent.new(game, 'buys 3'),
          ActionEvent.new(game, 'money 3'),
        ];
        var fun = [
          'choose', [
            ActionEvent.new(game, 'cards 2'),
            mad
          ],
          [
            ActionEvent.new(game, 'buys 2'),
            mad,
            ActionEvent.new(game, 'money 2'),
            mad,
          ],
          [
            ActionEvent.new(game, 'money 2'),
            mad
          ]
        ];
        A = Card.extend(Action, {
          initialize: function(game) {
            Card.initialize.call(this, {
              name: 'name',
              text: 'text',
              cost: 1,
              img: ''
            });
            Action.initialize.call(this, [
              'choose 1', [
                ActionEvent.new(game, 'cards 1'),
                fun
              ],
              [
                ActionEvent.new(game, 'buys 1'),
                fun,
                ActionEvent.new(game, 'money 1'),
              ],
              [
                ActionEvent.new(game, 'money 1'),
                fun
              ],
            ]);
          },
        });
        a = A.new(game);
      });
      it('should deeply choose', function() {
        var p = game.currentPlayer();
        p.hand.push(a);
        game.play(5).should.be.eql(a);
        p.hand.should.have.lengthOf(5);
        game.chooseAction(0);
        p.hand.should.have.lengthOf(6);
        game.chooseAction(2);
        game.money.should.be.eql(2);
        game.chooseAction(2);
        game.buys.should.be.eql(1);
        game.money.should.be.eql(5);
      });
      it('should do thing in the right order', function() {
        var p = game.currentPlayer();
        p.hand.push(a);
        game.play(5).should.be.eql(a);
        p.hand.should.have.lengthOf(5);
        game.chooseAction(1);
        game.buys.should.be.eql(2);
        game.money.should.be.eql(0);
        game.chooseAction(1);
        game.buys.should.be.eql(4);
        game.money.should.be.eql(0);
        game.chooseAction(0);
        p.hand.should.have.lengthOf(8);
        game.buys.should.be.eql(4);
        game.money.should.be.eql(2);
        game.chooseAction(2);
        p.hand.should.have.lengthOf(8);
        game.buys.should.be.eql(4);
        game.money.should.be.eql(6);
      });
    });
  });

});
