define(['card'], function(Card) {
  var Curse = Card.extend({
    initialize: function() {
      Card.initialize.call(this, {
        name: 'Curse',
        text: '-1',
        cost: 0,
        img: ''
      });
      this.points = function() {
        return -1;
      };
    }
  });

  return Curse;
});
