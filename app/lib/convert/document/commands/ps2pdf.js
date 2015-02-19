'use strict'

var util = require('util');

var bin = 'ps2pdf';

// ps2pdf -dUNROLLFORMS -dPDFSETTINGS=/default <IN PATH> <OUT PATH>
var convert = function(in_path, out_path) {
  return util.format('%s -dUNROLLFORMS -dPDFSETTINGS=/default %s %s', bin, in_path, out_path);
}

module.exports.convert = convert;
