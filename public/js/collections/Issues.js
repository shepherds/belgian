define(
  ['backbone', 'models/Issue'],
  function(Backbone, Issue) {
    'use strict';

    return Backbone.Collection.extend({
      model: Issue,
      url: 'api/issues'
    });
  }
);
