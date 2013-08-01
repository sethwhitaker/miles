define([
  'jquery',
  'underscore',
  'backbone',
  'collections/WorkoutsCollection',
  'views/AddWorkoutView',
  'views/LogView',
  'views/StatsView',
  'text!/templates/IndexTemplate.html'
], function($, _, Backbone,  WorkoutsCollection, AddWorkoutView, LogView, StatsView , IndexTemplate ){

  var IndexView = Backbone.View.extend({
    //el: $("#main"),

    template : _.template(IndexTemplate),

    initialize: function () {
      this.collection = new WorkoutsCollection();
      this.collection.on('sync', this.render, this);
      this.collection.fetch();
    },
    render: function () {
      this.$el.html(this.template);
      this.createViews();
      return this;
    },
    createViews:function(argument) {
      var opts = {collection: this.collection};

      // Only create the views on the initial fetch
      this.collection.off('sync', this.createViews, this);

      // Storing references to the views in case we want
      // to do something with them later.
      this.addWorkoutView = new AddWorkoutView(opts);
      this.workoutlog = new LogView(opts);
      this.workoutStats = new StatsView(opts);

      this.$('#addWorkoutPanel').append(this.addWorkoutView.el);
      // this.$('#addWorkoutPanel').append(this.addWorkoutView.el).append(this.innerView2.el);

      $('aside.sidebar').affix({
        'offset-top': '80',
        'offset-bottom': '85'
      });
    }

  });

  return IndexView;

});