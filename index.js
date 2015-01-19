'use strict';

var execAll = require('regexp.execall')
  , fzip = require('fzip')
  , flatmap = require('flatmap');

var parseDescriptor = require('./src/descriptor');


/**
 * Parse section lines.
 *
 * "Format" descriptor (if there is one) specifies format for subsequent
 * lines in the same section.
 *
 * @arg {string[]} lines
 * @return {Object}
 */
var parseSection = function (lines) {
  // Format descriptor for subsequent section lines.
  var format = null;

  return flatmap(lines, function (line) {
    var descriptor = parseDescriptor(line, format);
    if (!descriptor) {
      // Empty / comment.
      return null;
    }

    if (!format && descriptor.key == 'Format') {
      format = descriptor.value;
    }

    return [descriptor];
  });
};


var parseAss = function (text) {
  var sections = execAll(/^\s*\[(.*)\]\s*$/mg, text);

  return fzip(sections, sections.slice(1), function (section, nextSection) {
    var sectionName = section[1];

    var begin = section.index + section[0].length + 1;
    var end = nextSection ? nextSection.index : text.length;
    var lines = text.slice(begin, end).split('\n');

    return {
      section: sectionName,
      body: parseSection(lines)
    };
  });
};


module.exports = parseAss;
