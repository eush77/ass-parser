'use strict';

var parseDescriptor = require('../src/descriptor');

var test = require('tape');


test('descriptor', function (t) {
  t.deepEqual(parseDescriptor('Timer: 100,0000'), {
    key: 'Timer',
    value: '100,0000'
  });

  t.deepEqual(parseDescriptor('Format: A, B, C, Rest'), {
    key: 'Format',
    value: ['A', 'B', 'C', 'Rest']
  });

  t.deepEqual(parseDescriptor('Values: 1, 2, 3, Foo;bar, foo:bar', ['A', 'B', 'C', 'Rest']), {
    key: 'Values',
    value: {
      A: '1',
      B: '2',
      C: '3',
      Rest: 'Foo;bar, foo:bar'
    }
  });

  t.deepEqual(parseDescriptor('; Comment'), {
    type: 'comment',
    value: 'Comment'
  });

  t.equal(parseDescriptor(''), null);

  t.end();
});
