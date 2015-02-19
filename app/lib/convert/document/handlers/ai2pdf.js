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
var gs                    = require('../commands').gs;
var command_runner        = require('../../helpers').command_runner;

var convert = function (input) {
  var deferred = Q.defer();

  handler_input_helper.normalize_input(input, true).then(function(normalized_input) {
    var out_file = normalized_input.path + ".pdf"

    command_runner.execute(gs.convert(normalized_input.path, out_file)).then(function(result) {
      fs.unlink(normalized_input.path);
      var result_stream = fs.createReadStream(out_file);
      deferred.resolve({ read_stream: result_stream, path: out_file });
    });

  });

  return deferred.promise;
}

module.exports.convert = convert;
