/*jshint -W030 */
var requirejs = require('requirejs');
var assert = require('assert');
var should = require('should');
var _ = require('lodash');
var fs = require('fs');
requirejs.config({
  baseUrl: 'js',
  nodeRequire: require
});

describe('Dummy Suite for Modes', function() {
  var modes = {}, modes_array = [], Player;
  before(function(done) {
    requirejs(['player'], function(player) {
      Player = player;
      fs.readdir('js/modes', function(err, files) {
        // find modes files
        _.forEach(files, function(v) {
          if (v.match(/.js$/)) {
            var new_mode = 'modes/' + v.replace(/.js$/, '');
            modes_array.push(new_mode);
            modes[new_mode] = null;
          }
        });
        // require them
        requirejs(modes_array, function() {
          var i;
          for (i = 0; i < modes_array.length; i++) {
            modes[modes_array[i]] = arguments[i];
          }
          describe('Modes testing', function() {
            _.forOwn(modes, function(v, k) {
              describe(k+ '.js', function(){
                v = modes[k];
                describe('#Common', function(){
                  it('should have a cards object', function(){
                    v.should.have.property('cards');
                  });
                  it('should be able to get amounts of cards', function(){
                    v.getAmounts.should.be.a.Function;
                    assert.strictEqual(v.getAmounts('1'), undefined);
                    assert.strictEqual(v.getAmounts({}), undefined);
                    assert.strictEqual(v.getAmounts([]), undefined);
                    assert.strictEqual(v.getAmounts(1), undefined);
                    v.getAmounts(2).should.be.ok.and.be.an.Object;
                    v.getAmounts(3).should.be.ok.and.be.an.Object;
                    v.getAmounts(4).should.be.ok.and.be.an.Object;
                  });
                  it('should have an amount for every card in \'cards\'', function() {
                    var i, amounts;
                    var floop = function(v, k) {
                      amounts.should.have.property(k).and.be.a.Number;
                    };
                    for (i = 2; i < 6; i++) {
                      amounts = v.getAmounts(i);
                      if (amounts) {
                        _.forOwn(v.cards, floop);
                      }
                    }
                  });
                  it('should have a working playerInitializer', function() {
                    v.playerInitializer.should.be.a.Function;
                    Player.new.bind(Player, v.playerInitializer).should.not.throw();
                  });
                });
                describe('#Card creation', function() {
                  _.forOwn(v.cards, function(c, name) {
                    it('should be able to create ' + name, function() {
                      c.new().should.be.ok;
                    });
                  });
                });
              });
            });
          });
          done();
        });
      });
    });
  });

    it(':D', function(done) {
      var a = {};
      a.should.be.ok;
      done();
    });

  // TODO automate the test for every mode
});
