'use strict';
var u = {};

// extend array :*
Array.prototype.shuffle = function() {
  var j, x, i = this.length;
  while (i > 0) {
    j = Math.floor(Math.random() * i);
    x = this[--i];
    this[i] = this[j];
    this[j] = x;
  }
  return this;
};
Array.prototype.containCard = function(s) {
  var i;
  for (i = 0; i < this.length; i++) {
    if (this[i].name === s) {
      return true;
    }
  }
  return false;
};

module.exports = u;
