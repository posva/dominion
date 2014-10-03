define(['card', 'action'], function(Card, Action) {
  var Tribute = Card.extend(Action, {
    initialize: function() {
      Card.initialize.call(this, {
        name: 'Tribute',
        text: 'The player to your left reveals then discards the top two cards of his deck. For each differently concerned card revealed, if it is an:\nAction Card: +2 Actions\nTreasure Card: +2%G\nVictory Card: +2 Cards',
        cost: 5,
        img: 'data/card/tribute.jpg'
      });
      Action.initialize.call(this, function(game) {
        var pleft = game.currentPlayer(-1);
      });
    }
  });

  return Tribute;
});
