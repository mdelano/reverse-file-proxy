'use strict'

var util = require('util');

var bin = 'pdf2svg';

// pdf2svg <IN PTH> <OUT PATH>
var convert = function(in_path, out_path) {
  return util.format('%s %s %s', bin, in_path, out_path);
}

module.exports.convert = convert;
