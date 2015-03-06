/*!
 * reflinks <https://github.com/jonschlinkert/reflinks>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var should = require('should');
var reflinks = require('./');

describe('reflinks', function () {
  it('should generate a reflink for a file:', function () {
    reflinks('fixtures/b.md', 'fixtures/a.md').should.equal('\n[b]: b.md');
  });

  it('should use `options.cwd`:', function () {
    reflinks('b.md', 'a.md', {cwd: 'fixtures'}).should.equal('\n[b]: b.md');
  });

  it('should generate reflinks for a glob of files:', function () {
    var a = reflinks('fixtures/*.md', 'fixtures/a.md');
    a.should.equal('\n[a]: a.md\n[b]: b.md\n[c]: c.md');

    var b = reflinks('*.md', 'a.md', {cwd: 'fixtures'});
    b.should.equal('\n[a]: a.md\n[b]: b.md\n[c]: c.md');

    var c = reflinks('**/*.md', 'a.md', {cwd: 'fixtures'});
    c.should.equal('\n[a]: a.md\n[b]: b.md\n[c]: c.md\n[x]: foo/bar/x.md\n[y]: foo/bar/y.md\n[z]: foo/bar/z.md\n[j]: foo/j.md\n[k]: foo/k.md\n[l]: foo/l.md');
  });

  it('should allow glob patterns to be an array:', function () {
    var actual = reflinks(['**/*.md'], 'a.md', {cwd: 'fixtures'});
    actual.should.equal('\n[a]: a.md\n[b]: b.md\n[c]: c.md\n[x]: foo/bar/x.md\n[y]: foo/bar/y.md\n[z]: foo/bar/z.md\n[j]: foo/j.md\n[k]: foo/k.md\n[l]: foo/l.md');
  });

  it('should generate relative paths:', function () {
    var actual = reflinks('**/*.md', 'foo/bar/z.md', {cwd: 'fixtures'});
    actual.should.equal('\n[a]: ../../a.md\n[b]: ../../b.md\n[c]: ../../c.md\n[x]: x.md\n[y]: y.md\n[z]: z.md\n[j]: ../j.md\n[k]: ../k.md\n[l]: ../l.md');
  });

  it('should use a custom `options.titleize` function:', function () {
    var actual = reflinks('*.md', 'a.md', {
      cwd: 'fixtures',
      titleize: function (fp) {
        return fp;
      }
    });
    actual.should.equal('\n[a.md]: a.md\n[b.md]: b.md\n[c.md]: c.md');
  });

  it('should throw an error:', function () {
    (function () {
      reflinks();
    }).should.throw('reflinks expects a string.');
  });
});
