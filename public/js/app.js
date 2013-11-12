/*global $*/
define(
  [
    'backbone','marionette','router','controller','vent','text!pj',
    'views/main/Header', 'views/main/Home'
  ],
  function(
    Backbone, Marionette, Router, Controller, vent, pj, Header, Home
  ) {
    'use strict';

    pj = JSON.parse(pj);

    var user,
        router,
        model;
    var app = new Marionette.Application();

    app.addRegions({
      header: '#header',
      home: '#home'
    });

    app.addInitializer(function(){
      $( document ).ajaxStart( function() {
        $('#ajax-spinner').css( {top: '50%', left: '50%', margin: '-' + ( $('#ajax-spinner').height() / 2 ) + 'px 0 0 -' + ( $('#ajax-spinner').width() / 2 ) + 'px' } );
        $('#ajax-spinner').show();
      }).ajaxStop( function() {
        $('#ajax-spinner').hide();
      }).ajaxError( function(jqxhr, status, error) {
        $('#ajax-spinner').hide();
      });

      $(document).on('click', 'a[href="#"]', function(e) {
        //e.stopImmediatePropagation();
        //return false;
      });

      app.header.show(new Header());
      app.home.show(new Home());
      router.navigate(window.location.hash || '#', { 'trigger': true });
    });

    app.on('initialize:after', function(options) {
      router = new Router({ controller: Controller });
      Backbone.history.start();
    });

    return app;
  }
);
