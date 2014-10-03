define(['selfish', 'lodash'], function(selfish, _) {
  var Base = selfish.Base;
  var Action = Base.extend({
    // events is an array which first element can be a string:
    // - choose/choose x
    // or functions that must be executed sequentially
    // or another array with the same format that this one
    // every function is like:
    // function(game) {
    //   var p = game.currentPlayer();
    //   p.draw(4);
    //   p.discard(1, 'choose');
    // }
    initialize: function(events) {
      this.events = events; // the action itself
      this.type.push('action');
    },
    // TODO add a check at initialization isntead of doing it in play
    play: function(game) {
      var that = this;
      var recursive = function(ev, game) {
        var str, n;
        if (typeof ev[0] === 'string') {
          str = ev[0].split(' ')[1];
          if (!str) {
            throw {
              name: 'CardError',
              message: 'Card '+that.name+' has invalid events array'
            };
          }
          n = parseInt(str, 10);
        }
      };
    }
  });

  return Action;
});
