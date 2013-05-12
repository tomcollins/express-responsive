var express = require('express')
  , fs = require('fs')
  , http = require('http')
  , path = require('path');

var package = fs.readFileSync('package.json');
package = JSON.parse(package);

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
});

app.configure('production', function () {
  app.use();
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
  console.log("Express server listening on port " + app.get('port') +" in " +process.env.NODE_ENV);
});
