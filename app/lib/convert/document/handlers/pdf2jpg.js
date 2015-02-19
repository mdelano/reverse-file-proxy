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
var pdftoppm              = require('../commands').pdftoppm;
var command_runner        = require('../../helpers').command_runner;

var convert = function (input) {
  var deferred = Q.defer();

  handler_input_helper.normalize_input(input, true).then(function(normalized_input) {
    var out_file = normalized_input.path + ".jpg";

    command_runner.execute(pdftoppm.convert('jpeg', normalized_input.path, normalized_input.path)).then(function(result) {
      fs.unlink(normalized_input.path);
      var result_stream = fs.createReadStream(out_file);
      deferred.resolve({ read_stream: result_stream, path: out_file });
    });

  });

  return deferred.promise;
}

module.exports.convert = convert;
