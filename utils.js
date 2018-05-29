'use strict';

define(exports, 'each', () => require('async-each'));
define(exports, 'pkg', () => require('get-pkg'));
define(exports, 'extend', () => require('extend-shallow'));
define(exports, 'homepage', () => require('pkg-homepage'));
define(exports, 'reference', () => require('markdown-reference'));
define(exports, 'Dates', () => require('date-store'));
define(exports, 'Store', () => require('data-store'));

function define(obj, key, fn) {
  Object.defineProperty(obj, key, { get: fn });
}

exports.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

exports.isCached = function(store, name, timespan) {
  return store.has(name) && store.lastSaved(name).lessThan(timespan);
};
