define(['card', 'victory', 'treasure'], function(Card, Victory, Treasure) {
  return {
    start: function() {
      // XXX DEBUG
      window.Card = Card;
      window.Victory = Victory;
      window.Treasure = Treasure;
    },
  };
});
