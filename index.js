'use strict';

const ora = require('ora');
const util = require('util');
const utils = require('./utils');

/**
 * Generate a list of reflinks for a `glob` of files, relative
 * to the specified `dest` file.
 *
 * @param {String|Array} `glob` Glob patterns to pass to [matched][].
 * @param {String} `dest`
 * @param {String} `opts` Options to pass to [matched][].
 * @param {Function} `callback` (optional) Returns a promise if a callback is not passed.
 * @return {String} List of reflinks.
 */

module.exports = async(name, options, cb) => {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  const promise = reflinks(name, options);
  if (typeof cb === 'function') {
    promise.then(res => cb(null, res)).catch(cb);
    return;
  }

  return promise;
};

async function reflinks(names, options = {}) {
  const dates = new utils.Dates('reflinks-dates-cache');
  const store = new utils.Store('reflinks-names-cache');

  if (options.reflinksCache === false) {
    options.cache = false;
  }

  if (options.clearCache === true) {
    dates.clear();
    store.clear();
  }

  const color = options.color || 'green';
  const start = options.starting || 'creating reference links from npm data';
  const stop = options.finished || 'created reference links from npm data';
  const timespan = options.timespan || '1 week ago';
  const spinner = ora(start).start();
  const pkgs = [];

  for (const name of [].concat(names || [])) {
    if (utils.isCached(dates, name, timespan) && options.cache !== false) {

      let cached = store.get(name);
      if (cached) {
        pkgs.push(cached);
        continue;
      }
    }

    try {
      const pkg = await utils.pkg(name);
      dates.set(name, pkg);
      store.set(name, pkg);
      pkgs.push(pkg);
    } catch (err) {
      if (err.message === 'document not found') {
        dates.set(name, {});
        continue;
      }
      throw err;
    }
  }

  spinner.color = color;
  spinner.text = stop;
  spinner.stop();

  const res = linkify(pkgs, options);
  res.links.sort((a, b) => a.localeCompare(b));
  return res;
}

/**
 * Create a formatted reflink
 */

function linkify(arr, options) {
  const obj = { links: [], cache: {}, pkgs: {} };
  return [].concat(arr || []).reduce(function(acc, pkg) {
    if (!pkg.name) return acc;

    pkg.homepage = utils.homepage(pkg);
    if (!pkg.name || !pkg.homepage) {
      return acc;
    }

    const link = typeof options.template !== 'function'
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
