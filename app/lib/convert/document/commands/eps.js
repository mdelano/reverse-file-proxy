'use strict'

var util = require('util');

var eps2eps_bin = 'eps2eps';
var epstopdf_bin = 'epstopdf';


// eps2eps <IN PATH> <IN PATH>.eps && epstopdf <IN PATH>.eps -o <OUT PATH>
var convert = function(in_path, out_path) {
  return util.format('%s %s %s.eps && epstopdf %s.eps -o %s', eps2eps_bin, in_path, in_path, in_path, out_path);
}

module.exports.convert = convert;
