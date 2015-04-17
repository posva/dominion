'use strict';
var Base = require('selfish').Base;
var Card = Base.extend({
  initialize: function(name, cost) {
    var conf;
    if (name && typeof name === 'object') {
      conf = name;
      conf.name = conf.name || 'Empty Name';
      conf.cost = conf.cost || 0;
    } else {
      conf = {};
      conf.name = name || 'Empty Name';
      conf.cost = cost || 0;
    }
    if (typeof conf.cost === 'function') {
      this.cost = conf.cost;
    } else {
      this.cost = function() {
        return conf.cost;
      };
    }
    this.img = conf.img;
    this.name = conf.name;
    this.text = conf.text;
    this.type = [];
  },
  is: function(ty) {
    return this.type.indexOf(ty) >= 0;
  },
});

module.exports = Card;
