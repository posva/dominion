var should = require('should');
var utils = require('../js/utils');

describe('Utils Testing', function() {
  describe('#Array shuffle', function() {
    it('should work without problems', function() {
      var a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        i,
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
