define(['selfish'], function(selfish) {
  var Base = selfish.Base;
  var action = {
    cards: function(n) {
      this.currentPlayer().draws(parseInt(n, 10));
    },
    actions: function(n)  {
      this.addActions(parseInt(n, 10));
    },
    money: function(n)  {
      this.addMoney(parseInt(n, 10));
    },
  };
  var Event = Base.extend({
    initialize: function(game, str) {
      var s = str.split(' ');
      if (!action[s[0]]) {
        throw {
          name: 'EventError',
          message: s[0]+' is not a valid event'
        };
      }
      action[s[0]].apply(game, s.slice(1));
    },
  });

  return Event;
});
