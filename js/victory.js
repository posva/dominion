define(["selfish"], function(selfish) {
  var Base = selfish.Base;
  var Victory = Base.extend({
    initialize: function(points) {
      this.points = points;
      this.type.push('victory');
    },
  });

  return Victory;
});
