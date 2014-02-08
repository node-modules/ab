/*!
 * ab - lib/ab.js
 *
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var debug = require('debug')('ab');
var EventEmitter = require('events').EventEmitter;
var microtime = require('microtime');
var util = require('util');
var fs = require('fs');
var path = require('path');

var pkg = require('../package.json');
var HEAD = fs.readFileSync(path.join(__dirname, 'tpl', 'head.txt'), 'utf8');
var REPORT = fs.readFileSync(path.join(__dirname, 'tpl', 'report.txt'), 'utf8');

exports.run = function (fn, options, callback) {
  if (callback) options.callback = callback;

  return new Benchmark(fn, options).run();
};

function Benchmark(fn, options) {
  EventEmitter.call(this);
  this.fn = fn;
  options = options || {};
  this._name = options.name || '';
  this.requests = options.requests || 100;
  this.filename = options.filename || '';
  this.callback = options.callback || null;
  this._stageCount = Math.floor(this.requests / 10);
  if (this._stageCount > 10000) {
    this._stageCount = 10000;
  }
  this.concurrency = options.concurrency || 5;
  this._finished = 0;
  this._sent = 0;
  this._reqSize = 0;
  this._resSize = 0;
  this._fail = 0;
  this._errors = 0;
  this._rts = [];
  this._startTime = 0;
  this._totalRT = 0;
}

util.inherits(Benchmark, EventEmitter);

Benchmark.prototype.formatSize = function (size) {
  var unit = 'bytes';
  if (size >= 1024) {
    unit = 'KB';
    size /= 1024;
  }
  if (size >= 1024) {
    unit = 'MB';
    size /= 1024;
  }
  if (size >= 1024) {
    unit = 'GB';
    size /= 1024;
  }
  return size.toFixed(2) + ' ' + unit;
};

Benchmark.prototype.run = function () {
  var that = this;
  var startTime = that._startTime = Date.now();
  this.on('done', function (id) {
    debug('#%d done', id);
    if (that._finished !== that.requests) {
      return;
    }

    var totalUse = Date.now() - startTime;
    var minRT = null;
    var maxRT = null;
    var rtCounts = {'1000+': 0};
    var times = [
      0.5, 1, 1.5, 2, 2.5, 3, 3.5,
      4, 5, 6, 7, 8, 9, 10,
      15, 20, 30, 50, 100, 200, 500, 1000
    ];
    for (var i = 0; i < times.length; i++) {
      rtCounts[times[i]] = 0;
    }

    var rts = that._rts;
    var totalRT = 0;
    for (var i = 0; i < rts.length; i++) {
      var rt = rts[i] / 1000;
      totalRT += rt;
      if (minRT === null || minRT > rt) {
        minRT = rt;
      }
      if (maxRT === null || maxRT < rt) {
        maxRT = rt;
      }
      var hit = false;
      for (var j = 0; j < times.length; j++) {
        var t = times[j];
        if (rt <= t) {
          rtCounts[t] = (rtCounts[t] || 0) + 1;
          hit = true;
          break;
        }
      }
      if (!hit) {
        rtCounts['1000+']++;
      }
    }

    var avgRT = (totalRT / that.requests).toFixed(3);
    var qps = (that.requests / totalUse * 1000).toFixed(3);
    var total = that._finished;
    var rates = {};
    for (var t in rtCounts) {
      var r = rtCounts[t] / total * 100;
      rates[t] = r;
    }

    var rtRates = {};
    var totalRate = 0;
    for (var i = 0; i < times.length; i++) {
      var t = times[i];
      totalRate += (rates[t] || 0);
      if (totalRate >= 99.9 && !rtRates[99.9]) {
        rtRates[99.9] = t;
      }
      if (totalRate >= 99.5 && !rtRates[99.5]) {
        rtRates[99.5] = t;
      }
      if (totalRate >= 99 && !rtRates[99]) {
        rtRates[99] = t;
      }
      if (totalRate >= 98 && !rtRates[98]) {
        rtRates[98] = t;
      }
      if (totalRate >= 97 && !rtRates[97]) {
        rtRates[97] = t;
      }
      if (totalRate >= 96 && !rtRates[96]) {
        rtRates[96] = t;
      }
      if (totalRate >= 95 && !rtRates[95]) {
        rtRates[95] = t;
      }
      if (totalRate >= 90 && !rtRates[90]) {
        rtRates[90] = t;
      }
      if (totalRate >= 85 && !rtRates[85]) {
        rtRates[85] = t;
      }
      if (totalRate >= 80 && !rtRates[80]) {
        rtRates[80] = t;
      }
      if (totalRate >= 70 && !rtRates[70]) {
        rtRates[70] = t;
      }
      if (totalRate >= 60 && !rtRates[60]) {
        rtRates[60] = t;
      }
      if (totalRate >= 50 && !rtRates[50]) {
        rtRates[50] = t;
      }
    }

    for (var t in rates) {
      rates[t] = rates[t].toFixed(1);
    }

    var totalSize = that._reqSize + that._resSize;
    var totalSizeRate = (totalSize / totalUse).toFixed(2);
    var reqSizeRate= (that._reqSize / totalUse).toFixed(2);
    var resSizeRate = (that._resSize / totalUse).toFixed(2);

    var report = util.format(REPORT, total, Date(), that.concurrency, (totalUse / 1000).toFixed(3),
      total, that._fail, that._errors,
      that.formatSize(totalSize), totalSizeRate,
      that.formatSize(that._reqSize), reqSizeRate,
      that.formatSize(that._resSize), resSizeRate,
      qps, avgRT, minRT, maxRT,
      rtCounts['0.5'], rates['0.5'],
      rtCounts['1'], rates['1'],
      rtCounts['1.5'], rates['1.5'],
      rtCounts['2'], rates['2'],
      rtCounts['2.5'], rates['2.5'],
      rtCounts['3'], rates['3'],
      rtCounts['3.5'], rates['3.5'],
      rtCounts['4'], rates['4'],
      rtCounts['5'], rates['5'],
      rtCounts['6'], rates['6'],
      rtCounts['7'], rates['7'],
      rtCounts['8'], rates['8'],
      rtCounts['9'], rates['9'],
      rtCounts['10'], rates['10'],
      rtCounts['15'], rates['15'],
      rtCounts['20'], rates['20'],
      rtCounts['30'], rates['30'],
      rtCounts['50'], rates['50'],
      rtCounts['100'], rates['100'],
      rtCounts['200'], rates['200'],
      rtCounts['500'], rates['500'],
      rtCounts['1000'], rates['1000'],
      rtCounts['1000+'], rates['1000+'],
      rtRates[99.9], rtRates[99.5],
      rtRates[99], rtRates[98], rtRates[97], rtRates[96], rtRates[95], rtRates[90],
      rtRates[85], rtRates[80], rtRates[70], rtRates[60], rtRates[50]
    );
    if (this.filename) {
      fs.writeFileSync(this.filename, report, 'utf8');
    } else {
      console.log(report);
    }
    if (that.callback) that.callback(null);
    that.emit('end');
  });

  for (var i = 0; i < that.concurrency; i++) {
    that.next(i);
  }

  var author = pkg.author.name + ' ' + pkg.author.email + ' ' + pkg.author.url;
  console.log(HEAD, pkg.name, pkg.description, pkg.version, author, pkg.license);
  return this;
};

Benchmark.prototype.next = function (id) {
  var fn = this.fn;
  var that = this;
  var start = microtime.now();
  if (that._sent === that.requests) {
    return that.emit('done', id);
  }
  that._sent++;
  fn(function (err, success, info) {
    var use = microtime.now() - start;
    that._rts.push(use);
    that._totalRT += use;
    that._finished++;
    if (info) {
      if (info.reqSize) {
        that._reqSize += info.reqSize;
      }
      if (info.resSize) {
        that._resSize += info.resSize;
      }
    }
    if (that._finished % that._stageCount === 0) {
      var totalUse = Date.now() - that._startTime;

      console.log('%sCompleted %s%, %d requests, qps: %s, rt: %s ms, speed: %s (%s / %s) [Kbytes/sec]',
        that._name ? (that._name + ': ') : '',
        (that._finished / that.requests * 100).toFixed(0),
        that._finished, (that._finished / totalUse * 1000).toFixed(3),
        (that._totalRT / that._finished / 1000).toFixed(3),
        ((that._reqSize + that._resSize) / totalUse).toFixed(2),
        (that._reqSize / totalUse).toFixed(2),
        (that._resSize / totalUse).toFixed(2)
      );
    }

    if (err) {
      that._errors++;
      that.emit('error', err);
    }
    if (!success) {
      that._fail++;
    }
    that.next(id);
  });
};
