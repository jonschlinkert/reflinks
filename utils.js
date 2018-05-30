'use strict';

define(exports, 'pkg', () => require('get-pkg'));
define(exports, 'homepage', () => require('pkg-homepage'));
define(exports, 'reference', () => require('markdown-reference'));
define(exports, 'Dates', () => require('date-store'));
define(exports, 'Store', () => require('data-store'));

function define(obj, key, fn) {
  Object.defineProperty(obj, key, { get: fn });
}

exports.isCached = function(store, name, timespan) {
  return store.has(name) && store.lastSaved(name).lessThan(timespan);
};
