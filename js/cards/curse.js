define(['card', 'curse'], function(Card, Curse) {
  var CurseCard = Card.extend(Curse, {
    initialize: function() {
      Card.initialize.call(this, {
        name: 'Curse',
        text: '-1',
        cost: 0,
        img: ''
      });
      Curse.initialize.call(this, -1);
    }
  });

  return CurseCard;
});
