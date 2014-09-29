define(['selfish', 'lodash', 'player'], function(selfish, _, Player) {
  var Base = selfish.Base;
  var Game = Base.extend({
    initialize: function(init) {
      this.money = 0; // current turn money
      this.actions = 0; // current turn actions
      this.buys = 0; // current turn buys

      this.players = [];
      this.turns = 0;
      this.trash = [];
      this.playerTurn = 0;
    },
    currentPlayer: function(i) {
      i = i || 0;
      return this.players[this.playerTurn + i];
    },
    // start a game
    // init is a conf object:
    // {
    //  extensions: [], // extensions object
    //  mode: base, // mode object
    //  players: 3,
    // }
    // Base cards should be specified by expansions and mode
    // Expansion may do some special initialization like potions and more
    // Mode allows to change how we start (number of coppers, curses, etc)
    startGame: function(init) {
      // TODO
      if (! init) {
        throw {
          name: 'ConfError',
          message: 'No configuration given.'
        };
      }
      // Load card from js.
      // about expansions (use folders)
      if (!init.players || typeof init.players !== 'number' || init.players < 2 || players > 6) {
        throw {
          name: 'ConfError',
          message: 'Wrong number of players('+init.players.toString()+').'
        };
      }

      if (!init.extensions || !init.extensions.length || init.extensions.length < 1) {
        throw {
          name: 'ConfError',
          message: 'No extension givens. Cannot pick kingdom cards.'
        };
      } else {
        _.forEach(init.extensions, function(v) {
          if (!v.cards) {
            throw {
              name: 'ConfError',
              message: 'At least one of the extensions is invalid.'
            };
          }
        });
      }

      if (!init.mode || !init.mode.cards) {
        throw {
          name: 'ConfError',
          message: 'Game mode is invalid.'
        };
      }

      var i;
      for (i = 0; i < init.players; i++) {
        this.players = Player.new(mode.playerInitializer);
      }
    },
  });

  return Game;
});
