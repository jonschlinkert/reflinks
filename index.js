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

  var dates = new utils.Dates('reflinks-dates-cache');
  var store = new utils.Store('reflinks-names-cache');

  var opts = utils.extend({}, options);
  if (opts.reflinksCache === false) {
    opts.cache = false;
  }
  if (opts.clearCache === true) {
    dates.del({force: true});
    store.del({force: true});
  }

  var color = opts.color || 'green';
  var start = opts.starting || 'creating reference links from npm data';
  var stop = opts.finished || 'created reference links from npm data';
  var timespan = opts.timespan || '1 week ago';

  var spinner = ora(start).start();
  var pkgs = [];

  utils.each(utils.arrayify(names), function(name, next) {
    if (utils.isCached(dates, name, timespan) && opts.cache !== false) {
      var val = store.get(name);
      if (val) {
        pkgs.push(val);
        next();
        return;
      }
    }

    utils.pkg(name, function(err, pkg) {
      if (err) {
        if (err.message === 'document not found') {
          dates.set(name, {});
          next();
          return;
        }
        next(err);
        return;
      }

      dates.set(name, pkg);
      store.set(name, pkg);
      pkgs.push(pkg);
      next();
    });
  }, function(err) {
    if (err) {
      cb(err);
      return;
    }

    spinner.color = color;
    spinner.text = stop;
    spinner.stop();

    if (err) {
      // let the implementor decide what to do when a package doesn't exist
      cb(err, pkgs);
      return;
    }

    var res = linkify(pkgs, opts);
    res.links.sort(function(a, b) {
      return a.localeCompare(b);
    });

    cb(null, res);
  });
};

/**
 * Create a formatted reflink
 */

function linkify(arr, options) {
  var obj = {links: [], cache: {}, pkgs: {}};
  return utils.arrayify(arr).reduce(function(acc, pkg) {
    if (!pkg.name) return acc;

    pkg.homepage = utils.homepage(pkg);
    var link = typeof options.template !== 'function'
      ? utils.reference(pkg.name, pkg.homepage)
      : options.template(pkg, options);

    if (link) {
      var res = link.replace(/#readme$/, '');
      acc.links.push(res);
      acc.cache[pkg.name] = res;
      acc.pkgs[pkg.name] = pkg;
    }
    return acc;
  }, obj);
}
