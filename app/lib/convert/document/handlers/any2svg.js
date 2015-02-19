////////////////////////////////////////////////////////
// Mike Delano
// MediaSilo 2015
//
// This file is responsible for converting documents
// to SVG's
////////////////////////////////////////////////////////

'use strict'

var fs                    = require('graceful-fs');
var exec                  = require('child_process').exec;
var Q                     = require('q');
var any2pdf               = require('./any2pdf');
var handler_input_helper  = require('../../helpers/handler_input_helper');
var pdf2svg              = require('../commands').pdf2svg;
var command_runner        = require('../../helpers').command_runner;

var convert = function (input) {
  var deferred = Q.defer();

  handler_input_helper.normalize_input(input, true).then(function(normalized_input) {
    any2pdf.convert(normalized_input.path).then(function(pdf_result) {
      var out_file = normalized_input.path + '.svg';

      command_runner.execute(pdf2svg.convert(pdf_result.path, out_file)).then(function(result) {
        fs.unlink(normalized_input.path);
        fs.unlink(pdf_result.path);
        var result_stream = fs.createReadStream(out_file);
        deferred.resolve({ read_stream: result_stream, path: out_file });
      });

    });
  });

  return deferred.promise;
}

module.exports.convert = convert;
