define(["selfish"], function(selfish) {
  var Base = selfish.Base;
  var Game = Base.extend({
    initialize: function(cost) {
      this.money = 0; // current turn money
      this.actions = 0; // current turn actions
      this.buys = 0; // current turn buys

      this.players = [];
      this.turns = 0;
      this.playerTurn = 0;
    },
    startGame: function() {
      // TODO
      // Think about how to generate cards from JSON
      // about expansions (use folders)
      // use cardFromJSON in util
      // or simply add it to the constructor of card
    }
  });

  return Game;
});
