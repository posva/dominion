define(['card', 'action', 'victory', 'event'], function(Card, Action, Victory, Event) {
  var GreatHall = Card.extend(Action, Victory, {
    initialize: function(game) {
      Card.initialize.call(this, {
        name: 'Great Hall',
        text: '+1 Card\n+1 Action\n---\n1%V',
        cost: 3,
        img: 'data/card/greatHall.jpg'
      });
      Victory.initialize.call(this, 1);
      Action.initialize.call(this, [
        Event.new(game, 'cards 1'),
        Event.new(game, 'actions 1'),
      ]);
    }
  });

  return GreatHall;
});
