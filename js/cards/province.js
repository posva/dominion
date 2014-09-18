define(['card', 'victory'], function(Card, Victory) {
  var Province = Card.extend(Victory, {
    initialize: function() {
      Card.initialize.call(this, {
        name: 'Province',
        text: '6',
        cost: 8,
        img: ''
      });
      Victory.initialize.call(this, 6);
    }
  });

  return Province;
});
