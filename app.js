var express = require('express');
var app = express();
var http = require('http');
app.set('port', process.env.PORT || 8080);

app.configure(function() {
  var hourMs = 1000*60*60;
  app.use(express.static(__dirname + '/app', { maxAge: hourMs }));
  app.use(express.directory(__dirname + '/app'));
  app.use(express.errorHandler());
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


