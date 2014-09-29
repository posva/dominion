define(['selfish'], function(selfish) {
  var Base = selfish.Base;
  var Action = Base.extend({
    // fun is the action:
    // function(game) {
    //   var p = game.currentPlayer();
    //   p.draw(4);
    //   p.discard(1, 'choose');
    // }
    initialize: function(fun) {
      this.play = fun; // the action itself
      this.type.push('action');
    },
  });

  return Action;
});
