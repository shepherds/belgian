/*global $*/
define(
  [
    'backbone','marionette','router','controller','vent','text!pj',
    'views/nav/NavBar', 'views/main/Home'
  ],
  function(
    Backbone, Marionette, Router, Controller, vent, pj, NavBar, Home
  ) {
    'use strict';

    pj = JSON.parse(pj);

    var user,
        router,
        model;
    var app = new Marionette.Application();

    app.addRegions({
      navbar: '#navbar',
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

      router = new Router({ controller: Controller });
      app.navbar.show(new NavBar({model: new Backbone.Model({title: pj.title})}));
      app.home.show(new Home());
      router.navigate(window.location.hash || '#', { 'trigger': true });
    });

    app.on('initialize:after', function(options) {
      Backbone.history.start();
    });

    return app;
  }
);
