'use strict'

var Q                     = require('q');
var fs                    = require('fs');
var uuid                  = require('node-uuid');
var handler_input_helper  = require('../../helpers/handler_input_helper');
var im                    = require('../services').im;

var resize = function (input, width, height, target_file_type) {

  var deferred = Q.defer();

  handler_input_helper.normalize_input(input, true).then(function(normalized_input) {
    var file_name = uuid.v1();
    var file_path = '/tmp/' + file_name + "." + target_file_type;

    im.crop(normalized_input.path, file_path, width, height, target_file_type).then(function(){
        var read_stream = fs.createReadStream(file_path);

        fs.unlink(normalized_input.path);

        deferred.resolve({ read_stream: read_stream, path: file_path });
    });
  });

  return deferred.promise;
}

var convert = function (input, target_file_type) {

  var deferred = Q.defer();

  handler_input_helper.normalize_input(input, true).then(function(normalized_input) {
    var file_name = uuid.v1();
    var file_path = '/tmp/' + file_name + "." + target_file_type;

    im.convert(normalized_input.path, file_path, target_file_type).then(function(){
      var read_stream = fs.createReadStream(file_path);

      fs.unlink(normalized_input.path);

      deferred.resolve({ read_stream: read_stream, path: file_path });
    });
  });

  return deferred.promise;
}

module.exports.resize = resize;
module.exports.convert = convert;
