define(['card', 'victory'], function(Card, Victory) {
  var Estate = Card.extend(Victory, {
    initialize: function() {
      Card.initialize.call(this, {
        name: 'Estate',
        text: '1',
        cost: 2,
        img: ''
      });
      Victory.initialize.call(this, 1);
    }
  });

  return Estate;
});
