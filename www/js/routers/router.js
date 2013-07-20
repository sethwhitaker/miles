// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/IndexView',
  'views/ListPageView',
  //'views/footer/FooterView'
//], function($, _, Backbone, HomeView, ProjectsView, ContributorsView, FooterView) {
], function($, _, Backbone, IndexView, ListPageView) {

  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'list': 'showListPage',
      'home': 'showHomePage',

      // Default
      '*actions': 'defaultAction'
    }
  });

  var initialize = function(){

    var app_router = new AppRouter;

    app_router.on('route:showListPage', function(){

        // Call render on the module we loaded in via the dependency array
        var listPageView = new ListPageView();
        listPageView.render();

    });

    app_router.on('route:showHomePage', function(){

        // Call render on the module we loaded in via the dependency array
       var indexView = new IndexView();
        indexView.render();

    });


    app_router.on('route:defaultAction', function (actions) {
      console.log("index");
       // We have no matching route, lets display the home page
        var indexView = new IndexView();
        indexView.render();
    });

    // Unlike the above, we don't call render on this view as it will handle
    // the render call internally after it loads data. Further more we load it
    // outside of an on-route function to have it loaded no matter which page is
    // loaded initially.
    //var footerView = new FooterView();

    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});
