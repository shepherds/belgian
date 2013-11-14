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

    app.post('/login', function(req, res) {
      var options = {
        host: req.body['fqdn'],
        port: 80,
        path: '/api/v3/users?private_token=' + req.body['private-token'],
        method: 'GET'
      };

      var data = '';
      http.request(options, function(r) {
        if (r.statusCode === 403) {
          res.redirect('/?accessDenied=true');
        }
        else if (r.statusCode !== 200) {
          res.redirect('/?error=true');
        }
        
        r.setEncoding('utf8');
        r.on('data', function (chunk) {
          data += chunk;
        });
        r.on('end', function() {
          var users = JSON.parse(data);
          console.log(users);
          console.log(_.find(users, { 'username': req.body['username'] }));
          var o = _.extend({}, req.body);
          o = _.extend(o, _.find(users, { 'username': req.body['username'] }));
          res.cookie('belgian', o);
          res.redirect('/#/home');
        });
      }).end();
    });

    app.get('/api/issues/:id?*', function(req, res) {
      var options = {
        host: req.cookies.belgian['fqdn'],
        port: 80,
        path: '/api/v3/issues/' + ((req.params.id) ? req.params.id : '') + '?private_token=' + req.cookies.belgian['private-token'],
        method: 'GET'
      };

      var data = '';
      http.request(options, function(r) {
        if (r.statusCode === 403) {
          res.redirect('/?accessDenied=true');
        }
        else if (r.statusCode !== 200) {
          res.redirect('/?error=true');
        }
        
        r.setEncoding('utf8');
        r.on('data', function (chunk) {
          data += chunk;
        });
        r.on('end', function() {
          console.log(JSON.parse(data));
          res.send(data);
        });
      }).end();
    });

    app.post('/api/issues/:id?*', function(req, res) {
      console.log(req.params.id);
    });

    app.patch('/api/issues/:id?*', function(req, res) {
      
    });

    app.delete('/api/issues/:id?*', function(req, res) {
      
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