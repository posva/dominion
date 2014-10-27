define(['selfish', 'lodash', 'player', 'card'], function(selfish, _, Player, Card) {
  var Base = selfish.Base;
  var Game = Base.extend({
    initialize: function() {
      this.money = 0; // current turn money
      this.actions = 0; // current turn actions
      this.buys = 0; // current turn buys

      this.players = [];
      this.cards = {};
      this.turns = 0;
      this.trash = [];
      this.playerTurn = 0;
    },
    addActions: function(n) {
      this.actions += n;
    },
    addBuys: function(n) {
      this.buys += n;
    },
    addMoney: function(n) {
      this.money += n;
    },
    currentPlayer: function(i) {
      i = i || 0;
      if (Math.abs(this.playerTurn + i) >= this.players.length) {
        i = (i >= 0 ? 1 : -1) * ((this.playerTurn + Math.abs(i)) % this.players.length);
      } else {
        i += this.playerTurn;
      }
      if (i >= 0) {
        return this.players[i];
      } else {
        return this.players[this.players.length + i];
      }
    },
    // start a game
    // init is a conf object:
    // {
    //  cards: [], // kingdom cards object
    //  mode: base, // mode object
    //  players: 3,
    // }
    // Base cards should be specified by expansions and mode
    // Expansion may do some special initialization like potions and more
    // Mode allows to change how we start (number of coppers, curses, etc)
    startGame: function(init) {
      // TODO
      if (!init) {
        throw {
          name: 'ConfError',
          message: 'No configuration given.'
        };
      }
      // Load card from js.
      // about expansions (use folders)
      if (!init.players || typeof init.players !== 'number' || init.players < 2 || init.players > 6) {
        throw {
          name: 'ConfError',
          message: 'Wrong number of players'+(init.players?'('+init.players.toString()+').':'.')
        };
      }

      if (!init.cards || !init.cards.length || init.cards.length < 1) {
        throw {
          name: 'ConfError',
          message: 'No cards given. Cannot pick kingdom cards.'
        };
      } else {
        _.forEach(init.cards, function(v) {
          if (!Card.isPrototypeOf(v)) {
            throw {
              name: 'ConfError',
              message: 'At least one of the given kingdom cards is invalid.'
            };
          }
        });
      }

      if (!init.mode || !init.mode.cards || !init.mode.playerInitializer) {
        throw {
          name: 'ConfError',
          message: 'Game mode is invalid.'
        };
      }

      // players
      var i;
      _.forEach(this.players, function(v) {
        v.game = null;
      });
      this.players = [];
      for (i = 0; i < init.players; i++) {
        var p = Player.new(init.mode.playerInitializer);
        p.game = this;
        p.endTurn();
        this.players.push(p);
      }

      // buyable cards
      var that = this;
      this.cards = {};
      _.forOwn(init.cards, function(v, k) {
        that.cards[k] = {
          card: v,
          amount: 0,
          instance: v.new(that)
        };
        if (that.cards[k].instance.is('victory')) {
          that.cards[k].amount = init.mode.cards['victory-card'].amount[that.players.length];
        } else {
          that.cards[k].amount = init.mode.cards['kingdom-card'].amount[that.players.length];
        }
      });

      //clean any other variable
      this.trash = [];
      this.turns = 0;
      this.playerTurn = 0;
      this.money = 0;
      this.actions = 1;
      this.buys = 1;
    },
    endTurn: function() {
      this.players[this.playerTurn].endTurn();
      this.playerTurn++;
      if (this.playerTurn >= this.players.length) {
        this.playerTurn = 0;
      }
      this.money = 0;
      this.actions = 1;
      this.buys = 1;
      this.turns++;
    },
  });

  return Game;
});
