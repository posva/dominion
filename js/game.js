define(['selfish', 'lodash', 'player', 'card', 'event'], function(selfish, _, Player, Card, Event) {
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
      this.phase = 'action';
      this.playerTurn = 0;

      this.waitingAction = null; // when an action must be called back after a choose X
      this.waitingArray = null;
      this.waitingChoices = 0;
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
          message: 'Wrong number of players' + (init.players ? '(' + init.players.toString() + ').' : '.')
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
      // buyable cards
      var that = this;
      this.cards = {};
      _.forOwn(init.mode.cards, function(v, k) {
        if (!v.card) {
          return; // kingdom an victory special cards
        }
        var tmp = {
          card: v.card,
          amount: 0,
          instance: v.card.new(that)
        };
        k = tmp.instance.name;
        that.cards[k] = tmp;
        that.cards[k].amount = v.amount[init.players - 2];
      });
      // expansions cards can overwrite mode cards
      _.forOwn(init.cards, function(v, k) {
        var tmp = {
          card: v,
          amount: 0,
          instance: v.new(that)
        };
        k = tmp.instance.name;
        that.cards[k] = tmp;
        if (that.cards[k].instance.is('victory')) {
          that.cards[k].amount = init.mode.cards['victory-card'].amount[init.players - 2];
        } else {
          that.cards[k].amount = init.mode.cards['kingdom-card'].amount[init.players - 2];
        }
      });

      // players
      var i;
      _.forEach(this.players, function(v) {
        v.game = null;
      });
      this.players = [];
      for (i = 0; i < init.players; i++) {
        var p = Player.new(init.mode.playerInitializer, this);
        p.endTurn();
        this.players.push(p);
      }

      //clean any other variable
      this.trash = [];
      this.turns = 0;
      this.playerTurn = 0;
      this.money = 0;
      this.actions = 1;
      this.buys = 1;
      this.phase = 'action';
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
    // called when an actions needs choosing. i is the 0-index of the arr
    chooseAction: function(i) {
      if (typeof i === 'number') {
        i = [i];
      }
      var k;
      for (k = 0; k < i.length; k++) {
        if (i[k] < 0 || i[k] >= this.waitingAction.events.length) {
          throw {
            name: 'Choose Error',
            message: 'Cannot choose option ' + i[k] + ', there are only ' + this.waitingAction.events.length + ' options.'
          };
        }
        var lind = i.lastIndexOf(i[k]);
        if (lind > k && lind >= 0) {
          throw {
            name: 'Choose Error',
            message: 'Cannot choose the same option twice: option ' + i[k] + ' at index ' + k + ' and ' + lind
          };
        }
      }
      if (i.length !== this.waitingAction.amount) {
        throw {
          name: 'Choose Error',
          message: 'Got ' + i.length + ' choices instead of ' + this.waitingAction.amount
        };
      }
      // collect events that must be played and give the to the action
      var events = [];
      _.forEach(i, function(v) {
        events.push(this.waitingAction.events[v]);
      }, this);
      //console.log('Extracted', events, 'from', this.waitingAction.events);
      this.waitingAction.action.stackChoosenEvents(events);
      this.waitingAction = this.waitingAction.action.play(this);
    },
    // return an array with all players except the one playing
    otherPlayers: function() {
      var a = this.players.slice();
      a.splice(this.playerTurn, 1);
      return a;
    },
    // play the card at index i in current player.
    // return the card played or null if the card could not be played
    play: function(i) {
      var p = this.currentPlayer();
      var c = p.hand[i];
      if (!c ||
        (c.is('action') && (this.actions < 1 || this.phase !== 'action')) ||
        (c.is('treasure') && this.phase !== 'buy') // a treasure cannot be an action but may do things
      ) {
        return null;
      } // else play the card
      if (c.is('treasure')) {
        this.addMoney(c.money());
      }
      var res = p.plays(i);
      if (res) { // there is a choose
        // TODO bind here ui stuff
        this.waitingAction = res;
      }
      if (c.is('action')) {
        this.actions--;
      }
      return c;
    },
    // buy a card with name name
    // rteturn the bought card ot null if the card couldn't be bought
    buy: function(name) {
      var p = this.currentPlayer();
      var card = this.cards[name],
        c;
      if (!card || card.amount < 1) {
        return null;
      }
      c = card.instance;
      if (this.phase !== 'buy' || this.buys < 1 || this.money < c.cost()) {
        return null;
      }
      p.field.push(c);
      card.amount--;
      this.buys--;
      return c;
    },
    endActions: function() {
      this.phase = 'buy';
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
      this.phase = 'action';
    },
  });

  return Game;
});
