'use strict'

var util = require('util');

var bin = 'jpeg2swf';
var flash_version = '9';

// jpeg2swf <PATH TO JPEG> -T 9 -q 100 -o <PATH TO OUT FILE>
var convert = function(in_path, out_path) {
  return util.format('%s %s -T %s -q 100 -o %s', bin, in_path, flash_version, out_path);
}

module.exports.convert = convert;
