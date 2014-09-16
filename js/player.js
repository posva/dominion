define(["selfish", "utils"], function(selfish, U) {
  var Base = selfish.Base;
  var Player = Base.extend({
    initialize: function() {
      // Possible location for cards
      this.hand = [];
      this.deck = [];
      this.graveyard = [];
      this.field = []; // cards being played during his turn
    },
    // shuffle graveyard into deck
    // no check is done
    shuffleGraveyard: function() {
      this.deck.concat(this.graveyard.splice(0));
      this.deck.shuffle();
    },
    // draw n cards. shufle if necessary
    drawCards: function(n) {
      if (this.deck.length < 5) {
        this.shuffleGraveyard();
      }
      this.hand.concat(this.deck.splice(0, n));
    },
    // clean the palyed cards and draw five cards
    // shuffle graveyard into deck if necessary
    endTurn: function() {
      this.graveyard.concat(
        this.hand.splice(0),
        this.field.splice(0)
      );

      this.drawCards(5);

    },
    // init the deck with 7 coppers and 3 estates
    startGame: function() {
      // TODO
      var i = 0;
      for (i = 0; i < 7; i++) {
        this.deck.push('copper');
      }
      for (i = 0; i < 3; i++) {
        this.deck.push('estate');
      }
    },
    playCard: function(i) {
    }
  });

  return Player;
});
