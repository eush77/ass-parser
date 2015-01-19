'use strict';

var zipmap = require('zipmap');


/**
 * Parse individual SSA/ASS lines ("descriptors").
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
module.exports = function (line, format) {
  if (line[0] == ';' || /^\s*$/.test(line)) {
    return null;
  }

  var parts = line.split(':');

  var key = parts[0];
  var value = parts.slice(1)
                   .join(':')
                   .trim();

  if (format || key == 'Format') {
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
