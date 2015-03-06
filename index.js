/*!
 * reflinks <https://github.com/jonschlinkert/reflinks>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var globby = require('globby');
var relative = require('relative');
var mdu = require('markdown-utils');
var cache = {};

/**
 * Expose `reflinks`
 */

module.exports = reflinks;


/**
 * Generate a list of reflinks for a `glob` of files,
 * relative to the specified `dest` file.
 *
 * @param  {String|Array} `glob` Glob patterns to pass to [globby].
 * @param  {String} `dest`
 * @param  {String} `opts` Options to pass to [globby].
 * @return {String} List of reflinks.
 */

function reflinks(glob, dest, opts) {
  if (typeof dest !== 'string') {
    throw new TypeError('reflinks expects a string.');
  }

  return expand(glob, opts).reduce(function (acc, fp) {
    acc += '\n';
    acc += linkify(fp, dest, opts);
    return acc;
  }, '');
}

function expand(glob, options) {
  return cache[glob] || (cache[glob] = globby.sync(glob, options));
}

function linkify(fp, dest, opts) {
  return mdu.reference(titleize(fp, opts), relative(dest, fp));
}

function titleize(fp, opts) {
  if (opts && opts.titleize) return opts.titleize(fp);
  return path.basename(fp, path.extname(fp));
}
