////////////////////////////////////////////////////////
// Mike Delano
// MediaSilo 2015
//
// This file is responsible for converting documents
// to SWF's
////////////////////////////////////////////////////////


'use strict'

var fs                    = require('graceful-fs');
var uuid                  = require('node-uuid');
var Q                     = require('q');
var any2any               = require('./any2any');
var handler_input_helper  = require('../../helpers').handler_input_helper;
var command_runner        = require('../../helpers').command_runner;
var commands              = require('../commands');

var resize = function (input, width, height, target_file_type, maintain_aspect_ratio) {
  var deferred = Q.defer();

  any2any.resize(input, width, height, 'jpg', maintain_aspect_ratio).then(function(jpg_result) {
    if(!jpg_result.path) {
      var file_name = uuid.v1();
      var file_path = '/tmp/' + file_name + '.jpg';
      var write_stream = fs.createWriteStream(file_path);
      var write_pipe = jpg_result.read_stream.pipe(write_stream);

      write_pipe.on('finish', function() {
        jpeg2swf(file_path).then(function(result) {
          fs.unlink(file_path);

          if(jpg_result.path) {
            fs.unlink(jpg_result.path);
          }

          if(typeof input == 'string') {
            fs.unlink(input);
          }

          deferred.resolve(result);
        });
      });
    }
    else {

      jpeg2swf(jpg_result.path).then(function(result) {
        fs.unlink(jpg_result.path);

        if(typeof input == 'string') {
          fs.unlink(input);
        }

        deferred.resolve(result);
      });
    }
  });

  return deferred.promise;
}

var convert = function (input, target_file_type) {
  var deferred = Q.defer();
  any2any.convert(input, 'jpg').then(function(jpg_result) {
    if(!jpg_result.path) {
      var file_name = uuid.v1();
      var file_path = '/tmp/' + file_name + '.jpg';
      var write_stream = fs.createWriteStream(file_path);
      var write_pipe = jpg_result.read_stream.pipe(write_stream);

      write_pipe.on('finish', function() {
        jpeg2swf(file_path).then(function(result) {
          fs.unlink(file_path);

          if(jpg_result.path) {
            fs.unlink(jpg_result.path);
          }

          if(typeof input == 'string') {
            fs.unlink(input);
          }

          deferred.resolve(result);
        });
      });
    }
    else {

      jpeg2swf(jpg_result.path).then(function(result) {
        fs.unlink(jpg_result.path);

        if(typeof input == 'string') {
          fs.unlink(input);
        }

        deferred.resolve(result);
      });
    }
  });

  return deferred.promise;
}

var jpeg2swf = function(jpeg_path) {
  var deferred = Q.defer();

  var file_name = uuid.v1();
  var out_path = '/tmp/' + file_name + ".swf";

  command_runner.execute(commands.jpg2swf.convert(jpeg_path, out_path)).then(function(result) {
    var result_stream = fs.createReadStream(out_path);
    deferred.resolve({ read_stream: result_stream, path: out_path });
  });

  return deferred.promise;
}

module.exports.resize = resize;
module.exports.convert = convert;
