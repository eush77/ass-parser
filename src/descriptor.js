'use strict';

var zipmap = require('zipmap');


/**
 * Parse individual SSA/ASS lines ("descriptors").
 *
 * Return value has either "key" and "value" properties,
 * or "type" and "value" (if it is rather a comment line).
 * It can also be null (if the line is empty).
 *
 * Return value type depends on the descriptor being parsed:
 *   - object if `format` is specified,
 *   - array if the descriptor is a format specifier itself,
 *   - string otherwise.
 *
 * @arg {string} line
 * @arg {string[]} [format]
 * @return {Object?}
 */
module.exports = function (line, format) {
  if (/^\s*$/.test(line)) {
    return null;
  }
  else if (line[0] == ';') {
    return {
      type: 'comment',
      value: line.slice(1)
    };
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
