define(['selfish', 'lodash', 'event'], function(selfish, _, Event) {
  var Base = selfish.Base;
  var validStrings = [ 'choose', 'random' ];
  var checkEventArray = function(ev) {
    var str, n;
    ev = ev || this.events;
    //console.log('i am', ev, ev instanceof Array);
    if (!(ev instanceof Array) || ev.length < 1) {
      throw {
        name: 'CardError',
        message: 'Card '+this.name+' events is not an array'
      };
    }
    if (typeof ev[0] === 'string') {
      str = ev[0].split(' ')[1] || '';
      if ((!str && typeof str !== 'string') || validStrings.indexOf(ev[0].split(' ')[0]) < 0) {
        throw {
          name: 'CardError',
          message: 'Card '+this.name+' events array first element is not a valid string neither a function'
        };
      }
      if (str === '') {
        n = 1;
      } else {
        n = parseInt(str, 10);
      }
      if (typeof n !== 'number' || isNaN(n) || n < 1) {
        throw {
          name: 'CardError',
          message: 'Card '+this.name+' has an invalid parameter: '+str
        };
      }
      if (n >= ev.length) {
        throw {
          name: 'CardError',
          message: 'Card '+this.name+' has too much choices: '+n+' when max is '+(ev.length-1)
        };
      }
      ev = ev.slice(1); // copy the rest of the array
    }
    var that = this;
    _.each(ev, function(v) {
      if (!v || !Event.isPrototypeOf(v)) {
        if (v instanceof Array) { // its an array!
          checkEventArray.apply(that, [v]);
        } else if (typeof v !== 'function') {
          throw {
            name: 'CardError',
            message: 'Card '+that.name+' has invalid events'
          };
        }
      }
    });
  };
  // recursive fucntion to play actions
  // TODO choose and other string functions
  var subPlay = function(arr, game) {
    if (typeof arr[0] === 'string') {
      return false; // stop iteration of actions if waiting for a choose
    } else {
      _.forEach(arr, function(v) {
        if (typeof v === 'object' && v.length) {
          if (!subPlay(v, game)) {
            return false; // stop iteration
          }
        } else {
          if (Event.isPrototypeOf(v)) {
            v.fire();
          } else {
            v(game);
          }
        }
      });
      return true; // all is ok
    }
  };
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
      //console.log(events, events[0]);
      this.events = events; // the action itself
      // check that events is valid
      //checkEventArray.apply(this, events);
      this.type.push('action');
    },
    // TODO add a check at initialization isntead of doing it in play
    // Even better just do dynamic tests for cards
    play: function(game) {
      subPlay(this.events, game);
    },
    checkEventArray: checkEventArray
  });

  return Action;
});
