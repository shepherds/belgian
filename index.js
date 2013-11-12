var express = require('express'),
        _ = require('lodash'),
        util = require('util'),
        fs = require('fs'),
        async = require('async'),
        http = require('http'),
        path = require ('path'),
        connect = require('connect'),
        sockjs = require('sockjs'),
        pj = require('./package.json');

    var app = express();
    app.configure(function() {
      app.enable('trust proxy');
      app.set('views', __dirname + '/public');
      app.set('view engine', 'ejs');
      app.use(express.favicon());
      app.use(express.logger('dev'));
      app.use(connect.compress());
      app.use(express.json());
      app.use(express.urlencoded());
      app.use(express.cookieParser());
      app.use(express.methodOverride());
      app.use(app.router);
      app.use(require('less-middleware') ({
          src: __dirname + '/public/less',
          dest: __dirname + '/public/css',
          prefix: '/css'
      }));
      app.use(express.static(path.join(__dirname, 'public')));
    });

    app.configure('development', function() {
      app.use(express.errorHandler());
    });

    app.options('*', function(req, res) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELTE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.send(200);
    });

    app.get('/', function(req, res) {
      res.render('index', { title: pj.title, dev: process.argv[2] || false } );
    });

    app.get('/api/issues/:project/:id?*', function(req, res) {
      // http://pangolin.td.teradata.com/api/v3/issues?private_token=...
      res.send([]);
    });

    app.post('/api/issue/:project/:id?*', function(req, res) {
      console.log(req.params.id);
    });

    app.patch('/api/issues/:project/:id?*', function(req, res) {
      
    });

    app.delete('/api/issues/:project/:id?*', function(req, res) {
      
    });

    var server = http.createServer(app);

    // WebSockets
    var socket = sockjs.createServer({ 'sockjs_url': 'http://cdn.sockjs.org/sockjs-0.3.min.js' });

    socket.on('connection', function(connection) {
      var id = connection.id = new ObjectID().toHexString();

      connections.push(connection);

      connection.on('close', function() {
        _.remove(connections, function (connection) {
          return connection.id === id;
        });
      });
    });

    socket.installHandlers(server, { 'prefix': '/ws' });

    server.listen(3000, '0.0.0.0');