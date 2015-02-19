////////////////////////////////////////////////////////
// Mike Delano
// MediaSilo 2015
//
// This file handles the route for handling images
// (/image)
////////////////////////////////////////////////////////

'use strict';

var request       = require('request');
var logger        = require('../../util/logger').logger;
var fs            = require('fs');
var uuid          = require('node-uuid');
var image         = require('../../lib/convert/image');
var asset_helper  = require('../../lib/convert/asset_helper');

// Routes

var routes = [];



// GET Version 1.0.0
routes.push({
  meta: {
    name: 'getConvertedImage',
    method: 'GET',
    paths: [
    '/image/:type'// The type specifies the target file type (jpg, png, gif, etc.)
    ],
    version: '1.0.0',
  },
  middleware: function( req, res, next ) {
    if(!req.params.w && !req.params.h) {
      convert(
        req.params.url,
        req.params.type,
        res,
        next
      );
    }
    else {
      resize(
        req.params.url,
        req.params.w,
        req.params.h,
        req.params.type,
        req.params.maintain_aspect_ratio,
        res,
        next
      );
    }
  }
});

var resize = function(url, w, h, type, maintain_aspect_ratio, res, next, buffered_response) {
  logger.debug("image conversion:" + url + " to " + w + "x" + h + " " + type);

  image.resize(url, w, h, type, maintain_aspect_ratio)
    .then(function(result) {
      res.header('cache-control', 'max-age=7776000');

      var content_type = asset_helper.get_content_type({ extension: type, url: url });
      res.header('content-type', content_type);

      logger.debug("converted image asset " + url + " to " + type);

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
        res.keepAlive=true;
        if(!result.path) {
          var file_name = uuid.v1();
          var file_path = '/tmp/' + file_name;
          var write_stream = fs.createWriteStream(file_path);
          var write_pipe = result.read_stream.pipe(write_stream);
          write_pipe.on('finish', function() {
            var stats = fs.statSync(file_path)
            var fileSizeInBytes = stats["size"]

            res.writeHead(200, {
              'Connection': 'keep-alive',
              'Keep-Alive': 'timeout=5, max=100',
              'Content-Length': fileSizeInBytes,
            });
            res.end(fs.readFileSync(file_path));
            fs.unlink(file_path);
          });
        }
        else {
          var stats = fs.statSync(result.path)
          var fileSizeInBytes = stats["size"]

          res.writeHead(200, {
            'Connection': 'keep-alive',
            'Keep-Alive': 'timeout=5, max=100',
            'Content-Length': fileSizeInBytes,
          });

          res.end(fs.readFileSync(result.path));
          fs.unlink(result.path);
        }


      }

    }).fail(function(f) {
      logger.error(f);
      res.send(500);
      return next();
    });
}

var convert = function(url, type, res, next, buffered_response) {
  logger.debug("image conversion:" + url + " to " + type);
  image.convert(url, type)
  .then(function(result) {
    res.header('Cache-Control', 'max-age=7776000');

    var content_type = asset_helper.get_content_type({ extension: type, url: url });
    res.header('Content-Type', content_type);

    logger.debug("converted image asset " + url + " to " + type);

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

      res.keepAlive=true;

      if(!result.path) {
        var file_name = uuid.v1();
        var file_path = '/tmp/' + file_name;
        var write_stream = fs.createWriteStream(file_path);
        var write_pipe = result.read_stream.pipe(write_stream);
        write_pipe.on('finish', function() {
          var stats = fs.statSync(file_path)
          var fileSizeInBytes = stats["size"]

          res.writeHead(200, {
            'Connection': 'keep-alive',
            'Keep-Alive': 'timeout=5, max=100',
            'Content-Length': fileSizeInBytes,
          });

          res.write(fs.readFileSync(file_path));
          fs.unlink(file_path);
          res.end();
        });
      }
      else {
        var stats = fs.statSync(result.path)
        var fileSizeInBytes = stats["size"]

        res.writeHead(200, {
          'Connection': 'keep-alive',
          'Keep-Alive': 'timeout=5, max=100',
          'Content-Length': fileSizeInBytes,
        });

        res.write(fs.readFileSync(result.path));
        fs.unlink(result.path);
        res.end();
      }


    }
  }).fail(function(f) {
    logger.error(f);
    res.send(500);
    return next();
  });
}

module.exports = routes;
module.exports.resize = resize;
module.exports.convert = convert;
