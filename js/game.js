define(["selfish"], function(selfish) {
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
    // start a game
    // init is a conf object:
    // {
    //  cards: [],
    //  players: 3,
    // }
    // Base cards should be specified by expansions and mode
    // Expansion may do some special initialization like potions and more
    // Mode allows to change how we start (number of coppers, curses, etc)
    startGame: function(init) {
      // TODO
      // Load card from js.
      // about expansions (use folders)
    },
  });

  return Game;
});
