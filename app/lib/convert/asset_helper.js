'us strict'

var Q       = require('q');
var fs      = require('fs');
var uuid    = require('node-uuid');
var im      = require('imagemagick');
var gm      = require('gm');
var path    = require('path');
var request = require('request');

var getRemoteImageIdentity = function(url) {
  var deferred = Q.defer();

  var file_extension = path.extname(url);

  if(!file_extension || file_extension.length <= 1 || file_extension.length > 4) {
    var file_name = uuid.v1();
    var file_path = '/tmp/' + file_name;
    var writable = fs.createWriteStream(file_path);
    var download_pipe = request(url).pipe(writable);

    download_pipe.on('finish', function () {

      im.identify(file_path, function(im_err, im_value){
        if(im_err) {
          gm(file_path).identify(function(gm_error, gm_value) {
              if(gm_error) {
                deferred.reject(gm_error);
              }

              deferred.resolve(gm_value.format.toLowerCase());
              fs.unlink(file_path);
          })
        }
        else {
          deferred.resolve(im_value.format.toLowerCase());
          fs.unlink(file_path);
        }
      });

    });
  }
  else {
    deferred.resolve(file_extension.substr(1).toLowerCase());
  }

  return deferred.promise;
}

var getRemoteDocumentIdentity = function(url) {
  var deferred = Q.defer();

  var file_extension = path.extname(url);
  deferred.resolve(file_extension.substr(1).toLowerCase());

  return deferred.promise;
}

var get_content_type = function(options) {
  var extension = options.extension ? options.extension : getRemoteImageIdentity(options.url);

  var content_type = "";
  switch(extension) {
    // Image Type
    case 'bm':
      content_type = 'image/bmp';
      break;
    case 'bmp':
      content_type = 'image/bmp';
      break;
    case 'dwg':
      content_type = 'image/x-dwg';
      break;
    case 'dxf':
      content_type = 'image/x-dwg';
      break;
    case 'fif':
      content_type = 'image/fif';
      break;
    case 'flo':
      content_type = 'image/florian';
      break;
    case 'fpx':
      content_type = 'image/vnd.fpx';
      break;
    case 'g3':
      content_type = 'image/g3fax';
      break;
    case 'gif':
      content_type = 'image/gif';
      break;
    case 'ico':
      content_type = 'image/x-icon';
      break;
    case 'ief':
      content_type = 'image/ief';
      break;
    case 'iefs':
      content_type = 'image/ief';
      break;
    case 'jfif':
      content_type = 'image/jpeg';
      break;
    case 'jfif-tbnl':
      content_type = 'image/jpeg';
      break;
    case 'jpe':
      content_type = 'image/jpeg';
      break;
    case 'jpeg':
      content_type = 'image/jpeg';
      break;
    case 'jpg':
      content_type = 'image/jpeg';
      break;
    case 'jps':
      content_type = 'image/x-jps';
      break;
    case 'jut':
      content_type = 'image/jutvision';
      break;
    case 'mcf':
      content_type = 'image/vasa';
      break;
    case 'nap':
      content_type = 'image/naplps';
      break;
    case 'naplps':
      content_type = 'image/naplps';
      break;
    case 'nif':
      content_type = 'image/x-niff';
      break;
    case 'niff':
      content_type = 'image/x-niff';
      break;
    case 'pbm':
      content_type = 'image/x-portable-bitmap';
      break;
    case 'pcx':
      content_type = 'image/x-pcx';
      break;
    case 'pgm':
      content_type = 'image/x-portable-graymap';
      break;
    case 'pic':
      content_type = 'image/pict';
      break;
    case 'pict':
      content_type = 'image/pict';
      break;
    case 'pm':
      content_type = 'image/x-xpixmap';
      break;
    case 'png':
      content_type = 'image/png';
      break;
    case 'pnm':
      content_type = 'image/x-portable-anymap';
      break;
    case 'qif':
      content_type = 'image/x-quicktime';
      break;
    case 'qti':
      content_type = 'image/x-quicktime';
      break;
    case 'qtif':
      content_type = 'image/x-quicktime';
      break;
    case 'ras':
      content_type = 'image/cmu-raster';
      break;
    case 'ras':
      content_type = 'image/x-cmu-raster';
      break;
    case 'rast':
      content_type = 'image/cmu-raster';
      break;
    case 'rf':
      content_type = 'image/vndcase';
      break;
    case 'rgb':
      content_type = 'image/x-rgb';
      break;
    case 'rp':
      content_type = 'image/vndcase';
      break;
    case 'svf':
      content_type = 'image/x-dwg';
      break;
    case 'tif':
      content_type = 'image/tiff';
      break;
    case 'tif':
      content_type = 'image/x-tiff';
      break;
    case 'tiff':
      content_type = 'image/tiff';
      break;
    case 'turbot':
      content_type = 'image/florian';
      break;
    case 'wbmp':
      content_type = 'image/vndcase';
      break;
    case 'xbm':
      content_type = 'image/x-xbm';
      break;
    case 'xbm':
      content_type = 'image/xbm';
      break;
    case 'xif':
      content_type = 'image/vndcase';
      break;
    case 'xpm':
      content_type = 'image/xpm';
      break;
    case 'x-png':
      content_type = 'image/png';
      break;
    case 'xwd':
      content_type = 'image/x-xwd';
      break;


    // Document Type
    case 'pdf':
      content_type = 'application/pdf';
      break;


    // Other type
    case 'svg':
      content_type = 'image/svg+xml';
      break;
    case 'swf':
      content_type = 'application/x-shockwave-flash';
      //content_type = 'image/jpg';
      break;

    default:
      content_type = '';
  }

  return content_type;
}

module.exports.get_content_type = get_content_type;
module.exports.getRemoteImageIdentity = getRemoteImageIdentity;
module.exports.getRemoteDocumentIdentity = getRemoteDocumentIdentity;
