'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

require('time-diff', 'Time');
require('log-utils', 'log');
require('pkg-cache', 'pkgs');
require('pkg-homepage', 'homepage');
require('markdown-reference', 'reference');
require = fn;

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Expose utils
 */

module.exports = utils;
