/*jshint -W030 */
'use strict';
require('should');
var _ = require('lodash');
var Player = require('../js/player');
var Gold = require('../js/cards/gold');
var Estate = require('../js/cards/estate');
var Copper = require('../js/cards/copper');

describe('Player tests', function() {
  var playerInitializer = function() {
    var i = 0;
    for (i = 0; i < 7; i++) {
      this.deck.push(Copper.new());
    }
    for (i = 0; i < 3; i++) {
      this.deck.push(Estate.new());
    }
  };

  describe('#Player instances', function() {
    it('should create some players', function() {
      Player.new.bind(Player, playerInitializer).should.not.throw();
      var p = Player.new(playerInitializer);
      p.should.be.ok;
      p.deck.should.have.lengthOf(10);
      p.hand.should.have.length(0);
      p.field.should.have.length(0);
      p.graveyard.should.have.length(0);
    });
    it('should fail creating some players', function() {
      Player.new.bind(Player).should.throw();
    });
    it('should draw the expected cards', function() {
      var p = Player.new(playerInitializer);
      var i;
      p.endTurn.bind(p).should.not.throw();
      p.hand.should.have.lengthOf(5);
      for (i = 0; i < p.hand.length; i++) {
        p.hand[i].name.should.be.eql('Copper');
      }
    });
    it('should be able to end turns', function() {
      var p = Player.new(playerInitializer);
      var i;
      for (i = 0; i < 10; i++) {
        p.endTurn.bind(p).should.not.throw();
      }
      (p.deck.length + p.graveyard.length + p.hand.length).should.be.eql(10);
      p.hand.should.have.lengthOf(5);
    });
    it('should not be able to draw too much cards', function() {
      var p = Player.new(playerInitializer);
      p.draws.bind(p, 8).should.not.throw();
      p.hand.should.have.lengthOf(8);
      p.deck.should.have.lengthOf(2);
      p.draws.bind(p, 8).should.not.throw();
      p.hand.should.have.lengthOf(10);
      p.deck.should.have.lengthOf(0);
      p.draws.bind(p, 8).should.not.throw();
      p.hand.should.have.lengthOf(10);
      p.deck.should.have.lengthOf(0);
    });
    it('should not do anything when drawing -X', function() {
      var p = Player.new(playerInitializer);
      p.draws.bind(p, -1).should.not.throw();
      p.deck.should.have.lengthOf(10);
      p.hand.should.have.lengthOf(0);
      p.draws.bind(p, 0).should.not.throw();
      p.deck.should.have.lengthOf(10);
      p.hand.should.have.lengthOf(0);
    });
    it('should discard cards with valid indexes', function() {
      var p = Player.new(playerInitializer);
      p.endTurn();
      p.discards.bind(p, {}).should.throw();
      p.discards.bind(p, -1).should.throw();
      p.discards.bind(p, 5).should.throw();
      p.discards.bind(p, 6).should.throw();
      p.discards(0);
      p.hand.should.have.lengthOf(4);
      p.graveyard.should.have.lengthOf(1);
      p.field.should.have.lengthOf(0);
      p.discards(1);
      p.hand.should.have.lengthOf(3);
      p.graveyard.should.have.lengthOf(2);
      p.field.should.have.lengthOf(0);
      p.discards(2);
      p.hand.should.have.lengthOf(2);
      p.graveyard.should.have.lengthOf(3);
      p.field.should.have.lengthOf(0);
      p.discards(0);
      p.hand.should.have.lengthOf(1);
      p.graveyard.should.have.lengthOf(4);
      p.field.should.have.lengthOf(0);
      p.discards(0);
      p.hand.should.have.lengthOf(0);
      p.graveyard.should.have.lengthOf(5);
      p.field.should.have.lengthOf(0);
      p.discards.bind(p, 0).should.throw();
      p.hand.should.have.lengthOf(0);
      p.graveyard.should.have.lengthOf(5);
      p.field.should.have.lengthOf(0);
    });
    it('should be able to shuffle graveyard when deck is empty', function() {
      var p = Player.new(playerInitializer);
      p.endTurn();
      p.hand.should.have.lengthOf(5);
      p.deck.should.have.lengthOf(5);
      p.graveyard.should.have.lengthOf(0);
      p.field.should.have.lengthOf(0);

      // play a copper
      p.plays(0);
      p.hand.should.have.lengthOf(4);
      p.graveyard.should.have.lengthOf(0);
      p.field.should.have.lengthOf(1);

      // discard some coppers
      p.discards(0);
      p.discards(0);
      p.hand.should.have.lengthOf(2);
      p.graveyard.should.have.lengthOf(2);
      p.field.should.have.lengthOf(1);

      // now draw more than you can
      p.draws.bind(p, 9).should.not.throw();
      p.hand.should.have.lengthOf(9);
      p.graveyard.should.have.lengthOf(0);
      p.field.should.have.lengthOf(1);

      // count coppers and estates
      var coppers = 0,
        estates = 0;
      _.forEach.bind(_, p.hand, function(v) {
        if (v.name === 'Copper') {
          coppers++;
        } else if (v.name === 'Estate') {
          estates++;
        } else {
          throw {
            name: 'Error',
            message: 'Where dis that card come from?'
          };
        }
      }).should.not.throw();
      coppers.should.be.eql(6);
      estates.should.be.eql(3);
      p.hand[4].name.should.be.eql('Estate');
      p.hand[5].name.should.be.eql('Estate');
      p.hand[6].name.should.be.eql('Estate');
      p.hand[7].name.should.be.eql('Copper');
      p.hand[8].name.should.be.eql('Copper');
    });
  });
  describe('#Extract cards from player', function() {
    it('should do nothing with values <= 0', function() {
      var p = Player.new(playerInitializer);
      p.endTurn();
      var l = p.deck.length;
      var cards = p.extractFromDeck(0);
      cards.should.have.lengthOf(0);
      p.deck.should.have.lengthOf(l);
      cards = p.extractFromDeck(-3);
      cards.should.have.lengthOf(0);
      p.deck.should.have.lengthOf(l);
    });
    it('should be able to extract cards from deck', function() {
      var p = Player.new(playerInitializer);
      p.endTurn();
      var l = p.deck.length;
      var cp = p.deck.slice(0, 3);
      var cards = p.extractFromDeck(3);
      p.deck.should.have.lengthOf(l - 3);
      cards.should.be.eql(cp);
      cp = p.deck.slice(0, 1);
      cards = p.extractFromDeck(1);
      l -= 3;
      p.deck.should.have.lengthOf(l - 1);
      cards.should.be.eql(cp);
    });
    it('should be able to extract the whole deck but not beyond', function() {
      var p = Player.new(playerInitializer);
      p.endTurn();
      p.deck.length.should.be.above(1);
      var cp = p.deck.slice(0, 7);
      var cards = p.extractFromDeck(7);
      p.deck.should.have.lengthOf(0);
      cards.should.be.eql(cp);
      cards = p.extractFromDeck(7);
      p.deck.should.have.lengthOf(0);
      cards.should.be.empty;
    });
    it('should be able to extract cards after shuffling the deck', function() {
      var p = Player.new(playerInitializer);
      p.endTurn();
      p.endTurn();
      p.deck.should.have.lengthOf(0);
      p.graveyard.should.have.lengthOf(5);
      var cards = p.extractFromDeck(3);
      p.graveyard.should.have.lengthOf(0);
      p.deck.should.have.lengthOf(2);
      cards.should.have.lengthOf(3);
    });
    it('should be able to extract, shuffle and extract the missing cards', function() {
      var p = Player.new(playerInitializer);
      p.endTurn();
      p.graveyard.push(Gold.new());
      p.graveyard.push(Gold.new());
      p.graveyard.push(Gold.new());
      p.deck.should.have.lengthOf(5);
      var cards = p.extractFromDeck(7);
      cards.should.have.lengthOf(7);
      p.deck.should.have.lengthOf(1);
      cards.containCard('Gold').should.be.ok;
    });
    it('should be able to extract, shuffle and extract as much as possible', function() {
      var p = Player.new(playerInitializer);
      p.endTurn();
      p.graveyard.push(Gold.new());
      p.graveyard.push(Gold.new());
      p.graveyard.push(Gold.new());
      p.deck.should.have.lengthOf(5);
      var cards = p.extractFromDeck(11);
      p.deck.should.have.lengthOf(0);
      cards.should.have.lengthOf(8);
      cards.containCard('Gold').should.be.ok;
    });
  });

});
