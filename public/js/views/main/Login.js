/*global define*/
define(
  ['marionette','vent',
   'tpl!templates/main/login.tmpl'],
  function (Marionette, vent, tmpl) {
    'use strict';

    return Marionette.ItemView.extend({
      template: tmpl,
      className: 'tr-container'
    });
  }
);

