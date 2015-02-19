'use strict'

var util = require('util');

var bin = 'pdf2swf';

// pdf2swf <PDF PATH> -o <OUT FILE> -f -T 9 -t -s storeallcharacters
var convert = function(in_path, out_path) {
  return util.format('%s %s -o %s -f -T 9 -t -s storeallcharacters', bin, in_path, out_path);
}

module.exports.convert = convert;
