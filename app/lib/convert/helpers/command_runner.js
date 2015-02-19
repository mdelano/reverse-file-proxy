'use strict'

var exec  = require('child_process').exec;
var Q     = require('q');

var execute = function(command) {
  var deferred = Q.defer();

  exec(command, function (err, stdout, stderr) {
    if(err) {
      deferred.reject(err);
    }
    else {
      deferred.resolve({stdout: stdout, stderr: stderr});
    }
  });

  return deferred.promise;
}

module.exports.execute = execute;
