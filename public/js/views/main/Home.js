/*global define*/
define(
  ['marionette','vent',
   'tpl!templates/main/home.tmpl',
   'collections/Issues'],
  function (Marionette, vent, tmpl, Issues) {
    'use strict';

    return Marionette.ItemView.extend({
      template: tmpl,
      initialize: function() {
      	var self = this;
      	this.issues = new Issues();
      	this.issues.fetch({
      		success: function() {
      			self.render();
      		}
      	});
      }
    });
  }
);

