'use strict'

var util = require('util');

var bin = 'pdftoppm';

// pdftoppm -<FORMAT> <IN PATH> <OUT FILE PREFIX>
var convert = function(format, in_path, out_path_prefix) {
  return util.format('%s -%s -singlefile %s %s', bin, format, in_path, out_path_prefix);
}

module.exports.convert = convert;
