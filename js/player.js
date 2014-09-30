define(['selfish', 'utils', 'lodash'], function(selfish, U, _) {
  var Base = selfish.Base;
  var Player = Base.extend({
    initialize: function(newGameFun) {
      // Possible location for cards
      this.hand = [];
      this.deck = [];
      this.graveyard = [];
      this.field = []; // cards being played during his turn
      this.preHooks = []; // allows to execute code before playing a card
      this.postHooks = []; // ex: function(card) { if card.is('action') this.turn.actions++; }
      this.turn = {}; // information reset each turn such as actions played etc
      this.game = undefined; // game instance. Must be added by Game
      if (!_.isFunction(newGameFun)) {
        throw {
          name: 'PlayerInit',
          message: 'No initializer given'
        };
      } else {
        newGameFun.apply(this);
      }
    },
    // shuffle graveyard into deck
    // no check is done
    shuffleGraveyard: function() {
      this.deck = this.deck.concat(this.graveyard.splice(0));
      this.deck.shuffle();
    },
    // draw n cards. shufle if necessary
    draws: function(n) {
      if (n <= 0) {
        return;
      }
      if (this.deck.length >= n) {
        this.hand = this.hand.concat(this.deck.splice(0, n));
      } else {
        n -= this.deck.length;
        this.hand = this.hand.concat(this.deck.splice(0, this.deck.length));
        this.shuffleGraveyard();
        if (this.deck.length === 0) { // you drew too much!
          return;
        } else if (this.deck.length < n) {
          this.hand = this.hand.concat(this.deck.splice(0, this.deck.length));
        } else {
          this.hand = this.hand.concat(this.deck.splice(0, n));
        }
      }
    },
    discards: function(i) {
      if (typeof i !== 'number') {
        throw {
          name: 'DiscardError',
          message: 'i must be a number not a '+(typeof i)
        };
      } else if (i < 0 || i >= this.hand.length) {
        throw {
          name: 'DiscardError',
          message: 'Invalid i value ('+i+'). expect 0 <= i < '+this.hand.length
        };
      }
      this.graveyard = this.graveyard.concat(this.hand.splice(i, 1));
    },
    // clean the played cards and draw five cards
    // shuffle graveyard into deck if necessary
    endTurn: function() {
      this.graveyard = this.graveyard.concat(
        this.hand.splice(0),
        this.field.splice(0)
      );
      this.turn = {
        actions: 0, // played actions
        draws: 0,
        attacks: 0,
        preHooks: [], // array of function to be called whjen playing cards.
        postHooks: [], // these are used for example by the Coppersmith
      };
      this.draws(5);
    },
    plays: function(i) {
      // TODO call a play function
      var c = this.hand.splice(i, 1)[0];
      this.field.push(c);
    }
  });

  return Player;
});
