'use strict';

  /** 
    * RequireJS config and shim
    * @see http://requirejs.org/docs/api.html#config
    *
    * Also a good read to explain RequireJS dependency management
    * @link http://aaronhardy.com/javascript/javascript-architecture-requirejs-dependency-management/
      *
    */

requirejs.config({
  // enforceDefine to catch load failures in IE
  // @see http://requirejs.org/docs/api.html#ieloadfail
  // @see http://requirejs.org/docs/api.html#config-enforceDefine
  // See below for load require() | define() comment with this option
  //enforceDefine: true,

    // @see http://requirejs.org/docs/api.html#pathsfallbacks
  // If the CDN location fails, load from local location

  // @TODO - work with local copies in development, and uncomment the CDN hosted when you go live
  paths: {
    'jquery': 'libs/jquery.min',
    'backbone': 'libs/backbone.min',
    'underscore': 'libs/underscore.min',
    'bootstrap': 'libs/bootstrap.min',
    'moment': 'libs/moment.min',
    'templates': '../templates'
    //'twix': 'libs/twix.min',
    //'jquery-ui': 'libs/jquery-ui.min',
  },
  // @see http://requirejs.org/docs/api.html#config-shim
  shim: {
    'jquery': {
      exports: '$'
    },    
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    'bootstrap':  ["jquery"],   
    'moment':  ['jquery'] 
    //'twix':  ['jquery']   
    // 'jquery-ui': {
    //   deps: ['jquery'],
    //   exports: '$.ui',
    // }    
  }
});



require([
  // Load our app module and pass it to our definition function
  'app',

], function(App){
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  App.initialize();
});
