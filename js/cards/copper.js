define(['card', 'treasure'], function(Card, Treasure) {
  var Copper = Card.extend(Treasure, {
    initialize: function() {
      Card.initialize.call(this, {
        name: 'Copper',
        text: '1',
        cost: 0,
        img: ''
      });
      Treasure.initialize.call(this, 1);
    }
  });

  return Copper;
});
