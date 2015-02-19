'use strict'

var Q   = require('q');
var gm  = require('gm');

var crop = function(input_read_stream, width, height, format) {
  return Q.fcall(function() {
    return gm(input_read_stream)
    .resize(width, height, '^')
    .gravity('Center')
    .crop(width, height)
    .stream(format);
  });
}

var convert = function(input_read_stream, format) {
  return Q.fcall(function() {
    return gm(input_read_stream)
    .stream(format);
  });
}

module.exports.crop = crop;
module.exports.convert = convert;
