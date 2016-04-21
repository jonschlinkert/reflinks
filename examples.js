'use strict';

var reflinks = require('./');

reflinks(['base', 'base-task', 'base-option', 'ansi-cyan', 'micromatch'], function(err, res) {
  if (err) throw err;
  console.log(res);
});
