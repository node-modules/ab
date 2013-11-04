/*!
 * ab - example/dns.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var ab = require('../');
var dns = require('dns');

var domain = process.argv[2];
if (!domain) {
  console.log('Usage: $ node dns.js [domain] [concurrency=10] [requests=10000]');
  process.exit(-1);
}

console.log('dns.resolve(%j) Benchmark\n', domain);

var fn = function (callback) {
  dns.resolve(domain, function (err, addresses) {
    // err, success
    callback(err, addresses && addresses.length > 0, {reqSize: 100, resSize: 200});
  });
};

// fn must follow `fn(callback)` format.
ab.run(fn, {
  name: 'dns.js',
  concurrency: parseInt(process.argv[3], 10) || 10,
  requests: parseInt(process.argv[4], 10) || 10000,
});
