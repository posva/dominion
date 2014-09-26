define(['lodash', 'cards/copper', 'cards/curse', 'cards/duchy', 'cards/estate', 'cards/gold', 'cards/province', 'cards/silver'], function(_, Copper, Curse, Duchy, Estate, Gold, Province, Silver) {
  var amounts = {
    '2': { // TODO
      'curse': 10,
      'estate': 8,
      'copper': 40,
      'province': 8,
      'duchy': 8,
      'silver': 30,
      'gold': 30
    },
    '3-4': { // TODO
      'curse': 30,
      'estate': 12,
      'copper': 40,
      'province': 12,
      'duchy': 12,
      'silver': 30,
      'gold': 30
    }
  };
  var Base = {
    cards: {
      'curse': Curse,
      'estate': Estate,
      'copper': Copper,
      'province': Province,
      'duchy': Duchy,
      'silver': Silver,
      'gold': Gold
    },
    getAmounts: function(n) {
      var r;
      if (typeof n !== 'number') {
        return r; // only numbers please
      }
      _.forOwn(amounts, function(v, k) {
        var ind = k.indexOf('-'), a, b;
        if (ind > 0) {
          a = parseInt(k.substr(0, ind));
          b = parseInt(k.substr(ind+1), 10);
          if (n >= a && n <= b) {
            r = v;
            return false;
          }
        } else {
          if (n === parseInt(k, 10)) {
            r = v;
            return false;
          }
        }
      });
      return r;
    }
  };

  return Base;
});
