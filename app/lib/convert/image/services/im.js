'use strict'

var Q   = require('q');
var im  = require('imagemagick');

var crop = function(src_file_path, dest_file_path, width, height, format, gravity) {

  if(!gravity) gravity = "Center";
  var deferred = Q.defer();

  im.crop({
    srcPath :   src_file_path,
    dstPath :   dest_file_path,
    width   :   width,
    height  :   height,
    format  :   format,
    gravity: gravity
  }, function(err, stdout, stderr){
    if (err) {
      deferred.reject(err);
    }
    deferred.resolve({stdout: stdout, stderr: stderr});
  });

  return deferred.promise;
}

var convert = function(src_file_path, dest_file_path, format) {
  var deferred = Q.defer();

  im.convert({
    srcPath :   src_file_path,
    dstPath :   dest_file_path,
    format  :   format
  }, function(err, stdout, stderr){
    if (err) {
      deferred.reject(err);
    }

    deferred.resolve({stdout: stdout, stderr: stderr});
  });

  return deferred.promise;
}

module.exports.crop = crop;
module.exports.convert = convert;
