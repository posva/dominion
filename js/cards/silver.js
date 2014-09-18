define(['card', 'treasure'], function(Card, Treasure) {
  var Silver = Card.extend(Treasure, {
    initialize: function() {
      Card.initialize.call(this, {
        name: 'Silver',
        text: '2',
        cost: 3,
        img: ''
      });
      Treasure.initialize.call(this, 2);
    }
  });

  return Silver;
});
