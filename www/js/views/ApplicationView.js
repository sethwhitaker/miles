define([
  'jquery',
  'underscore',
  'backbone',
  'collections/WorkoutsCollection',
  'views/AddWorkoutView',
  'views/LogView',
  'views/StatsView'
], function($, _, Backbone, WorkoutsCollection, AddWorkoutView, LogView, StatsView ){

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
      this.views.addWorkoutView = (new AddWorkoutView(opts));
      this.views.workoutlog = (new LogView(opts));
      this.views.workoutStats = (new StatsView(opts));
      this.render();
    },
    render: function () {
      this.$el.fadeIn('slow');
      return this;
    }

  });

  return ApplicationView;

});