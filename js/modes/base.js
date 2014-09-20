define(['cards/copper', 'cards/curse', 'cards/duchy', 'cards/estate', 'cards/gold', 'cards/province', 'cards/silver'], function(Copper, Curse, Duchy, Estate, Gold, Province, Silver) {
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
    amounts : {
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
    }
  };

  return Base;
});
