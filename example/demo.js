/*!
 * ab - example/demo.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var ab = require('../');
var dns = require('dns');

var fn = function (callback) {
  dns.resolve('github.com', function (err, addresses) {
    // err, success
    callback(err, addresses && addresses.length > 0);
  });
};

// fn must follow `fn(callback)` format.
ab.run(fn, {
  concurrency: 5,
  requests: 100
}).on('end', function (report) {
  console.log(report);
}).on('error', function (err) {
  console.error(err);
});
