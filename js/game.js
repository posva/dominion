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
    generateCard: function(j) {
      var type, cost, money, points,
      i,
      obj = {}; // object litteral. card specification
      if (typeof j === "string") {
        j = JSON.parse(j);
      } else if (typeof j !== 'object') {
        // check valid card TODO create a function
        if (!j.type.length) { // not an array Array
          j.type = [j.type];
        }
          i = 0;
          Crafted = Card;
          while( i < j.type.length-1) {
            Crafted = Crafted.extend(this.classes[j.type[i]]);
          }
          Crafted = Crafted.extend(this.classes[j.type[i]], obj);

      }
    }
  });

  return Game;
});
