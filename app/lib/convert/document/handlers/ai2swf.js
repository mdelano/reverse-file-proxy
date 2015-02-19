////////////////////////////////////////////////////////
// Mike Delano
// MediaSilo 2015
//
// This file is responsible for converting documents
// to PDF's
////////////////////////////////////////////////////////

'use strict'

var fs                    = require('graceful-fs');
var Q                     = require('q');
var ai2pdf               = require('./ai2pdf');
var pdf2swf               = require('./pdf2swf');

var convert = function (input) {
  var deferred = Q.defer();

  ai2pdf.convert(input).then(function(pdf_result) {
    pdf2swf.convert(pdf_result.read_stream).then(function(swf_result) {
        fs.unlink(pdf_result.path);
        var result_stream = fs.createReadStream(swf_result.path);
        deferred.resolve({ read_stream: result_stream, path: swf_result.path });
    });
  });

  return deferred.promise;
}

module.exports.convert = convert;
