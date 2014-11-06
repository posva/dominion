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
  var subPlay = function(arr, game, mem) {
    this.lastMemory = mem;
    if (typeof arr[0] === 'string') {
      if (this.memory.indexOf(mem) >= 0) {
        return true; // shown must go on
      }
      this.memory.push(mem);
      this.solve(); // solve pushed actions as they may interfeer with the choose
      game.waitChoose(this, arr);
      return false; // stop iteration of actions if waiting for a choose
    } else {
      var ok = _.forEach(arr, function(v, i) {
        var localMem = mem+','+i;
        if (typeof v === 'object' && v.length) {
          if (!subPlay.apply(this, [v, game, localMem])) {
            return false; // stop iteration
          }
        } else {
          if (this.memory.indexOf(localMem) >= 0) {
            return; // keep iterating
          }
          this.memory.push(localMem);
          if (Event.isPrototypeOf(v)) {
            this.actionsFile.push(v.fire.bind(v));
          } else {
            this.actionsFile.push(v.bind(null, game));
          }
        }
      }, this);
      //if (!ok) {
        //return false;
      //}
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

      // those variable allow for choose or any other kind of inteerruptions
      // they will ensure that all events get fired following the right order
      // memory example: '1' -> 0 is a choose array: [ ['choose', ...,...],...,...]
      // 1,2,3 -> [[..., [...,...,['choose', ..., ...], ...], ...], ..., ...]
      // in this last example are in deep 3 and we stopped at array 0, then 1, then 2
      this.memory = []; // remember all the actions done
      // if the array isn't empty then we're calling an action to continue
      // therefore this memory must be cleaned by game before playing an action
      this.lastMemory = '';

      this.actionsFile = []; // Pile up every action and then execute them all
    },
    // TODO add a check at initialization isntead of doing it in play
    // Even better just do dynamic tests for cards
    play: function(game) {
      //console.log('Play');
      return subPlay.apply(this, [this.events, game, '']);
    },
    // resume the play after a choose or similar call
    replay: function(arr, game) {
      //console.log('Replay', arr);
      return subPlay.apply(this, [arr, game, this.lastMemory]);
    },
    // once all the actions have been chosed we can solve them
    solve: function() {
      //console.log('SOLVE');
      var f = this.actionsFile.shift();
      while (typeof f === 'function') {
        f();
        f = this.actionsFile.shift();
      }
    },
    cleanMemory: function() {
      this.memory = [];
      this.actionsFile = [];
    },
    checkEventArray: checkEventArray
  });

  return Action;
});
