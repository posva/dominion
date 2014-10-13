define(['card', 'action', 'victory', 'event'], function(Card, Action, Victory, Event) {
  var Nobles = Card.extend(Action, Victory, {
    initialize: function(game) {
      Card.initialize.call(this, {
        name: 'Nobles',
        text: 'Choose one: +2 Cards or +2 Actions\n---\n2%V',
        cost: 6,
        img: 'data/card/nobles.jpg'
      });
      Victory.initialize.call(this, 1);
      Action.initialize.call(this, [
        'choose',
        Event.new(game, 'cards 3'),
        Event.new(game, 'actions 2'),
      ]);
    }
  });

  return Nobles;
});
