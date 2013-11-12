/*global define*/
define(
  ['marionette','vent',
   'tpl!templates/main/header.tmpl'],
  function (Marionette, vent, tmpl) {
    'use strict';

    return Marionette.ItemView.extend({
      template: tmpl
    });
  }
);

