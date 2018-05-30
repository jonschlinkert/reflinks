'use strict';

const reflinks = require('./');

reflinks(['micromatch', 'generate'])
  .then(res => {
    console.log(res.links);
    // results in:
    //  [ '[generate]: https://github.com/generate/generate',
    //    '[micromatch]: https://github.com/micromatch/micromatch' ]
  })
  .catch(console.error);
