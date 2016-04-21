'use strict';

var reflinks = require('./');

reflinks(['base', 'verb', 'generate'], function(err, links) {
  if (err) throw err;
  console.log(links);
  // results in:
  // [ '[generate]: https://github.com/generate/generate',
  //   '[verb]: https://github.com/verbose/verb',
  //   '[base]: https://github.com/node-base/base' ]
});
