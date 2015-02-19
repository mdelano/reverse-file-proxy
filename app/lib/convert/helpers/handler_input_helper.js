'use strict'

var fs      = require('fs');
var uuid    = require('node-uuid');
var Q       = require('q');

var normalize_input = function(input, persisted_stream) {
  var deferred = Q.defer();
  if(typeof input == 'string') {
    var read_stream = fs.createReadStream(input);
    deferred.resolve({ read_stream: read_stream, path: input });
  }
  else {
    if(persisted_stream) {
      persist_stream(input).then(function(persisted_file_path){
        deferred.resolve({ read_stream: input, path: persisted_file_path });
      });
    }
    else {
      deferred.resolve({ read_stream: input });
    }
  }

  return deferred.promise;
}

var persist_stream = function(read_Stream) {
  var deferred = Q.defer();

  var file_name = uuid.v1();
  var file_path = '/tmp/' + file_name;
  var write_stream = fs.createWriteStream(file_path);
  var write_pipe = read_Stream.pipe(write_stream);

  write_pipe.on('finish', function() {
    deferred.resolve(file_path);
  });

  return deferred.promise;
}

module.exports.normalize_input = normalize_input;
