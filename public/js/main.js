require.config({
  baseUrl: 'js',
  paths: {
    'backbone':              '../vendor/backbone/backbone',
    'backbone.babysitter':   '../vendor/backbone.babysitter/lib/amd/backbone.babysitter',
    'backbone.wreqr':        '../vendor/backbone.wreqr/lib/amd/backbone.wreqr',
    'bootstrap':             '../vendor/bootstrap/dist/js/bootstrap',
    'jquery':                '../vendor/jquery/jquery',
    'json':                  '../vendor/json2/json2',
    'marionette':            '../vendor/marionette/lib/core/amd/backbone.marionette',
    'pj':                    'package.json', //symlink of root package.json
    'text':                  '../vendor/text/text',
    'tpl':                   '../vendor/tpl/tpl',
    'underscore':            '../vendor/lodash/dist/lodash'
  },
  shim : {
    'backbone' : {
      deps : ['jquery', 'underscore'],
      exports : 'Backbone'
    },
    'bootstrap': {
      deps: ['jquery']
    },
    'jquery' : {
      exports : 'jQuery'
    },
    'underscore' : {
      exports : '_'
    },
    'json' : {
      exports : 'JSON'
    }
  }
});

require(
  ['app','backbone','bootstrap','json'],
  function(app, Backbone) {
    'use strict';

    app.start();
  }
);