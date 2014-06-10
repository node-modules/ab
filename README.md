ab
=======

[![NPM](https://nodei.co/npm/ab.png?downloads=true&stars=true)](https://nodei.co/npm/ab/)

![logo](https://raw.github.com/node-modules/ab/master/logo.png)

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
    callback(null, exists);
  });
};

ab.run(fn, {
  concurrency: 50,
  requests: 100000
});
```

## Result example

```bash
$ node example/fs.js
This is ab, A benchmark tool. Version 0.0.1
Copyright (c) 2013 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
The MIT License

Benchmarking ... (be patient)
Completed 10000 requests
Completed 20000 requests
Completed 30000 requests
Completed 40000 requests
Completed 50000 requests
Completed 60000 requests
Completed 70000 requests
Completed 80000 requests
Completed 90000 requests
Completed 100000 requests
Finished 100000 requests


Date:                   Tue Oct 15 2013 22:58:35 GMT+0800 (CST)
Concurrency Level:      50
Time taken for tests:   2.630 seconds
Complete requests:      100000
Failed requests:        0
Errors:                 0
Requests per second:    38022.814 [#/sec]
Average RT:             1.313 [ms]
Min RT:                 0.038 [ms]
Max RT:                 50.989 [ms]

RT ranges:

  0 ~ 0.5  [ms]:        48 (0.0%)
0.5 ~ 1    [ms]:        53440 (53.4%)
  1 ~ 2    [ms]:        39781 (39.8%)
  2 ~ 3    [ms]:        4188 (4.2%)
  3 ~ 4    [ms]:        736 (0.7%)
  4 ~ 5    [ms]:        486 (0.5%)
  5 ~ 6    [ms]:        272 (0.3%)
  6 ~ 7    [ms]:        154 (0.2%)
  7 ~ 8    [ms]:        258 (0.3%)
  8 ~ 9    [ms]:        90 (0.1%)
  9 ~ 10   [ms]:        65 (0.1%)
 10 ~ 15   [ms]:        196 (0.2%)
 15 ~ 20   [ms]:        172 (0.2%)
 20 ~ 30   [ms]:        19 (0.0%)
 30 ~ 50   [ms]:        93 (0.1%)
 50 ~ 100  [ms]:        2 (0.0%)
100 ~ 200  [ms]:        0 (0.0%)
200 ~ 500  [ms]:        0 (0.0%)
500 ~ 1000 [ms]:        0 (0.0%)
  1000+    [ms]:        0 (0.0%)
```

## License

(The MIT License)

Copyright (c) 2013 - 2014 fengmk2 &lt;fengmk2@gmail.com&gt; and other contributors

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
