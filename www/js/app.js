// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone',
  'routers/router', // Request router.js
  'views/ApplicationView',
  'bootstrap',
  'moment'
], function($, _, Backbone, Router, ApplicationView){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
    // new ApplicationView({el: '#main'});
    Router.initialize();
  };

  return {
    initialize: initialize
  };
});
