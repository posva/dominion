define(['card', 'victory'], function(Card, Victory) {
  var Duchy = Card.extend(Victory, {
    initialize: function() {
      Card.initialize.call(this, {
        name: 'Duchy',
        text: '3',
        cost: 5,
        img: ''
      });
      Victory.initialize.call(this, 3);
    }
  });

  return Duchy;
});
