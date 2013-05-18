var express = require('express')
  , fs = require('fs')
  , http = require('http')
  , path = require('path');

if (undefined === process.env.NODE_ENV || "" === process.env.NODE_ENV) {
  throw('NODE_ENV is not set');
}
var environment = process.env.NODE_ENV;

var package = fs.readFileSync('package.json');
package = JSON.parse(package);

var staticPath = require('./lib/express-staticpath-middlewear').create('static-' +package.version);

var routes = require('./routes');
routes.package = package;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(staticPath.middleware);
  app.locals({
    staticPath: staticPath.staticPath,
    environment: environment
  });
});

app.configure('production', function () {
  app.use(require('less-middleware')({ 
    src: __dirname + '/public',
    compress: true
  }));
  app.use(express.compress());
  app.use(express.static(path.join(__dirname, 'public'), { maxAge: 365 * 24 * 60 * 60 * 1000 }));
  app.use(express.errorHandler());
});

app.configure('development', function () {
  app.use(express.logger('dev'));
  app.use(require('less-middleware')({ 
    src: __dirname + '/public'
  }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port') +" in " +environment);
});
