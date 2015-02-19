'use strict'

var path = require('path');
var normalizedPath = path.join(__dirname, "");

require('graceful-fs').readdirSync(normalizedPath).forEach(function(file) {
  var file_extension = path.extname(file)
  var file_name = path.basename(file, file_extension);

  if(file != 'index' && file != 'index.js') {
    module.exports[file_name] = require('./'+file_name);
  }
});
