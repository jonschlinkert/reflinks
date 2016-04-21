'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

require('time-diff', 'Time');
require('log-utils', 'log');
require('pkg-cache', 'pkgs');
require = fn;

utils.filter = function(names, cached) {
  return utils.removeEach(names, utils.values(cached, 'name'));
};

utils.values = function(arr, prop) {
  return arr.map(function(ele) {
    return ele[prop];
  });
};

utils.removeEach = function(arr, names) {
  names = utils.arrayify(names);
  var len = names.length;
  var idx = -1;
  while (++idx < len) {
    utils.remove(arr, names[idx]);
  }
  return arr;
};

utils.remove = function(arr, str) {
  arr = utils.arrayify(arr);
  var last = arr.pop();
  var len = arr.length;
  var idx = -1;

  while (++idx < len) {
    if (arr[idx] === str) {
      arr[idx] = last;
      break;
    }
  }
  return arr;
};

utils.setEach = function(store, dateStore, pkgs) {
  utils.arrayify(pkgs).forEach(function(pkg) {
    store.set(pkg.name, pkg);
    dateStore.set(pkg.name);
  });
};

utils.getEach = function(store, dateStore, timespan, names) {
  return utils.arrayify(names).reduce(function(acc, name) {
    if (dateStore.lastSaved(name).lessThan(timespan)) {
      return acc.concat(store.get(name) || []);
    }
    return acc;
  }, []);
};

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Expose utils
 */

module.exports = utils;
