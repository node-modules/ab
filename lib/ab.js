/*!
 * ab - lib/ab.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var debug = require('debug')('ab');
var microtime = require('microtime');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

exports.run = function (fn, options) {
  return new Benchmark(fn, options).run();
};

function Benchmark(fn, options) {
  EventEmitter.call(this);
  this.fn = fn;
  options = options || {};
  this.requests = options.requests || 100;
  this.concurrency = options.concurrency || 5;
  this._finished = 0;
  this._fail = 0;
  this._use = 0;
}

util.inherits(Benchmark, EventEmitter);

Benchmark.prototype.run = function () {
  var that = this;
  this.on('done', function (id) {
    debug('#%d done', id);
    if (that._finished !== that.requests) {
      return;
    }

    var report = {
      requests: that.requests,
      concurrency: that.concurrency,
      minRT: 0,
      maxRT: 0,
      avgRT: 0,
      qps: 0,
    };

    report.avgRT = that._use / that.requests;
    report.qps = that.requests / that._use * 1000 * 1000;
    that.emit('end', report);
  });

  var left = this.requests / this.concurrency;
  for (var i = 0; i < that.concurrency; i++) {
    that.next(i, left);
  }

  console.log('run');
  return this;
};

Benchmark.prototype.next = function (id, left) {
  var fn = this.fn;
  var that = this;
  var start = microtime.now();
  fn(function (err, success) {
    that._use += microtime.now() - start;
    that._finished++;
    if (err) {
      that.emit('error', err);
    }
    if (!success) {
      that._fail++;
    }

    left--;
    if (left === 0) {
      return that.emit('done', id);
    }

    that.next(id, left);
  });
};
