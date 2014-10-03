define(['card', 'action', 'victory'], function(Card, Action, Victory) {
  var GreatHall = Card.extend(Action, Victory, {
    initialize: function() {
      Card.initialize.call(this, {
        name: 'Great Hall',
        text: '+1 Card\n+1 Action\n---\n1%V',
        cost: 3,
        img: 'data/card/greatHall.jpg'
      });
      Victory.initialize.call(this, 1);
      Action.initialize.call(this, function(game) {
        var p = game.currentPlayer();
        p.drawCard(1);
        game.actions++;
      });
    }
  });

  return GreatHall;
});
