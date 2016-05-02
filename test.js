'use strict';

require('mocha');
var assert = require('assert');
var reflinks = require('./');

describe('reflinks', function() {
  it('should export a function', function() {
    assert.equal(typeof reflinks, 'function');
  });

  it('should get an array of reflinks from npm packages', function(cb) {
    var fixtures = ['base', 'base-task', 'base-option'];
    reflinks(fixtures, function(err, links) {
      if (err) return cb(err);
      assert(Array.isArray(links));
      assert.equal(links.length, 3);
      cb();
    });
  });
});
