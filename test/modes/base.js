var requirejs = require('requirejs');
var assert = require('assert');
var should = require('should');
requirejs.config({
  baseUrl: 'js',
  nodeRequire: require
});

describe('Base gamemode', function() {
  var Base;
  before(function(done) {
    requirejs(['modes/base'], function(base) {
      Base = base;
      done();
    });
  });

  describe('#Cards instances', function(){
    it('should create some cards', function(){
    });
  });

});
