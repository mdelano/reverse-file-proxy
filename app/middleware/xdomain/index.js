////////////////////////////////////////////////////////
// Mike Delano
// MediaSilo 2015
//
// This file handles the route for handling images
// (/image)
////////////////////////////////////////////////////////

'use strict';

var fs          = require('fs');

// Routes

var routes = [];



// GET Version 1.0.0
routes.push({
  meta: {
    name: 'gerXDomain',
    method: 'GET',
    paths: [
    '/crossdomain.xml'// The type specifies the target file type (jpg, png, gif, etc.)
    ],
    version: '1.0.0',
  },
  middleware: function( req, res, next ) {
    var read_stream = fs.createReadStream('crossdomain.xml');
    res.header('content-type', 'application/xml');
    var response_pipe = read_stream.pipe(res);

    response_pipe.on('finish', function() {
      return next();
    });
  }
});

module.exports = routes;
