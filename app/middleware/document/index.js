////////////////////////////////////////////////////////
// Mike Delano
// MediaSilo 2015
//
// This file handles the route for handling documents
// (/document)
////////////////////////////////////////////////////////

'use strict';

var logger        = require('../../util/logger').logger;
var doc           = require('../../lib/convert/document');
var asset_helper  = require('../../lib/convert/asset_helper');

// Routes

var routes = [];


// GET Version 1.0.0
routes.push({
  meta: {
    name: 'getConvertedDocument',
    method: 'GET',
    paths: [
    '/document/:type' // The type specifies the target file type (pdf, svg, swf, etc.)
    ],
    version: '1.0.0',
  },
  middleware: function( req, res, next ) {
    convert(req.params.url, req.params.type, res, next);
  }
});

var convert = function(url, type, res, next, buffered_response) {
  doc.convert(url, type)
  .then(function(result) {
    var content_type = asset_helper.get_content_type({ extension: type, url: url });
    res.header('content-type', content_type);
    res.header('cache-control', 'max-age=7776000');

    logger.debug("converted document asset " + url + " to " + type);

    if(!buffered_response) {
      var read_stream = result.read_stream;
      var response_pipe = read_stream.pipe(res);

      response_pipe.on('finish', function() {
        logger.debug("sent converted " + url + " to client");
        if(result.path) {
          fs.unlink(result.path, function (err) {
            if (err) {
              logger.error(err);
            }
          });
        }
        res.end();
        return next();
      });
    }
    else {
      var fs = require('fs');
      var stats = fs.statSync(result.path)
      var fileSizeInBytes = stats["size"]

      res.writeHead(200, {
        'Content-Length': fileSizeInBytes,
      });
      res.write(fs.readFileSync(result.path));
      res.end();
    }

  }).fail(function(f) {
    logger.error(f);
    res.send(500);
    return next();
  });
}

module.exports = routes;
module.exports.convert = convert;
