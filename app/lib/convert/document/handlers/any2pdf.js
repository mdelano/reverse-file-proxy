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
var soffice               = require('../commands').soffice;
var pdf2svg               = require('../commands').pdf2svg;

var Q                     = require('q');
var handler_input_helper  = require('../../helpers/handler_input_helper');
var command_runner        = require('../../helpers').command_runner;

var convert = function (input) {
  var deferred = Q.defer();

  handler_input_helper.normalize_input(input, true).then(function(normalized_input) {

    command_runner.execute(soffice.pdf(normalized_input.path)).then(function(result) {
      var result_path = normalized_input.path + ".pdf";
      var result_stream = fs.createReadStream(result_path);
      deferred.resolve({ read_stream: result_stream, path: result_path });
    });

  });

  return deferred.promise;
}

module.exports.convert = convert;
