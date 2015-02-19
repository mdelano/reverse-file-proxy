'use strict'

var Q                     = require('q');
var fs                    = require('fs');
var handler_input_helper  = require('../../helpers/handler_input_helper');
var gm                    = require('../services').gm;

var resize = function (input, width, height, target_file_type) {
  var deferred = Q.defer();
  handler_input_helper.normalize_input(input).then(function(normalized_input) {
    gm.crop(normalized_input.read_stream, width, height, target_file_type).then(function(read_stream) {
      if(normalized_input.path) fs.unlink(normalized_input.path);

      deferred.resolve({ read_stream: read_stream });
    });
  });

  return deferred.promise;
}

var convert = function (input, target_file_type) {
  var deferred = Q.defer();

  handler_input_helper.normalize_input(input).then(function(normalized_input) {
    gm.convert(normalized_input.read_stream, target_file_type).then(function(read_stream) {
      if(normalized_input.path) fs.unlink(normalized_input.path);

      deferred.resolve({ read_stream: read_stream });
    });
  });

  return deferred.promise;
}

module.exports.resize = resize;
module.exports.convert = convert;
