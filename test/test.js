'use strict';

var assParser = require('..');

var test = require('tape');

var fs = require('fs');


var sample = fs.readFileSync(__dirname + '/sample.ass', { encoding: 'utf8' });

var subtitleWithComments = require('./sample.json');
var subtitleWithoutComments = subtitleWithComments.map(function (section) {
  return {
    section: section.section,
    body: section.body.filter(function (descriptor) {
      return descriptor.type != 'comment';
    })
  };
});


test('ass-parser', function (t) {
  t.deepEqual(assParser(sample), subtitleWithoutComments, 'without comments');
  t.deepEqual(assParser(sample, { comments: true }), subtitleWithComments, 'with comments');
  t.end();
});
