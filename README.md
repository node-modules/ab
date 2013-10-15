ab [![Build Status](https://secure.travis-ci.org/fengmk2/ab.png)](http://travis-ci.org/fengmk2/ab) [![Coverage Status](https://coveralls.io/repos/fengmk2/ab/badge.png)](https://coveralls.io/r/fengmk2/ab) [![Build Status](https://drone.io/github.com/fengmk2/ab/status.png)](https://drone.io/github.com/fengmk2/ab/latest)
=======

![logo](https://raw.github.com/fengmk2/ab/master/logo.png)

A benchmark tool.

## Install

```bash
$ npm install ab
```

## Usage

```js
var ab = require('ab');
var fs = require('fs');

var fn = function (callback) {
  fs.exists(__filename, function (exists) {
    // err, success
    callback(null, exists ? true : false);
  });
};

// fn must follow `fn(callback)` format.
ab.run(fn, {
  concurrency: 5,
  requests: 1000
}).on('end', function () {
  var report = ab.report();
  console.log(report);
}).on('error', function (err) {
  console.error(err);
});
```

## License 

(The MIT License)

Copyright (c) 2013 fengmk2 &lt;fengmk2@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
