'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

require('async-each', 'each');
require('get-pkg', 'pkg');
require('extend-shallow', 'extend');
require('pkg-homepage', 'homepage');
require('markdown-reference', 'reference');
require('date-store', 'Dates');
require('data-store', 'Store');
require = fn;

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

utils.isCached = function(store, name, timespan) {
  return store.has(name) && store.lastSaved(name).lessThan(timespan);
};

/**
 * Expose utils
 */

module.exports = utils;
