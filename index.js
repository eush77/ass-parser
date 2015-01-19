'use strict';

var execAll = require('regexp.execall')
  , fzip = require('fzip')
  , zipmap = require('zipmap')
  , flatmap = require('flatmap');


var isFormatKey = function (key) {
  return key == 'Format';
};


/**
 * Parse descriptor line.
 *
 * Comments are ignored by default.
 *
 * If format specification is given, `values` field is not an array,
 * but rather an object with specified named fields.
 *
 * Return value type depends on the descriptor being parsed:
 *   - object if `format` is specified,
 *   - array if the descriptor is a format specifier itself,
 *   - null if line is empty or is a comment line,
 *   - string otherwise
 *
 * @example
 * parseDescriptor("Timer: 100,0000")
 * // { key: "Timer", value: "100,0000" }
 *
 * @example
 * parseDescriptor("Format: A, B, C")
 * // { key: "Format", value: ["A", "B", "C"] }
 *
 * @example
 * parseDescriptor("Values: 1, 2, 3", ["A", "B", "C"])
 * // { key: "Values", value: { A: "1", B: "2", C: "3" } }
 *
 * @example
 * parseDescriptor("; Comment")
 * // null
 *
 * @arg {string} line
 * @arg {string[]} [format]
 * @return {Object|Array|string|null}
 */
var parseDescriptor = function (line, format) {
  if (line[0] == ';' || /^\s*$/.test(line)) {
    return null;
  }

  var parts = line.split(':');

  var key = parts[0];
  var value = parts.slice(1)
                   .join(':')
                   .trim();

  if (format || isFormatKey(key)) {
    value = value.split(',');

    // Last part may contain commas (e.g. actual subtitle strings).
    if (format && value.length > format.length) {
      var lastPart = value.slice(format.length - 1).join(',');
      value.length = format.length - 1;
      value.push(lastPart);
    }

    value = value.map(Function.call.bind(''.trim));

    if (format) {
      value = zipmap(format, value);
    }
  }

  return {
    key: key,
    value: value
  };
};


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

    if (!format && isFormatKey(descriptor.key)) {
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
