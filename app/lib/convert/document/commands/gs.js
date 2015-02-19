'use strict'

var util = require('util');

var bin = 'gs';

// gs -q -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile=<OUT FILE> -dPDFSETTINGS=/prepress -dMaxSubsetPct=100 -dSubsetFonts=true -dEmbedAllFonts=true -dAutoRotatePages=/None <IN FILE>
var convert = function(in_path, out_path) {
  return util.format('%s -q -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile=%s -dPDFSETTINGS=/prepress -dMaxSubsetPct=100 -dSubsetFonts=true -dEmbedAllFonts=true -dAutoRotatePages=/None %s', bin, out_path, in_path);
}

module.exports.convert = convert;
//4416287
