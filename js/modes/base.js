'use strict';
var Copper = require('../cards/copper');
var Curse = require('../cards/curse');
var Duchy = require('../cards/duchy');
var Estate = require('../cards/estate');
var Gold = require('../cards/gold');
var Province = require('../cards/province');
var Silver = require('../cards/silver');

var base = {
  cards: {
    'Curse': {
      card: Curse,
      amount: [10, 20, 30, 40, 50]
    },
    'Estate': {
      card: Estate,
      amount: [8, 12, 12, 12, 12]
    },
    'Duchy': {
      card: Duchy,
      amount: [8, 12, 12, 12, 12]
    },
    'Province': {
      card: Province,
      amount: [8, 12, 12, 15, 18]
    },
    'Copper': {
      card: Copper,
      amount: [46, 39, 32, 85, 78]
    },
    'Silver': {
      card: Silver,
      amount: [40, 40, 40, 80, 80]
    },
    'Gold': {
      card: Gold,
      amount: [30, 30, 30, 60, 60]
    },
    'kingdom-card': {
      card: null,
      amount: [10, 10, 10, 10, 10]
    },
    'victory-card': {
      card: null,
      amount: [8, 12, 12, 12, 12]
    }
  },
  playerInitializer: function(game) { // must be called by the player
    var i = 0;
    for (i = 0; i < 7; i++) {
      this.deck.push(game.cards.Copper.instance);
    }
    for (i = 0; i < 3; i++) {
      this.deck.push(game.cards.Estate.instance);
    }
    this.deck.shuffle();
  },
  isGameOver: function(game) {
    // TODO
    return game && false;
  }
};

module.exports = base;
