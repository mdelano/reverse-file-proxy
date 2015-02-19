////////////////////////////////////////////////////////
// Mike Delano
// MediaSilo 2015
//
// This file creates a LibreOffice soffice command
// given arguments
////////////////////////////////////////////////////////

'use strict'

var path    = require('path');

var pdf = function (file_path) {
  return getCommand(file_path, path.dirname(file_path), 'pdf');
}

var getCommand = function (file_path, out_dir, target_file_type) {
  // Use --headless to avoid soffice attempting to open the LibreOffice UI
  return 'soffice --headless --convert-to ' + target_file_type + ' ' + file_path + ' --outdir ' + out_dir;
}

module.exports.pdf = pdf;
