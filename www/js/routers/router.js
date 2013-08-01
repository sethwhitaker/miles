// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/IndexView',
  'views/ListPageView'
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

    setView = function(view){
      if(current_view){
        current_view.remove();
      }
      current_view = new view();
      $("#main").append(current_view.render().el);
    };

    var app_router = new AppRouter;
    var current_view;

    app_router.on('route:showListPage', function(){
        // Call render on the module we loaded in via the dependency array
        setView(ListPageView);
    });

    app_router.on('route:showHomePage', function(){
        // Call render on the module we loaded in via the dependency array
        setView(IndexView);
    });

    app_router.on('route:defaultAction', function (actions) {
      //console.log("index");
       // We have no matching route, lets display the home page
        setView(IndexView);
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
