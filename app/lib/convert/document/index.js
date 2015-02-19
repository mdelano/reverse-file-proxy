'use strict'

var Q               = require('q');
var path            = require("path");
var request         = require('request');
var asset_helper    = require('../asset_helper');
var handlers        = require('./handlers');

var convert = function (url, target_file_type) {

  var deferred = Q.defer();

  asset_helper.getRemoteDocumentIdentity(url).then(function(ingest_file_type) {
    var handler = get_handler(ingest_file_type, target_file_type);
    handlers[handler].convert(request(url))
    .then(function(result) {
      deferred.resolve(result);
    }).fail(function(f) {
      deferred.reject(f);
    });
  });

  return deferred.promise;
}

var get_handler = function(ingest_file_type, target_file_type) {
  var handler;
  Object.keys(handlers).forEach(function (existing_handler) {
    var target_handler = ingest_file_type.toLowerCase() + '2' + target_file_type.toLowerCase();
    if(existing_handler == target_handler) {
      handler = target_handler;
    }
  });

  if(!handler) {
    Object.keys(handlers).forEach(function (existing_handler) {
      var target_handler = ingest_file_type.toLowerCase() + '2any'
      if(existing_handler == target_handler) {
        handler = target_handler;
      }
    });
  }

  if(!handler) {
    Object.keys(handlers).forEach(function (existing_handler) {
      var target_handler = 'any2' + target_file_type.toLowerCase();
      if(existing_handler == target_handler) {
        handler = target_handler;
      }
    });
  }

  if(!handler) {
    handler = 'any2pdf';
  }

  return handler;
}

module.exports.convert = convert;
