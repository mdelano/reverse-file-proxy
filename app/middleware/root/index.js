////////////////////////////////////////////////////////
// Mike Delano
// MediaSilo 2015
//
// This file handles the route for handling images
// (/image)
////////////////////////////////////////////////////////

'use strict';

var request     = require('request');
var gm          = require('gm');
var logger      = require('../../util/logger').logger;
var fs          = require('fs');
var uuid        = require('node-uuid');
var path        = require('path')
var exec        = require('child_process').exec;
var image         = require('../../lib/convert/image');
var asset_helper  = require('../../lib/convert/asset_helper');
// Routes

var routes = [];



// GET Version 1.0.0
routes.push({
  meta: {
    name: 'getLegacy',
    method: 'GET',
    paths: [
    '/'// The type specifies the target file type (jpg, png, gif, etc.)
    ],
    version: '1.0.0',
  },
  middleware: function( req, res, next ) {

    var file_extension = path.extname(req.params.src);
    var type = 'swf';

    if(req.params.type) {
      type = req.params.type.toLowerCase();
    }

    if(req.params.format) {
      type = req.params.format.toLowerCase();;
    }


    if(req.params.previewformat) {
      type = req.params.previewformat.toLowerCase();;
    }

    if(file_extension) {
      file_extension = file_extension.substr(1);
    }

    if(file_extension.toLowerCase() == 'jpg' || file_extension.toLowerCase() == 'jpeg' || file_extension.toLowerCase() == 'png') {
      var image_middleware = require('../image');

      if(req.params.thumbnail) {
        var dimensions = req.params.thumbnail.split('x');
        image_middleware.resize(req.params.src, dimensions[0], dimensions[1], type, null, res, next, true);
      }
      else {
        image_middleware.convert(req.params.src, type, res, next, true);
      }
    }
    else {
      var doc_middleware = require('../document');
      doc_middleware.convert(req.params.src, type, res, next, true);
    }
  }
});

module.exports = routes;
