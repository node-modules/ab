/*!
 * ab - example/fs.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var ab = require('../');
var fs = require('fs');

var fn = function (callback) {
  fs.exists(__filename, function (exists) {
    callback(null, exists);
  });
};

ab.run(fn, {
  name: 'fs.exists(__filename)',
  concurrency: 50,
  requests: 200000
});
