define(['selfish'], function(selfish) {
  var Base = selfish.Base;
  var Curse = Base.extend({
    initialize: function(points) {
      if (typeof points === 'function') {
        this.points = points;
      } else {
        this.points = function() {
          return points;
        };
      }
      this.type.push('curse');
    },
  });

  return Curse;
});
