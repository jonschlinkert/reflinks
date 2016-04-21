/*!
 * reflinks <https://github.com/jonschlinkert/reflinks>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./lib/utils');

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
  var name = options.spinnerName || 'reflinks';
  var start = options.spinnerStart || 'creating reference links from npm data';
  var stop = options.spinnerStop || 'created reference links from npm data';

  // start spinner
  log.spinner.startTimer(time, name, start, options);

  utils.pkgs(names, options, function(err, arr) {
    if (err) return cb(err);

    // stop spinner
    log.spinner.stopTimer(time, name, stop, options);
    cb(null, linkify(arr, options.template));
  });
}

/**
 * Create a formatted reflink
 */

function linkify(arr, template) {
  return arr.reduce(function(acc, obj) {
    if (typeof template === 'function') {
      var link = template(obj);
      if (link) acc.push(link);
    }
    acc.push(`[${obj.name}]: ${obj.homepage || obj.repository}`);
    return acc;
  }, []);
}
