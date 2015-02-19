////////////////////////////////////////////////////////
// Mike Delano
// MediaSilo 2015
//
// This file is responsible for converting documents
// to PDF's
////////////////////////////////////////////////////////

'use strict'

var fs                    = require('graceful-fs');
var exec                  = require('child_process').exec;
var Q                     = require('q');
var handler_input_helper  = require('../../helpers/handler_input_helper');
var any2pdf               = require('./any2pdf');
var command_runner        = require('../../helpers').command_runner;
var pdftoppm              = require('../commands').pdftoppm;

var convert = function (input) {
  var deferred = Q.defer();
  any2pdf.convert(input).then(function(pdf_result) {
    var out_file_prefix = pdf_result.path.substr(0, pdf_result.path.lastIndexOf('.'));
    var out_file = out_file_prefix + ".jpg";

    command_runner.execute(pdftoppm.convert('jpeg', pdf_result.path, out_file_prefix)).then(function(pdftoppm_result) {
      fs.unlink(pdf_result.path);
      var result_stream = fs.createReadStream(out_file);
      deferred.resolve({ read_stream: result_stream, path: out_file });
    });
  });

  return deferred.promise;
}

module.exports.convert = convert;
