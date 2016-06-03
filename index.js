/*!
 * reflinks <https://github.com/jonschlinkert/reflinks>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var ora = require('ora');
var utils = require('./utils');

/**
 * Generate a list of reflinks for a `glob` of files,
 * relative to the specified `dest` file.
 *
 * @param  {String|Array} `glob` Glob patterns to pass to [matched][].
 * @param  {String} `dest`
 * @param  {String} `opts` Options to pass to [matched][].
 * @return {String} List of reflinks.
 */

module.exports = function reflinks(names, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  options = options || {};
  var time = new utils.Time();
  var log = utils.log;
  var color = options.color || 'green';
  var start = options.starting || 'creating reference links from npm data';
  var stop = options.finished || 'created reference links from npm data';

  var spinner = ora(start).start();
  utils.pkgs(names, options, function(err, arr) {
    spinner.color = color;
    spinner.text = stop;
    spinner.stop();

    if (err) {
      // let the implementor decide what to do when a package doesn't exist
      cb(err, arr);
      return;
    }

    cb(null, linkify(arr, options));
  });
}

/**
 * Create a formatted reflink
 */

function linkify(arr, options) {
  return utils.arrayify(arr).reduce(function(acc, pkg) {
    if (!pkg.name) return acc;

    pkg.homepage = utils.homepage(pkg);
    var link = typeof options.template !== 'function'
      ? utils.reference(pkg.name, pkg.homepage)
      : options.template(pkg, options);

    if (link) {
      acc.push(link.replace(/#readme$/, ''));
    }
    return acc;
  }, []);
}
