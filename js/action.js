var Base = require('selfish').Base;
var _ = require('lodash');
var ActionEvent = require('./action-event');
var validStrings = ['choose', 'random'];
var checkEventArray = function(ev) {
  var str, n;
  ev = ev || this.events;
  //console.log('i am', ev, ev instanceof Array);
  if (!(ev instanceof Array) || ev.length < 1) {
    throw {
      name: 'CardError',
      message: 'Card ' + this.name + ' events is not an array'
    };
  }
  if (typeof ev[0] === 'string') {
    str = ev[0].split(' ')[1] || '';
    if ((!str && typeof str !== 'string') || validStrings.indexOf(ev[0].split(' ')[0]) < 0) {
      throw {
        name: 'CardError',
        message: 'Card ' + this.name + ' events array first element is not a valid string neither a function'
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
        message: 'Card ' + this.name + ' has an invalid parameter: ' + str
      };
    }
    if (n >= ev.length) {
      throw {
        name: 'CardError',
        message: 'Card ' + this.name + ' has too much choices: ' + n + ' when max is ' + (ev.length - 1)
      };
    }
    ev = ev.slice(1); // copy the rest of the array
  }
  var that = this;
  _.each(ev, function(v) {
    if (!v || !ActionEvent.isPrototypeOf(v)) {
      if (v instanceof Array) { // its an array!
        checkEventArray.apply(that, [v]);
      } else if (typeof v !== 'function') {
        throw {
          name: 'CardError',
          message: 'Card ' + that.name + ' has invalid events'
        };
      }
    }
  });
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

    this.actionQueue = []; // temp mem to save execution state
  },
  // TODO add a check at initialization isntead of doing it in play
  // Even better just do dynamic tests for cards
  play: function(game) {
    //console.log('Play');
    var me = this;
    // fun to add all elements of an array to the events queue
    var queueEvents = function queueEvents(array) {
      if (typeof array[0] === 'string') { // chooselike -> we push the whole array
        me.actionQueue.push(array);
      } else {
        _.forEach(array, function queueEventsLoop(ev) {
          me.actionQueue.push(ev);
        }, me);
      }
    };

    // if this is teh first call add every element in the array
    if (this.actionQueue.length === 0) {
      queueEvents(this.events);
    }

    var event, pendingChoices;
    while (this.actionQueue.length > 0) {
      event = this.actionQueue.shift();
      if (typeof event === 'object' && event.length) {
        if (typeof event[0] === 'string') { // it is a chooselike (embeded array)
          pendingChoices = {
            action: this,
            events: event.slice(1),
            amount: parseInt(event[0].split(' ')[1], 10) || 1 // no text = 1
          };
          // we must wait for player input
          return pendingChoices;
        } else { // array of events. we must expand it
          Array.prototype.unshift.apply(this.actionQueue, event);
        }
      } else if (ActionEvent.isPrototypeOf(event)) {
        event.fire();
      } else { // a function
        event(game);
      }
    }

    return false; // we are not waiting for user input
  },
  stackChoosenEvents: function(events) {
    // we push in front because we must resolve the choose first
    Array.prototype.unshift.apply(this.actionQueue, events);
  },
  cleanMemory: function() {
    this.actionQueue = [];
  },
  checkEventArray: checkEventArray
});

module.exports = Action;
