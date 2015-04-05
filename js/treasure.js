var Base = require('selfish').Base;

var Treasure = Base.extend({
  initialize: function(money) {
    if (typeof money === 'function') {
      this.money = money;
    } else {
      this.money = function() {
        return money;
      };
    }
    this.type.push('treasure');
  },
});

module.exports = Treasure;
