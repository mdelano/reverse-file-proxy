////////////////////////////////////////////////////////
// Mike Delano
// MediaSilo 2015
//
// Credit to Dominik Lessel for the restify boilerplate:
// https://github.com/dominiklessel/node-restify-boilerplate
//
// This server is an asset proxy that handles convert file
// formats based on client arguments
////////////////////////////////////////////////////////

'use strict';



// Preflight-checks

if ( !process.env.NODE_ENV ) {
  process.env.NODE_ENV = 'development';
}



// Module dependencies.

var path      = require('path');
var restify   = require('restify');
var logger    = require('./util/logger').logger;
var nconf     = require('nconf').file({
                  file: path.join( __dirname, 'config', 'global.json' )
                });


// Server Setup

var server = restify.createServer({
  name       : nconf.get('Server:Name'),
  version    : nconf.get('Server:DefaultVersion'),
  acceptable : nconf.get('Server:Acceptable'),
  log        : logger
});

// Server Plugins

// We don't need throttling at this time
// but I'll leave it in as a reminder of
// how to implement it
/*
var throttleOptions = {
  rate: nconf.get('Server:ThrottleRate'),
  burst: nconf.get('Server:ThrottleBurst'),
  ip: false,
  username: true
};
*/

var plugins = [
  restify.acceptParser( server.acceptable ),
  //restify.throttle( throttleOptions ),
  restify.dateParser(),
  restify.queryParser(),
  restify.fullResponse(),
];

// You can change what headers restify sends by default by setting the top-level property defaultResponseHeaders. This should be a function that takes one argument data, which is the already serialized response body.
// data can be either a String or Buffer (or null). The this object will be the response itself.
restify.defaultResponseHeaders = function(data) {
  this.header('cache-control', 'max-age=7776000'); // Cache for 90 days
};

if ( nconf.get('Security:UseAuth') ) {
  plugins.push( require( path.join(__dirname, 'plugins', 'customAuthorizationParser') )() );
}

if ( nconf.get('Security:UseACL') ) {
  plugins.push( require( path.join(__dirname, 'plugins', 'customACLPlugin') )() );
}

plugins.push( restify.bodyParser() );
//plugins.push( restify.gzipResponse() );

server.use( plugins );



// Cors

var corsOptions = {
  origins: nconf.get('CORS:Origins'),
  credentials: nconf.get('CORS:Credentials'),
  headers: nconf.get('CORS:Headers'),
};

server.pre( restify.CORS(corsOptions) );

if ( corsOptions.headers.length ) {
  server.on('MethodNotAllowed', require( path.join(__dirname, 'helpers', 'corsHelper.js') )() );
}



// Request / Response Logging

server.on('after', restify.auditLogger({
  log: logger
}));



// Middleware

var registerRoute = function( route ) {

  var routeMethod = route.meta.method.toLowerCase();
  var routeName = route.meta.name;
  var routeVersion = route.meta.version;

  route
    .meta
    .paths
    .forEach(function( aPath ) {
      var routeMeta = {
        name: routeName,
        path: aPath,
        version: routeVersion
      };
      server[routeMethod]( routeMeta, route.middleware );
    });

};

var setupMiddleware = function ( middlewareName ) {
  var routes = require( path.join(__dirname, 'middleware', middlewareName));
  routes.forEach( registerRoute );
};

[
  'document',
  'image',
  'root',
  'xdomain'
]
.forEach( setupMiddleware );


// Start it up!

var listen = function( done ) {
  server.listen( nconf.get('Server:Port'), function() {
    if ( done ) {
      return done();
    }
    console.log();
    console.log( '%s now listening on %s', nconf.get('App:Name'), server.url );
    console.log();
  });
};

if ( !module.parent ) {
  listen();
}

module.exports.listen = listen;
