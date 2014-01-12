define([
  'jquery',
  'underscore',
  'backbone',
  'collections/WorkoutsCollection'
], function($, _, Backbone, WorkoutsCollection ){

  var ApplicationView = Backbone.View.extend({

    views: {},

    initialize: function () {
      this.collection = new WorkoutsCollection();
      this.collection.on('sync', this.createViews, this);
      this.collection.fetch();
    },
    createViews: function () {

      var opts = {collection: this.collection};

      // Only create the views on the initial fetch
      this.collection.off('sync', this.createViews, this);

      // Storing references to the views in case we want
      // to do something with them later.

      this.render();
    },
    render: function () {
      // this.$el.fadeIn('slow');
      // return this;
    },
    setView: function(view){
      if(current_view){
        current_view.remove();
      }
      current_view = new view();
      $("#main").append(current_view.render().el);
    }


  });

  return ApplicationView;

});