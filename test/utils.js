var requirejs = require("requirejs");
var assert = require("assert");
var should = require("should");
requirejs.config({
  baseUrl: 'js',
  nodeRequire: require
});

describe('Utils Testing', function() {
  // Load modules with requirejs before tests
  var U;
  before(function(done) {
    requirejs(['utils'], function(u) {
      U = u;
      done();
    });
  });

  describe('#Array shuffle', function(){
    it('should work without problems', function(){
      var a = [1, 2, 3, 4, 5, 6, 7, 8 , 9, 10], i,
      cpy = [];
      for (i = 0; i < 5; i++) {
        cpy.push(a.slice(0).shuffle());
      }
      cpy.should.not.containEql(a);

      a = [];
      a.shuffle().should.be.eql([]);

      a = [1];
      a.shuffle().should.be.eql([1]);
    });
  });

});
