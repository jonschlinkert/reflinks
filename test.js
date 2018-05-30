'use strict';

require('mocha');
var assert = require('assert');
var reflinks = require('./');

describe('reflinks', function() {
  it('should export a function', function() {
    assert.equal(typeof reflinks, 'function');
  });

  it('should get reflinks for a package', function() {
    return reflinks('micromatch')
      .then(res => {
        assert(Array.isArray(res.links));
        assert.equal(res.links.length, 1);
      });
  });

  it('should get an array of reflinks from npm packages', function() {
    return reflinks(['base', 'base-task', 'base-option'])
      .then(res => {
        assert(Array.isArray(res.links));
        assert.equal(res.links.length, 3);
      });
  });

  it('should work with a callback', function(cb) {
    reflinks(['base', 'base-task', 'base-option'], function(err, res) {
      if (err) return cb(err);
      assert(Array.isArray(res.links));
      assert.equal(res.links.length, 3);
      cb();
    });
  });

  it('should not choke on packages that do not exist', function(cb) {
    this.timeout(10000);
    reflinks('fofofofoofofofo', cb);
  });
});
