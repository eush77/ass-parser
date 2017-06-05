'use strict';

var assParser = require('..');

var test = require('tape');

var fs = require('fs');


var sample = function (encoding) {
  return fs.readFileSync(__dirname + '/sample.ass', { encoding: encoding });
};

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
  t.deepEqual(assParser(sample('utf8')),
              subtitleWithoutComments,
              'without comments');
  t.deepEqual(assParser(sample('utf8'), { comments: true }),
              subtitleWithComments,
              'with comments');
  t.deepEqual(assParser(sample(null)),
              subtitleWithoutComments,
              'without comments (buffer)');
  t.end();
});
