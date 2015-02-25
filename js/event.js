define(['selfish'], function(selfish) {
  var Base = selfish.Base;
  var action = {
    cards: function(n) {
      this.currentPlayer().draws(parseInt(n, 10));
    },
    actions: function(n) {
      this.addActions(parseInt(n, 10));
    },
    money: function(n) {
      this.addMoney(parseInt(n, 10));
    },
    buys: function(n) {
      this.addBuys(parseInt(n, 10));
    },
    none: function() {}
  };
  /* ex: +2 Cards
   * var ev = Event.new(game_instance, 'cards 2');
   * ev.fire();
   */
  var Event = Base.extend({
    initialize: function(game, str) {
      str = str || '';
      var s = str.split(' ');
      if (!action[s[0]]) {
        throw {
          name: 'EventError',
          message: s[0] + ' is not a valid event'
        };
      }
      this.fire = action[s[0]].bind(game, s.slice(1));
    },
  });

  return Event;
});
