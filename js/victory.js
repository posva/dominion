'use strict';
var Base = require('selfish').Base;
var Victory = Base.extend({
  initialize: function(points) {
    if (typeof points === 'function') {
      this.points = points;
    } else {
      this.points = function() {
        return points;
      };
    }
    this.type.push('victory');
  },
});

module.exports = Victory;
